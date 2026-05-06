"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const StatInput = z.object({
  label: z.string().min(2, "Label is required.").max(80),
  value: z.string().min(1, "Value is required.").max(40),
  icon: z
    .string()
    .min(1, "Icon name is required.")
    .max(60)
    .regex(/^[A-Za-z][A-Za-z0-9]*$/, "Use a Lucide icon name (e.g. Heart, Truck)."),
  order: z.coerce.number().int().min(0).max(9999),
})

export type StatFormState = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof StatInput>, string>>
}

function flatten(parsed: ReturnType<typeof StatInput.safeParse>): StatFormState {
  if (parsed.success) return { ok: true }
  const fieldErrors: StatFormState["fieldErrors"] = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof z.infer<typeof StatInput>
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors }
}

export async function updateStat(
  id: string,
  _prev: StatFormState | null,
  formData: FormData
): Promise<StatFormState> {
  const parsed = StatInput.safeParse({
    label: formData.get("label"),
    value: formData.get("value"),
    icon: formData.get("icon"),
    order: formData.get("order"),
  })
  if (!parsed.success) return flatten(parsed)

  await prisma.impactStat.update({ where: { id }, data: parsed.data })
  revalidatePath("/")
  revalidatePath("/admin/stats")
  return { ok: true, message: "Saved." }
}

export async function deleteStat(id: string) {
  await prisma.impactStat.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/stats")
}

export async function addStat() {
  const last = await prisma.impactStat.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  })
  await prisma.impactStat.create({
    data: {
      label: "New stat",
      value: "0",
      icon: "Heart",
      order: (last?.order ?? 0) + 1,
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/stats")
}
