import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { contributionReceiptEmail } from "@/lib/email-templates"

/**
 * Finalize a contribution: idempotent state-transition from `pending` →
 * `paid`, and atomic increment of `Campaign.raised`. Called from:
 *
 * - Stub mode of the contribute action (no Stripe account configured)
 * - The Stripe webhook (`checkout.session.completed`)
 *
 * Idempotency: if the row is already `paid`, the function returns without
 * a second campaign increment. Stripe retries webhooks on non-2xx responses
 * and we don't want raised totals to drift.
 */
export async function finalizeContribution(contributionId: string) {
  const result = await prisma.$transaction(async (tx) => {
    const contribution = await tx.contribution.findUnique({
      where: { id: contributionId },
    })
    if (!contribution) return { ok: false as const, reason: "not_found" }
    if (contribution.status === "paid") return { ok: true as const, alreadyPaid: true, contribution }

    const updated = await tx.contribution.update({
      where: { id: contributionId },
      data: { status: "paid", paidAt: new Date() },
    })

    if (updated.campaignId) {
      await tx.campaign.update({
        where: { id: updated.campaignId },
        data: { raised: { increment: updated.amount } },
      })
    }

    return { ok: true as const, alreadyPaid: false, contribution: updated }
  })

  if (result.ok && !result.alreadyPaid) {
    // Receipt email — fire-and-forget so a flaky email provider can't
    // wedge the webhook 200. Errors are logged but not thrown.
    const c = result.contribution
    let campaignTitle: string | null = null
    let campaignSlug: string | null = null
    if (c.campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: c.campaignId },
        select: { title: true, slug: true },
      })
      campaignTitle = campaign?.title ?? null
      campaignSlug = campaign?.slug ?? null
    }

    const tpl = contributionReceiptEmail({
      contributorName: c.contributorName,
      contributorEmail: c.contributorEmail,
      amount: c.amount,
      type: c.type,
      campaignTitle,
      referenceId: c.id,
      paidAt: c.paidAt ?? new Date(),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    })
    sendEmail({
      to: c.contributorEmail,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    }).then((res) => {
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error("[contribution-receipt] send failed:", res.error)
      }
    })

    // Bust the homepage + campaigns pages so the new total shows up.
    revalidatePath("/")
    revalidatePath("/campaigns")
    if (campaignSlug) revalidatePath(`/campaigns/${campaignSlug}`)
  }

  return result
}

export async function markContributionFailed(contributionId: string) {
  await prisma.contribution.update({
    where: { id: contributionId },
    data: { status: "failed" },
  })
}
