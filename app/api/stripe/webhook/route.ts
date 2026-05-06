import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripeClient } from "@/lib/stripe"
import { finalizeContribution, markContributionFailed } from "@/lib/contributions"
import { prisma } from "@/lib/prisma"

/**
 * Stripe webhook receiver.
 *
 * Stripe signs every webhook with a header (`stripe-signature`) tied to the
 * endpoint's signing secret. The SDK's `constructEvent` verifies the
 * signature against the raw body — if the request was forged or tampered
 * with, this throws and we 400.
 *
 * Always return 200 on processed events (even no-ops) so Stripe doesn't
 * retry forever. Return 400 only when the signature itself is invalid.
 *
 * To wire up:
 *   1. In Stripe Dashboard → Developers → Webhooks: add an endpoint
 *      pointing to <NEXT_PUBLIC_SITE_URL>/api/stripe/webhook
 *   2. Subscribe to: checkout.session.completed,
 *      checkout.session.async_payment_succeeded,
 *      checkout.session.async_payment_failed,
 *      checkout.session.expired
 *   3. Copy the signing secret into STRIPE_WEBHOOK_SECRET
 *   4. For local dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
 *      gives you a temporary signing secret printed to the terminal.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripeClient()
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !signingSecret) {
    return NextResponse.json(
      { ok: false, reason: "stripe_not_configured" },
      { status: 200 }
    )
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ ok: false, reason: "no_signature" }, { status: 400 })
  }

  // Need the raw body for signature verification — `req.text()` returns the
  // unparsed string in App Router.
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, signingSecret)
  } catch (err) {
    console.warn(
      "[stripe/webhook] signature verification failed:",
      err instanceof Error ? err.message : err
    )
    return NextResponse.json({ ok: false, reason: "bad_signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session
      const contributionId = session.metadata?.contributionId
      if (!contributionId) {
        console.warn("[stripe/webhook] event missing contributionId metadata")
        break
      }
      const contribution = await prisma.contribution
        .findUnique({ where: { id: contributionId } })
        .catch(() => null)
      if (!contribution) {
        console.warn(`[stripe/webhook] unknown contribution ${contributionId}`)
        break
      }
      // `payment_status` lands as "paid" once the funds settle (instant for
      // cards, async for bank-redirect methods like FPX).
      if (session.payment_status === "paid") {
        await finalizeContribution(contributionId)
      }
      break
    }

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session
      const contributionId = session.metadata?.contributionId
      if (contributionId) {
        await markContributionFailed(contributionId).catch(() => null)
      }
      break
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
