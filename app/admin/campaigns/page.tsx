import Link from "next/link"
import { Plus, ExternalLink, Pencil } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { DeleteButton } from "@/components/admin/delete-button"
import { prisma } from "@/lib/prisma"
import { formatRM, progressPct, cn } from "@/lib/utils"
import { deleteCampaign, toggleCampaignStatus } from "./actions"

export const dynamic = "force-dynamic"

const STATUS_TABS = [
  { id: "", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
  { id: "completed", label: "Completed" },
] as const

type Props = { searchParams: Promise<{ status?: string }> }

export default async function AdminCampaignsPage({ searchParams }: Props) {
  const { status } = await searchParams

  const campaigns = await prisma.campaign.findMany({
    where: status ? { status } : {},
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  })

  const counts = await prisma.campaign.groupBy({
    by: ["status"],
    _count: { _all: true },
  })
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]))
  const total = counts.reduce((s, c) => s + c._count._all, 0)

  return (
    <>
      <AdminPageHeader
        title="Campaigns"
        subtitle={`${total} total · ${countMap.active ?? 0} active · ${countMap.draft ?? 0} draft`}
        actions={
          <Link
            href="/admin/campaigns/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-teal)] px-3.5 py-2 text-[0.86rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
          >
            <Plus size={14} strokeWidth={2.4} />
            New campaign
          </Link>
        }
      />

      <div className="space-y-6 p-6 md:p-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => {
            const active = (status ?? "") === t.id
            const c = t.id ? (countMap[t.id] ?? 0) : total
            const href = t.id ? `/admin/campaigns?status=${t.id}` : "/admin/campaigns"
            return (
              <Link
                key={t.id || "all"}
                href={href}
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
                    "rounded-full px-1.5 text-[0.7rem] font-bold",
                    active ? "bg-white/20 text-white" : "bg-[var(--color-ash)] text-[var(--color-ink-muted)]"
                  )}
                >
                  {c}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-md border border-[var(--color-hairline)] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-[0.88rem]">
              <thead>
                <tr>
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th>Status</Th>
                  <Th>Progress</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[var(--color-ink-muted)]">
                      No campaigns yet.{" "}
                      <Link href="/admin/campaigns/new" className="text-[var(--color-teal-dark)] underline">
                        Create the first one.
                      </Link>
                    </td>
                  </tr>
                )}
                {campaigns.map((c) => {
                  const pct = progressPct(c.raised, c.target)
                  return (
                    <tr key={c.id} className="border-t border-[var(--color-hairline)]">
                      <Td>
                        <Link
                          href={`/admin/campaigns/${c.id}/edit`}
                          className="font-display font-bold text-[var(--color-ink)] hover:text-[var(--color-teal-dark)]"
                        >
                          {c.title}
                        </Link>
                        <div className="mt-0.5 text-[0.74rem] font-mono text-[var(--color-ink-muted)]">
                          /campaigns/{c.slug}
                        </div>
                      </Td>
                      <Td>
                        <span className="inline-flex rounded-full bg-[var(--color-ash)] px-2 py-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
                          {c.category}
                        </span>
                      </Td>
                      <Td>
                        <StatusPill status={c.status} />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--color-teal-pale)]">
                            <div
                              className="h-full rounded-full bg-[var(--color-teal)]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[0.78rem] tabular-nums text-[var(--color-ink-muted)]">
                            {formatRM(c.raised)} / {formatRM(c.target)}
                          </span>
                        </div>
                      </Td>
                      <Td align="right">
                        <div className="flex justify-end gap-2">
                          <form action={async () => { "use server"; await toggleCampaignStatus(c.id) }}>
                            <button
                              type="submit"
                              className="rounded-md border border-[var(--color-hairline)] bg-white px-2.5 py-1.5 text-[0.78rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
                              title={c.status === "active" ? "Move to draft" : "Publish"}
                            >
                              {c.status === "active" ? "Unpublish" : "Publish"}
                            </button>
                          </form>
                          <Link
                            href={`/admin/campaigns/${c.id}/edit`}
                            aria-label={`Edit ${c.title}`}
                            className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-hairline)] bg-white text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
                          >
                            <Pencil size={12} />
                          </Link>
                          <Link
                            href={`/campaigns/${c.slug}`}
                            target="_blank"
                            aria-label={`View ${c.title} on the site`}
                            className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-hairline)] bg-white text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
                          >
                            <ExternalLink size={12} />
                          </Link>
                          <DeleteButton
                            size="sm"
                            confirmMessage={`Delete "${c.title}"?`}
                            action={async () => {
                              "use server"
                              await deleteCampaign(c.id)
                            }}
                          />
                        </div>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "active"
      ? "bg-[#DCFCE7] text-[#15803D]"
      : status === "draft"
        ? "bg-[var(--color-ash)] text-[var(--color-ink-soft)]"
        : "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]"
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

function Td({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode
  align?: "left" | "right"
  className?: string
}) {
  return (
    <td className={cn("px-5 py-3 align-top", align === "right" ? "text-right" : "", className)}>
      {children}
    </td>
  )
}
