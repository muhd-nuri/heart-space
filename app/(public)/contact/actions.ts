"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/email"
import { contactInquiryEmail } from "@/lib/email-templates"

const TOPICS = ["general", "partner", "csr", "clinical", "institutional", "press", "donor"] as const

const ContactInput = z.object({
  name: z.string().min(2, "Name is required.").max(120),
  email: z.string().email("Enter a valid email."),
  organization: z
    .union([z.literal(""), z.string().max(200)])
    .transform((v) => (v ? v : null))
    .nullable()
    .optional(),
  phone: z
    .union([z.literal(""), z.string().min(8).max(40)])
    .transform((v) => (v ? v : null))
    .nullable()
    .optional(),
  topic: z.enum(TOPICS).default("general"),
  message: z
    .string()
    .min(10, "Tell us a little more — at least 10 characters.")
    .max(4000, "Keep it under 4000 characters."),
})

export type ContactFormState = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof ContactInput>, string>>
  submitted?: { name: string; topic: string }
}

export async function submitContact(
  _prev: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = ContactInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organization: formData.get("organization"),
    phone: formData.get("phone"),
    topic: formData.get("topic") ?? "general",
    message: formData.get("message"),
  })

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof ContactInput>
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors }
  }

  const { name, email, organization, phone, topic, message } = parsed.data

  const tpl = contactInquiryEmail({
    fromName: name,
    fromEmail: email,
    topic,
    message,
    organization,
    phone,
  })

  // Route to the team inbox; reply-to is the contact's address so a hit on
  // "reply" lands in their thread.
  const inbox = process.env.RESEND_TEAM_INBOX ?? "hello@heartspace.my"
  const result = await sendEmail({
    to: inbox,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    replyTo: email,
  })

  if (!result.ok) {
    return {
      ok: false,
      message: "We couldn't deliver your message right now. Try again — or email hello@heartspace.my directly.",
    }
  }

  return { ok: true, submitted: { name, topic } }
}
