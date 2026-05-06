import Link from "next/link"
import { Download, Search } from "lucide-react"
import { Prisma } from "@prisma/client"
import { AdminPageHeader } from "@/components/admin/page-header"
import { prisma } from "@/lib/prisma"
import { formatRM, cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 50
const STATUS_TABS = [
  { id: "", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
] as const

const TYPES = ["", "sadaqah", "zakat", "waqf", "general"] as const

type Props = {
  searchParams: Promise<{
    status?: string
    type?: string
    campaign?: string
    q?: string
    page?: string
  }>
}

export default async function AdminContributionsPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page ?? "1"))
  const where = buildWhere(sp)

  const [items, total, paidSum, statusCounts, allCampaigns] = await Promise.all([
    prisma.contribution.findMany({
      where,
      include: { campaign: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contribution.count({ where }),
    prisma.contribution.aggregate({ where: { ...where, status: "paid" }, _sum: { amount: true } }),
    prisma.contribution.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.campaign.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
  ])

  const statusCountMap = Object.fromEntries(statusCounts.map((s) => [s.status, s._count._all]))
  const totalAll = statusCounts.reduce((s, c) => s + c._count._all, 0)
  const totalPaid = paidSum._sum.amount ?? 0

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const exportHref = `/admin/contributions/export.csv?${qsFromParams(sp)}`

  return (
    <>
      <AdminPageHeader
        title="Contributions"
        subtitle={`${total.toLocaleString("en-MY")} of ${totalAll.toLocaleString("en-MY")} · ${formatRM(totalPaid)} paid (filtered)`}
        actions={
          <Link
            href={exportHref}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-teal)] px-3.5 py-2 text-[0.86rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
          >
            <Download size={14} strokeWidth={2.4} />
            Export CSV
          </Link>
        }
      />

      <div className="space-y-6 p-6 md:p-8">
        {/* Filters */}
        <form
          method="get"
          className="grid items-end gap-3 sm:grid-cols-12"
          action="/admin/contributions"
        >
          {/* status tabs (preserved as hidden when other filters change) */}
          <div className="sm:col-span-12 flex flex-wrap gap-2">
            {STATUS_TABS.map((t) => {
              const active = (sp.status ?? "") === t.id
              const c = t.id ? (statusCountMap[t.id] ?? 0) : totalAll
              const params = new URLSearchParams()
              if (sp.type) params.set("type", sp.type)
              if (sp.campaign) params.set("campaign", sp.campaign)
              if (sp.q) params.set("q", sp.q)
              if (t.id) params.set("status", t.id)
              return (
                <Link
                  key={t.id || "all"}
                  href={`/admin/contributions${params.toString() ? `?${params}` : ""}`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[0.82rem] font-medium transition-colors",
                    active
                      ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white"
                      : "border-[var(--color-hairline)] bg-white text-[var(--color-ink)] hover:border-[var(--color-teal)]"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[0.7rem] font-bold tabular-nums",
                      active ? "bg-white/20 text-white" : "bg-[var(--color-ash)] text-[var(--color-ink-muted)]"
                    )}
                  >
                    {c.toLocaleString("en-MY")}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* search + type + campaign */}
          <div className="sm:col-span-5">
            <label htmlFor="q" className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Search name or email
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" />
              <input
                id="q"
                name="q"
                defaultValue={sp.q ?? ""}
                placeholder="alia@…"
                className="w-full rounded-md border border-[var(--color-hairline)] bg-white py-2 pl-9 pr-3 text-[0.88rem] outline-none focus:border-[var(--color-teal)]"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="type" className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Type
            </label>
            <select
              id="type"
              name="type"
              defaultValue={sp.type ?? ""}
              className="w-full rounded-md border border-[var(--color-hairline)] bg-white py-2 px-3 text-[0.88rem] outline-none focus:border-[var(--color-teal)]"
            >
              {TYPES.map((t) => (
                <option key={t || "all"} value={t}>
                  {t ? t.charAt(0).toUpperCase() + t.slice(1) : "All types"}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="campaign" className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Campaign
            </label>
            <select
              id="campaign"
              name="campaign"
              defaultValue={sp.campaign ?? ""}
              className="w-full rounded-md border border-[var(--color-hairline)] bg-white py-2 px-3 text-[0.88rem] outline-none focus:border-[var(--color-teal)]"
            >
              <option value="">All</option>
              <option value="general">General Fund (no campaign)</option>
              {allCampaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <input type="hidden" name="status" value={sp.status ?? ""} />

          <div className="sm:col-span-1 flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-[var(--color-teal)] px-4 py-2 text-[0.86rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
            >
              Apply
            </button>
            {(sp.q || sp.type || sp.campaign) && (
              <Link
                href={`/admin/contributions${sp.status ? `?status=${sp.status}` : ""}`}
                className="rounded-md border border-[var(--color-hairline)] bg-white px-3 py-2 text-[0.86rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
              >
                Reset
              </Link>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="overflow-hidden rounded-md border border-[var(--color-hairline)] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-[0.88rem]">
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Contributor</Th>
                  <Th>Type</Th>
                  <Th>Going to</Th>
                  <Th>Status</Th>
                  <Th>Stripe session</Th>
                  <Th align="right">Amount</Th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[var(--color-ink-muted)]">
                      No contributions match these filters.
                    </td>
                  </tr>
                )}
                {items.map((c) => (
                  <tr key={c.id} className="border-t border-[var(--color-hairline)]">
                    <Td>
                      <span className="text-[var(--color-ink-muted)]">
                        {(c.paidAt ?? c.createdAt).toLocaleDateString("en-MY", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </Td>
                    <Td>
                      <div className="font-medium text-[var(--color-ink)]">{c.contributorName}</div>
                      <div className="truncate text-[0.78rem] text-[var(--color-ink-muted)]">
                        <a href={`mailto:${c.contributorEmail}`} className="hover:text-[var(--color-teal-dark)]">
                          {c.contributorEmail}
                        </a>
                        {c.contributorPhone && (
                          <span className="ml-2">· {c.contributorPhone}</span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <span className="rounded-full bg-[var(--color-ash)] px-2 py-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
                        {c.type}
                      </span>
                    </Td>
                    <Td>
                      {c.campaign ? (
                        <Link
                          href={`/admin/contributions?campaign=${c.campaign.slug ? c.campaignId : c.campaignId}`}
                          className="text-[var(--color-ink-soft)] hover:text-[var(--color-teal-dark)]"
                        >
                          {c.campaign.title}
                        </Link>
                      ) : (
                        <span className="text-[var(--color-ink-muted)]">General Fund</span>
                      )}
                    </Td>
                    <Td>
                      <StatusPill status={c.status} />
                    </Td>
                    <Td>
                      {c.stripeSessionId ? (
                        <code className="rounded bg-[var(--color-ash)] px-1.5 py-0.5 font-mono text-[0.74rem] text-[var(--color-ink-soft)]">
                          {c.stripeSessionId.length > 18
                            ? c.stripeSessionId.slice(0, 8) + "…" + c.stripeSessionId.slice(-6)
                            : c.stripeSessionId}
                        </code>
                      ) : (
                        <span className="text-[0.78rem] text-[var(--color-ink-muted)]">—</span>
                      )}
                    </Td>
                    <Td align="right">
                      <span className="font-display font-bold tabular-nums text-[var(--color-teal-dark)]">
                        {formatRM(c.amount)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {lastPage > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--color-hairline)] px-5 py-3 text-[0.82rem]">
              <span className="text-[var(--color-ink-muted)]">
                Page {page} of {lastPage}
              </span>
              <div className="flex gap-2">
                <PageLink page={Math.max(1, page - 1)} disabled={page === 1} sp={sp}>
                  ← Prev
                </PageLink>
                <PageLink page={Math.min(lastPage, page + 1)} disabled={page === lastPage} sp={sp}>
                  Next →
                </PageLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function buildWhere(sp: {
  status?: string
  type?: string
  campaign?: string
  q?: string
}): Prisma.ContributionWhereInput {
  const where: Prisma.ContributionWhereInput = {}
  if (sp.status) where.status = sp.status
  if (sp.type) where.type = sp.type
  if (sp.campaign) {
    if (sp.campaign === "general") where.campaignId = null
    else where.campaignId = sp.campaign
  }
  if (sp.q) {
    where.OR = [
      { contributorEmail: { contains: sp.q, mode: "insensitive" } },
      { contributorName: { contains: sp.q, mode: "insensitive" } },
    ]
  }
  return where
}

function qsFromParams(sp: Record<string, string | undefined>) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (v) params.set(k, v)
  }
  return params.toString()
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "paid"
      ? "bg-[#DCFCE7] text-[#15803D]"
      : status === "failed"
        ? "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)]"
        : "bg-[var(--color-ash)] text-[var(--color-ink-soft)]"
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em]",
        styles
      )}
    >
      {status}
    </span>
  )
}

function PageLink({
  page,
  disabled,
  sp,
  children,
}: {
  page: number
  disabled?: boolean
  sp: Record<string, string | undefined>
  children: React.ReactNode
}) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (v && k !== "page") params.set(k, v)
  }
  params.set("page", String(page))
  if (disabled) {
    return (
      <span className="rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[var(--color-ink-muted)]/50">
        {children}
      </span>
    )
  }
  return (
    <Link
      href={`/admin/contributions?${params}`}
      className="rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[var(--color-ink)] transition-colors hover:border-[var(--color-teal)]"
    >
      {children}
    </Link>
  )
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
        align === "right" ? "text-right" : "text-left"
      )}
    >
      {children}
    </th>
  )
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return <td className={cn("px-5 py-3 align-top", align === "right" ? "text-right" : "")}>{children}</td>
}
