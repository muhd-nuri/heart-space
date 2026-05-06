import { headers } from "next/headers"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { buildWhere } from "../page"

/**
 * CSV export of contributions, honoring the same query filters as the
 * admin list page. Auth-guarded (the URL is admin-only and can't be
 * scraped by an unauthenticated client).
 *
 * Cap at 10k rows to avoid runaway exports — admin can re-export with a
 * date range filter when volumes grow.
 */

const COLUMNS = [
  "id",
  "createdAt",
  "paidAt",
  "status",
  "type",
  "amount",
  "currency",
  "campaign",
  "campaignId",
  "contributorName",
  "contributorEmail",
  "contributorPhone",
  "stripeSessionId",
] as const

const MAX_ROWS = 10_000

export async function GET(req: NextRequest) {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null)
  if (!session) return new Response("Unauthorized", { status: 401 })

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries())
  const where = buildWhere(sp)

  const rows = await prisma.contribution.findMany({
    where,
    include: { campaign: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
  })

  const headerLine = COLUMNS.join(",")
  const lines = rows.map((c) =>
    COLUMNS.map((col) => {
      switch (col) {
        case "createdAt":
          return c.createdAt.toISOString()
        case "paidAt":
          return c.paidAt ? c.paidAt.toISOString() : ""
        case "campaign":
          return csvField(c.campaign?.title ?? "General Fund")
        default:
          return csvField(c[col as keyof typeof c] ?? "")
      }
    }).join(",")
  )

  const csv = [headerLine, ...lines].join("\n") + "\n"
  const filename = `contributions-${new Date().toISOString().slice(0, 10)}.csv`

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}

function csvField(value: unknown): string {
  if (value === null || value === undefined) return ""
  const s = String(value)
  // Quote if it contains a comma, quote, or newline. Escape internal quotes.
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}
