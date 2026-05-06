"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createBill } from "@/lib/toyyibpay"
import { finalizeContribution } from "@/lib/contributions"

const ContributionInput = z.object({
  type: z.enum(["sadaqah", "zakat", "waqf", "general"]),
  campaignSlug: z
    .string()
    .optional()
    .nullable()
    .transform((s) => (s && s !== "general-fund" ? s : null)),
  amount: z.coerce
    .number({ message: "Enter a valid amount." })
    .min(5, { message: "Minimum contribution is RM 5." })
    .max(1_000_000, { message: "Amount is too large." }),
  name: z.string().min(2, { message: "Name is required." }).max(100),
  email: z.string().email({ message: "Enter a valid email." }),
  phone: z.string().min(8, { message: "Enter a valid phone number." }).max(20),
})

export type ContributionFormState = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof ContributionInput>, string>>
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

export async function submitContribution(
  _prevState: ContributionFormState | null,
  formData: FormData
): Promise<ContributionFormState> {
  const parsed = ContributionInput.safeParse({
    type: formData.get("type"),
    campaignSlug: formData.get("campaignSlug"),
    amount: formData.get("amount"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  })

  if (!parsed.success) {
    const fieldErrors: ContributionFormState["fieldErrors"] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof ContributionInput>
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors }
  }

  const { type, campaignSlug, amount, name, email, phone } = parsed.data

  // Resolve campaign by slug, if any.
  let campaignId: string | null = null
  let campaignTitle = "HeartSpace General Fund"
  if (campaignSlug) {
    const campaign = await prisma.campaign.findUnique({
      where: { slug: campaignSlug },
      select: { id: true, title: true, status: true },
    })
    if (!campaign || campaign.status !== "active") {
      return {
        ok: false,
        message: "That campaign is no longer accepting contributions.",
        fieldErrors: { campaignSlug: "Campaign unavailable" },
      }
    }
    campaignId = campaign.id
    campaignTitle = campaign.title
  }

  // Create the pending row first; we need the id as ToyyibPay's external reference.
  const contribution = await prisma.contribution.create({
    data: {
      amount,
      type,
      campaignId,
      contributorName: name,
      contributorEmail: email,
      contributorPhone: phone,
      billCode: "pending", // overwritten below once createBill returns
      status: "pending",
    },
  })

  let bill
  try {
    bill = await createBill({
      billName: `HeartSpace · ${campaignTitle.slice(0, 24)}`,
      billDescription: `${type.toUpperCase()} contribution to HeartSpace`,
      billAmountCents: Math.round(amount * 100),
      billExternalReferenceNo: contribution.id,
      payorName: name,
      payorEmail: email,
      payorPhone: phone,
      returnUrl: `${siteUrl()}/contribute/success?ref=${contribution.id}`,
      callbackUrl: `${siteUrl()}/api/toyyibpay/callback`,
    })
  } catch (err) {
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { status: "failed" },
    })
    redirect(
      `/contribute/failed?reason=${encodeURIComponent(
        err instanceof Error ? err.message : "createBill failed"
      )}`
    )
  }

  await prisma.contribution.update({
    where: { id: contribution.id },
    data: { billCode: bill.billCode },
  })

  // Stub mode: no real payment gateway, so finalize immediately.
  if (bill.stubbed) {
    await finalizeContribution(contribution.id)
  }

  redirect(bill.paymentUrl)
}
