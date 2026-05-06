/**
 * Email HTML templates. Plain strings, no JSX — table-based layouts for
 * client compatibility (Outlook/Gmail). Brand colors are inlined (most
 * email clients strip <style>) and we use a system font stack since web
 * fonts only render in a few clients.
 */

const TEAL = "#1AACB0"
const TEAL_DARK = "#128A8E"
const CORAL = "#F07B72"
const CHARCOAL = "#1C2B2B"
const INK_SOFT = "#374040"
const INK_MUTED = "#6B7F7F"
const HAIRLINE = "#D4E0E0"
const ASH = "#F0F4F4"
const OFF_WHITE = "#F8FAFA"

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

function formatRM(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export type ContributionReceiptInput = {
  contributorName: string
  contributorEmail: string
  amount: number
  type: string
  campaignTitle: string | null
  referenceId: string
  paidAt: Date
  siteUrl: string
}

export function contributionReceiptEmail(c: ContributionReceiptInput) {
  const firstName = c.contributorName.split(" ")[0]
  const subject = `Receipt: your contribution of ${formatRM(c.amount)} to HeartSpace`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${OFF_WHITE};font-family:${FONT};color:${INK_SOFT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${OFF_WHITE};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${HAIRLINE};">
          <!-- Top accent -->
          <tr>
            <td style="height:6px;background:linear-gradient(90deg,${CORAL} 0%,${TEAL} 50%,${CORAL} 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 36px 20px 36px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${TEAL};">
                — Contribution received
              </p>
              <h1 style="margin:14px 0 0 0;font-size:30px;line-height:1.15;font-weight:800;color:${CHARCOAL};letter-spacing:-0.02em;">
                Thank you, ${escapeHtml(firstName)}.
              </h1>
              <p style="margin:14px 0 0 0;font-size:16px;line-height:1.6;color:${INK_SOFT};">
                Your contribution of <strong style="color:${CHARCOAL};">${formatRM(c.amount)}</strong> has been received and processed. Below is your receipt — keep this for tax purposes.
              </p>
            </td>
          </tr>

          <!-- Receipt table -->
          <tr>
            <td style="padding:0 36px 8px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${ASH};border-radius:10px;">
                <tr>
                  <td style="padding:24px 24px 8px 24px;">
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${INK_MUTED};">
                      Receipt
                    </p>
                  </td>
                </tr>
                ${row("Amount", `<strong style="color:${TEAL_DARK};font-size:18px;">${formatRM(c.amount)}</strong>`)}
                ${row("Type", capitalize(c.type))}
                ${row("Going to", c.campaignTitle ? escapeHtml(c.campaignTitle) : "HeartSpace General Fund")}
                ${row("Reference", `<code style="font-family:'SFMono-Regular',Consolas,monospace;font-size:13px;background:#fff;padding:2px 8px;border-radius:4px;border:1px solid ${HAIRLINE};">${c.referenceId.slice(-12).toUpperCase()}</code>`)}
                ${row("Date", formatDate(c.paidAt), true)}
              </table>
            </td>
          </tr>

          <!-- Body copy -->
          <tr>
            <td style="padding:24px 36px 8px 36px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:${INK_SOFT};">
                Every ringgit lands somewhere a hand will pick it up. Operational delivery — medical supplies, mobile clinic logistics, field staff, emergency response — is funded directly by contributions like yours. Administrative overhead is capped at 12% and disclosed in our annual impact report.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:24px 36px 36px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius:9999px;background-color:${TEAL};">
                    <a href="${c.siteUrl}/campaigns" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:9999px;letter-spacing:-0.005em;font-family:${FONT};">
                      See where it goes →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 28px 36px;background-color:${ASH};border-top:1px solid ${HAIRLINE};">
              <p style="margin:0;font-size:12px;line-height:1.6;color:${INK_MUTED};">
                <strong style="color:${CHARCOAL};">HeartSpace · MyHeart</strong><br>
                Lot 1A, Plaza Hamodal, Jalan Tun Razak, 50400 KL, Malaysia<br>
                hello@heartspace.my · +60 3-1234 5678
              </p>
              <p style="margin:14px 0 0 0;font-size:11px;line-height:1.5;color:${INK_MUTED};">
                Registered NGO Malaysia. This email is a tax-eligible receipt.
                Contribution was received on ${formatDate(c.paidAt)}.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:18px 0 0 0;font-size:11px;color:${INK_MUTED};font-family:${FONT};">
          You're receiving this because you contributed to HeartSpace at ${escapeHtml(c.contributorEmail)}.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `Thank you, ${firstName}.`,
    ``,
    `Your contribution of ${formatRM(c.amount)} to HeartSpace has been received.`,
    ``,
    `Receipt`,
    `-------`,
    `Amount:    ${formatRM(c.amount)}`,
    `Type:      ${capitalize(c.type)}`,
    `Going to:  ${c.campaignTitle ?? "HeartSpace General Fund"}`,
    `Reference: ${c.referenceId.slice(-12).toUpperCase()}`,
    `Date:      ${formatDate(c.paidAt)}`,
    ``,
    `See where it goes: ${c.siteUrl}/campaigns`,
    ``,
    `HeartSpace · MyHeart`,
    `Registered NGO Malaysia.`,
  ].join("\n")

  return { subject, html, text }
}

function row(label: string, value: string, last = false) {
  return `<tr>
    <td style="padding:10px 24px ${last ? "24px" : "10px"} 24px;border-top:1px solid ${HAIRLINE};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="40%" style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${INK_MUTED};">
            ${label}
          </td>
          <td align="right" style="font-size:14px;font-weight:600;color:${CHARCOAL};">
            ${value}
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
