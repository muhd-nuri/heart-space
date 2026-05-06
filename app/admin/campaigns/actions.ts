"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const STATUS = ["active", "draft", "completed"] as const
const CATEGORY = ["healthcare", "disaster", "waqf", "zakat"] as const

const CampaignInput = z.object({
  title: z.string().min(2, "Title is required.").max(200),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes."),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters.")
    .max(2000),
  image: z.string().min(1, "Image path or URL is required.").max(500),
  target: z.coerce
    .number({ message: "Enter a valid amount." })
    .min(1, "Target must be greater than zero."),
  status: z.enum(STATUS),
  category: z.enum(CATEGORY),
  startDate: z.coerce.date({ message: "Pick a valid start date." }),
  endDate: z
    .union([z.literal(""), z.coerce.date()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v as Date)),
})

export type CampaignFormState = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof CampaignInput>, string>>
}

function parseFormData(formData: FormData) {
  return CampaignInput.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    image: formData.get("image"),
    target: formData.get("target"),
    status: formData.get("status"),
    category: formData.get("category"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  })
}

function flattenErrors(parsed: ReturnType<typeof parseFormData>): CampaignFormState {
  if (parsed.success) return { ok: true }
  const fieldErrors: CampaignFormState["fieldErrors"] = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof z.infer<typeof CampaignInput>
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors }
}

function bustCaches(slug: string) {
  revalidatePath("/")
  revalidatePath("/campaigns")
  revalidatePath(`/campaigns/${slug}`)
  revalidatePath("/admin/campaigns")
}

export async function createCampaign(
  _prev: CampaignFormState | null,
  formData: FormData
): Promise<CampaignFormState> {
  const parsed = parseFormData(formData)
  if (!parsed.success) return flattenErrors(parsed)

  try {
    await prisma.campaign.create({ data: parsed.data })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        message: "A campaign with this slug already exists.",
        fieldErrors: { slug: "Already in use" },
      }
    }
    return { ok: false, message: "Could not create campaign. Please try again." }
  }

  bustCaches(parsed.data.slug)
  redirect("/admin/campaigns")
}

export async function updateCampaign(
  id: string,
  _prev: CampaignFormState | null,
  formData: FormData
): Promise<CampaignFormState> {
  const parsed = parseFormData(formData)
  if (!parsed.success) return flattenErrors(parsed)

  // Find old slug so we can revalidate the old detail page if the slug changed.
  const existing = await prisma.campaign.findUnique({
    where: { id },
    select: { slug: true },
  })

  try {
    await prisma.campaign.update({ where: { id }, data: parsed.data })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        message: "A campaign with this slug already exists.",
        fieldErrors: { slug: "Already in use" },
      }
    }
    return { ok: false, message: "Could not update campaign. Please try again." }
  }

  bustCaches(parsed.data.slug)
  if (existing && existing.slug !== parsed.data.slug) {
    revalidatePath(`/campaigns/${existing.slug}`)
  }
  redirect("/admin/campaigns")
}

export async function deleteCampaign(id: string) {
  const c = await prisma.campaign.findUnique({ where: { id }, select: { slug: true } })
  await prisma.campaign.delete({ where: { id } })
  if (c) bustCaches(c.slug)
  redirect("/admin/campaigns")
}

export async function toggleCampaignStatus(id: string) {
  const c = await prisma.campaign.findUnique({ where: { id }, select: { status: true, slug: true } })
  if (!c) return
  const next = c.status === "active" ? "draft" : "active"
  await prisma.campaign.update({ where: { id }, data: { status: next } })
  bustCaches(c.slug)
}
