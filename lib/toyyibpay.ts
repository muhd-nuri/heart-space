/**
 * ToyyibPay createBill client.
 *
 * Stub mode: when TOYYIBPAY_USER_SECRET_KEY is not set we skip the network
 * call and return a synthetic billCode + an internal "/contribute/success?
 * ref=<id>" URL. The server action in app/contribute/actions.ts also calls
 * finalizeContribution() in stub mode so the dev flow is end-to-end without
 * a real ToyyibPay account.
 *
 * Real mode: posts to {base}/index.php/api/createBill with form-encoded
 * fields, returns the billCode + the public payment URL.
 *
 * Docs: https://toyyibpay.com/apireference/
 */

const TOYYIBPAY_BASE =
  process.env.NEXT_PUBLIC_TOYYIBPAY_BASE_URL ?? "https://toyyibpay.com"

export type CreateBillInput = {
  billName: string                 // ≤ 30 chars (ToyyibPay limit)
  billDescription: string          // ≤ 100 chars
  billAmountCents: number          // amount in cents (RM × 100)
  billExternalReferenceNo: string  // our Contribution.id
  payorName: string
  payorEmail: string
  payorPhone: string
  returnUrl: string                // user redirect after payment
  callbackUrl: string              // server webhook
}

export type CreateBillResult = {
  billCode: string
  paymentUrl: string
  /** True when no ToyyibPay key is set; the action should auto-finalize. */
  stubbed: boolean
}

export async function createBill(input: CreateBillInput): Promise<CreateBillResult> {
  const userSecretKey = process.env.TOYYIBPAY_USER_SECRET_KEY
  const categoryCode = process.env.TOYYIBPAY_CATEGORY_CODE

  if (!userSecretKey || !categoryCode) {
    const billCode = `stub_${input.billExternalReferenceNo.slice(-10)}`
    return {
      billCode,
      // Stub mode: send the user straight to our success page.
      paymentUrl: `/contribute/success?ref=${encodeURIComponent(input.billExternalReferenceNo)}`,
      stubbed: true,
    }
  }

  const body = new URLSearchParams({
    userSecretKey,
    categoryCode,
    billName: input.billName.slice(0, 30),
    billDescription: input.billDescription.slice(0, 100),
    billPriceSetting: "1",                        // fixed amount
    billPayorInfo: "1",
    billAmount: String(input.billAmountCents),
    billReturnUrl: input.returnUrl,
    billCallbackUrl: input.callbackUrl,
    billExternalReferenceNo: input.billExternalReferenceNo,
    billTo: input.payorName,
    billEmail: input.payorEmail,
    billPhone: input.payorPhone,
    billPaymentChannel: "2",                      // FPX + cards
    billContentEmail: "Thank you for your contribution to HeartSpace.",
  })

  const res = await fetch(`${TOYYIBPAY_BASE}/index.php/api/createBill`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`ToyyibPay createBill HTTP ${res.status}`)
  }

  const data = (await res.json()) as Array<{ BillCode?: string; status?: string; msg?: string }>
  const billCode = Array.isArray(data) ? data[0]?.BillCode : undefined
  if (!billCode) {
    throw new Error(`ToyyibPay createBill failed: ${JSON.stringify(data)}`)
  }
  return {
    billCode,
    paymentUrl: `${TOYYIBPAY_BASE}/${billCode}`,
    stubbed: false,
  }
}
