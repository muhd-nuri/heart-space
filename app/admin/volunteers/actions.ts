"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

const STATUSES = ["pending", "active", "alumni"] as const

export async function setVolunteerStatus(id: string, status: string) {
  if (!(STATUSES as readonly string[]).includes(status)) return
  await prisma.volunteer.update({ where: { id }, data: { status } })
  revalidatePath("/admin/volunteers")
  revalidatePath("/admin")
}

export async function deleteVolunteer(id: string) {
  await prisma.volunteer.delete({ where: { id } })
  revalidatePath("/admin/volunteers")
  revalidatePath("/admin")
}
