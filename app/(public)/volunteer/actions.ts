"use server"

import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { volunteerConfirmationEmail } from "@/lib/email-templates"

const VolunteerInput = z.object({
  name: z.string().min(2, "Name is required.").max(100),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(8, "Enter a valid phone number.").max(20),
  city: z.string().min(2, "City is required.").max(100),
  age: z
    .union([z.literal(""), z.coerce.number().int().min(13).max(120)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  program: z.enum(["yert", "fellowship", "general", "event"]),
})

export type VolunteerFormState = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof VolunteerInput>, string>>
  /** Filled when ok=true — used for the inline success state. */
  applied?: { firstName: string; program: string }
}

export async function submitVolunteer(
  _prevState: VolunteerFormState | null,
  formData: FormData
): Promise<VolunteerFormState> {
  const parsed = VolunteerInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    age: formData.get("age"),
    program: formData.get("program"),
  })

  if (!parsed.success) {
    const fieldErrors: VolunteerFormState["fieldErrors"] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof VolunteerInput>
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors }
  }

  const { name, email, phone, city, age, program } = parsed.data

  try {
    await prisma.volunteer.create({
      data: {
        name,
        email,
        phone,
        city,
        age: age ?? undefined,
        program,
        status: "pending",
      },
    })
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        ok: false,
        message: "We already have an application from this email. Check your inbox or contact us.",
        fieldErrors: { email: "Already registered" },
      }
    }
    return {
      ok: false,
      message: "Something went wrong. Please try again or contact us directly.",
    }
  }

  const tpl = volunteerConfirmationEmail({
    name,
    email,
    program,
    city,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  })
  // Fire-and-forget — don't fail the submission if email is flaky.
  sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text }).then(
    (res) => {
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error("[volunteer-confirmation] send failed:", res.error)
      }
    }
  )

  return {
    ok: true,
    applied: { firstName: name.split(" ")[0], program },
  }
}
