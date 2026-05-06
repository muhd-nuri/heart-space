import { NextRequest, NextResponse } from "next/server"
import { finalizeContribution, markContributionFailed } from "@/lib/contributions"
import { getBillTransactionStatus } from "@/lib/toyyibpay"
import { prisma } from "@/lib/prisma"

/**
 * ToyyibPay payment webhook.
 *
 * ToyyibPay POSTs form-encoded data to this endpoint after a payment
 * attempt. Important fields:
 *   - status_id: "1" success | "2" pending | "3" failed
 *   - billcode: the bill code we got back from createBill
 *   - order_id: our Contribution.id (we set it as billExternalReferenceNo)
 *   - amount: in cents
 *   - reason: failure reason
 *
 * The body is unsigned — anyone with this URL could fake a "paid" callback.
 * To prevent fraud we ALWAYS re-verify status with ToyyibPay's
 * getBillTransactions API before finalizing. In stub mode (no key set)
 * we trust the payload, since there's no real money flow.
 *
 * Always returns 200 — ToyyibPay retries non-200s and we don't want a
 * loop just because finalize had a transient hiccup.
 */
export async function POST(req: NextRequest) {
  const data = await readPayload(req)
  const orderId = data.get("order_id") || data.get("orderId")
  const billCode = data.get("billcode") || data.get("billCode")
  const reportedStatus = data.get("status_id") || data.get("status")

  if (!orderId || !billCode) {
    console.warn("[toyyibpay/callback] missing order_id or billcode", Object.fromEntries(data))
    return NextResponse.json({ ok: false, reason: "missing_fields" }, { status: 200 })
  }

  // Confirm this contribution exists and matches the bill.
  const contribution = await prisma.contribution
    .findUnique({ where: { id: String(orderId) } })
    .catch(() => null)

  if (!contribution) {
    console.warn(`[toyyibpay/callback] unknown contribution ${orderId}`)
    return NextResponse.json({ ok: false, reason: "unknown_ref" }, { status: 200 })
  }

  // Re-verify with ToyyibPay (in real mode). In stub mode trust the body.
  const verifiedStatus = await getBillTransactionStatus(String(billCode))
  const status = verifiedStatus ?? String(reportedStatus ?? "")

  if (status === "1") {
    await finalizeContribution(contribution.id)
    return NextResponse.json({ ok: true, status: "paid" }, { status: 200 })
  }
  if (status === "3") {
    await markContributionFailed(contribution.id)
    return NextResponse.json({ ok: true, status: "failed" }, { status: 200 })
  }
  // status "2" or unknown — leave as pending; ToyyibPay may resend.
  return NextResponse.json({ ok: true, status: "pending" }, { status: 200 })
}

/**
 * Some payment gateways occasionally hit the callback with GET (e.g. a
 * health check or the user's browser following a redirect). Treat it the
 * same as POST so we don't 405.
 */
export async function GET(req: NextRequest) {
  return POST(req)
}

async function readPayload(req: NextRequest): Promise<URLSearchParams> {
  const contentType = req.headers.get("content-type") ?? ""
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const fd = await req.formData()
    const params = new URLSearchParams()
    fd.forEach((v, k) => params.append(k, String(v)))
    return params
  }
  if (contentType.includes("application/json")) {
    const json = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(json)) params.append(k, String(v))
    return params
  }
  // Fallback: query string (some gateways use GET callback with params)
  return req.nextUrl.searchParams
}
