import { Resend } from "resend"

/**
 * Resend wrapper with auto-stub. When RESEND_API_KEY is unset (local dev,
 * preview envs), `sendEmail` logs the payload to stdout instead of calling
 * Resend, so the contribution flow never hard-fails on missing creds.
 */

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = process.env.RESEND_FROM_EMAIL ?? "HeartSpace <noreply@heartspace.my>"

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  /** Plaintext fallback. Optional but recommended for deliverability. */
  text?: string
  replyTo?: string
}

export type SendEmailResult =
  | { ok: true; id?: string; stubbed: boolean }
  | { ok: false; error: string }

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!resend) {
    // eslint-disable-next-line no-console
    console.log(
      `[email-stub] to=${input.to}\n  subject=${input.subject}\n  (set RESEND_API_KEY in .env to send for real)`
    )
    return { ok: true, stubbed: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    })
    if (error) return { ok: false, error: error.message ?? "Resend error" }
    return { ok: true, id: data?.id, stubbed: false }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown email error",
    }
  }
}
