import Stripe from "stripe"

/**
 * Stripe client + Checkout-session helper.
 *
 * Stub mode: when STRIPE_SECRET_KEY is unset, `createCheckoutSession` skips
 * the API call and returns a synthetic session id + a redirect URL straight
 * to /contribute/success. The contribute server action then auto-finalises
 * the contribution so the dev flow works end-to-end without a Stripe
 * account.
 *
 * Real mode: creates a Stripe Checkout Session in `payment` mode, with
 * `automatic_payment_methods` so the methods enabled in the Stripe dashboard
 * (cards, FPX, e-wallets, etc.) all show up at checkout. Returns the hosted
 * `url` that the contributor is redirected to.
 */

const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      // Stripe SDK pins the latest API version it was published against —
      // omit `apiVersion` here to ride the SDK's default and avoid type drift.
      typescript: true,
    })
  : null

export type CreateCheckoutSessionInput = {
  amount: number                 // RM (whole units; converted to cents)
  currency?: string              // default "myr"
  contributionId: string         // becomes the session metadata + idempotency key
  description: string            // shown as the line-item product name
  contributorName: string
  contributorEmail: string
  successUrl: string
  cancelUrl: string
}

export type CreateCheckoutSessionResult = {
  sessionId: string
  paymentUrl: string
  /** True when no Stripe key is set; the action should auto-finalize. */
  stubbed: boolean
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
  if (!stripe) {
    const sessionId = `stub_${input.contributionId.slice(-10)}`
    return {
      sessionId,
      paymentUrl: `/contribute/success?ref=${encodeURIComponent(input.contributionId)}`,
      stubbed: true,
    }
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: input.currency ?? "myr",
            unit_amount: Math.round(input.amount * 100),
            product_data: {
              name: input.description.slice(0, 250),
            },
          },
          quantity: 1,
        },
      ],
      customer_email: input.contributorEmail,
      metadata: {
        contributionId: input.contributionId,
        contributorName: input.contributorName.slice(0, 250),
      },
      // The session id IS the idempotency dimension we need — passing the
      // contribution id ensures multiple form retries don't create dupe
      // sessions for the same row.
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      payment_intent_data: {
        metadata: {
          contributionId: input.contributionId,
        },
      },
    },
    { idempotencyKey: `contribution_${input.contributionId}` }
  )

  if (!session.url) throw new Error("Stripe did not return a Checkout URL")

  return {
    sessionId: session.id,
    paymentUrl: session.url,
    stubbed: false,
  }
}

/** Exported for the webhook route — `null` means stub mode. */
export function getStripeClient(): Stripe | null {
  return stripe
}
