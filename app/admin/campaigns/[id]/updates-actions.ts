"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const ImageItem = z.object({
  url: z.string().url(),
  alt: z.string().max(280).optional().nullable(),
})

const UpdateInput = z.object({
  campaignId: z.string().min(1),
  title: z.string().min(2, "Title is required.").max(200),
  body: z.string().min(2, "Body is required.").max(4000),
  postedAt: z
    .union([z.literal(""), z.coerce.date()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? new Date() : (v as Date))),
  images: z
    .string()
    .optional()
    .transform((s) => {
      if (!s) return []
      try {
        const parsed = JSON.parse(s)
        return z.array(ImageItem).max(40).parse(parsed)
      } catch {
        return []
      }
    }),
})

export type UpdateFormState = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof UpdateInput>, string>>
}

function parse(formData: FormData) {
  return UpdateInput.safeParse({
    campaignId: formData.get("campaignId"),
    title: formData.get("title"),
    body: formData.get("body"),
    postedAt: formData.get("postedAt"),
    images: formData.get("images"),
  })
}

function flatten(parsed: ReturnType<typeof parse>): UpdateFormState {
  if (parsed.success) return { ok: true }
  const fieldErrors: UpdateFormState["fieldErrors"] = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof z.infer<typeof UpdateInput>
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors }
}

async function bust(campaignId: string) {
  const c = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { slug: true },
  })
  if (c) revalidatePath(`/campaigns/${c.slug}`)
  revalidatePath(`/admin/campaigns/${campaignId}/edit`)
}

export async function createUpdate(
  _prev: UpdateFormState | null,
  formData: FormData
): Promise<UpdateFormState> {
  const parsed = parse(formData)
  if (!parsed.success) return flatten(parsed)
  const { campaignId, title, body, postedAt, images } = parsed.data
  await prisma.campaignUpdate.create({
    data: { campaignId, title, body, postedAt, images },
  })
  await bust(campaignId)
  return { ok: true }
}

export async function editUpdate(
  id: string,
  _prev: UpdateFormState | null,
  formData: FormData
): Promise<UpdateFormState> {
  const parsed = parse(formData)
  if (!parsed.success) return flatten(parsed)
  const { campaignId, title, body, postedAt, images } = parsed.data
  await prisma.campaignUpdate.update({
    where: { id },
    data: { title, body, postedAt, images },
  })
  await bust(campaignId)
  return { ok: true }
}

export async function deleteUpdate(id: string, campaignId: string) {
  await prisma.campaignUpdate.delete({ where: { id } })
  await bust(campaignId)
}
