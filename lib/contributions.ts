import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

/**
 * Finalize a contribution: idempotent state-transition from `pending` →
 * `paid`, and atomic increment of `Campaign.raised`. Called from:
 *
 * - Stub mode of the contribute action (no real ToyyibPay account)
 * - The ToyyibPay webhook (Phase 2(3))
 *
 * Idempotency: if the row is already `paid`, the function returns without
 * a second campaign increment. ToyyibPay sometimes retries callbacks and
 * we don't want raised totals to drift.
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

  if (result.ok && !result.alreadyPaid && result.contribution.campaignId) {
    // Bust the homepage + campaigns pages so the new total shows up.
    revalidatePath("/")
    revalidatePath("/campaigns")
    revalidatePath(`/campaigns/${(await prisma.campaign.findUnique({
      where: { id: result.contribution.campaignId },
      select: { slug: true },
    }))?.slug ?? ""}`)
  }

  return result
}

export async function markContributionFailed(contributionId: string) {
  await prisma.contribution.update({
    where: { id: contributionId },
    data: { status: "failed" },
  })
}
