import Link from "next/link"
import { ArrowUpRight, HandCoins, Megaphone, Users, UserCheck } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { getDashboardSummary } from "@/lib/admin-data"
import { formatRM } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary()
  const now = new Date().toLocaleDateString("en-MY", { month: "long", year: "numeric" })

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle={`Operations overview · ${now}`}
      />

      <div className="space-y-8 p-6 md:p-8">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Raised this month"
            value={formatRM(summary.monthRaised)}
            sub={`${summary.monthCount} ${summary.monthCount === 1 ? "contribution" : "contributions"}`}
            icon={HandCoins}
            tone="teal"
          />
          <StatCard
            label="Active campaigns"
            value={summary.activeCampaigns.toString()}
            href="/admin/campaigns"
            icon={Megaphone}
          />
          <StatCard
            label="Total contributors"
            value={summary.totalContributors.toLocaleString("en-MY")}
            sub="distinct emails (paid)"
            icon={UserCheck}
          />
          <StatCard
            label="Pending volunteers"
            value={summary.pendingVolunteers.toString()}
            href="/admin/volunteers?status=pending"
            icon={Users}
            tone={summary.pendingVolunteers > 0 ? "coral" : undefined}
          />
        </div>

        {/* Recent activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel
            title="Recent contributions"
            actionHref="/admin/contributions"
            actionLabel="View all"
            className="lg:col-span-2"
          >
            {summary.recentContributions.length === 0 ? (
              <EmptyRow message="No contributions yet." />
            ) : (
              <Table>
                <THead cols={["When", "Contributor", "Type", "Going to", "Amount"]} />
                <tbody>
                  {summary.recentContributions.map((c) => (
                    <tr key={c.id} className="border-t border-[var(--color-hairline)]">
                      <Td>
                        <span className="text-[var(--color-ink-muted)]">
                          {c.paidAt
                            ? new Date(c.paidAt).toLocaleDateString("en-MY", {
                                day: "numeric",
                                month: "short",
                              })
                            : "—"}
                        </span>
                      </Td>
                      <Td>
                        <div className="font-medium text-[var(--color-ink)]">
                          {c.contributorName}
                        </div>
                        <div className="truncate text-[0.78rem] text-[var(--color-ink-muted)]">
                          {c.contributorEmail}
                        </div>
                      </Td>
                      <Td>
                        <span className="rounded-full bg-[var(--color-ash)] px-2 py-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
                          {c.type}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-[var(--color-ink-soft)]">
                          {c.campaign?.title ?? "General Fund"}
                        </span>
                      </Td>
                      <Td className="text-right">
                        <span className="font-display font-bold text-[var(--color-teal-dark)]">
                          {formatRM(c.amount)}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Panel>

          <Panel
            title="Recent volunteers"
            actionHref="/admin/volunteers"
            actionLabel="View all"
          >
            {summary.recentVolunteers.length === 0 ? (
              <EmptyRow message="No applications yet." />
            ) : (
              <ul className="divide-y divide-[var(--color-hairline)]">
                {summary.recentVolunteers.map((v) => (
                  <li key={v.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--color-ink)]">{v.name}</p>
                      <p className="truncate text-[0.78rem] text-[var(--color-ink-muted)]">
                        {v.program === "yert" ? "YERT" : capitalize(v.program)} · {v.city}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.08em] ${
                        v.status === "pending"
                          ? "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)]"
                          : v.status === "active"
                            ? "bg-[#DCFCE7] text-[#15803D]"
                            : "bg-[var(--color-ash)] text-[var(--color-ink-soft)]"
                      }`}
                    >
                      {v.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  tone,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  href?: string
  tone?: "teal" | "coral"
}) {
  const accent =
    tone === "teal"
      ? "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]"
      : tone === "coral"
        ? "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)]"
        : "bg-[var(--color-ash)] text-[var(--color-ink-soft)]"

  const inner = (
    <div className="flex h-full flex-col rounded-md border border-[var(--color-hairline)] bg-white p-5 transition-colors hover:border-[var(--color-teal)]/40">
      <div className="flex items-center justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-md ${accent}`}>
          <Icon size={16} strokeWidth={1.8} />
        </span>
        {href && (
          <ArrowUpRight size={14} className="text-[var(--color-ink-muted)]" />
        )}
      </div>
      <p className="mt-5 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-1 font-display text-[1.85rem] font-extrabold leading-tight tracking-[-0.018em] text-[var(--color-ink)]">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[0.78rem] text-[var(--color-ink-muted)]">{sub}</p>}
    </div>
  )
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  )
}

function Panel({
  title,
  actionHref,
  actionLabel,
  children,
  className = "",
}: {
  title: string
  actionHref?: string
  actionLabel?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`overflow-hidden rounded-md border border-[var(--color-hairline)] bg-white ${className}`}>
      <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-5 py-3.5">
        <h2 className="font-display text-[0.95rem] font-bold text-[var(--color-ink)]">{title}</h2>
        {actionHref && (
          <Link
            href={actionHref}
            className="text-[0.82rem] font-medium text-[var(--color-teal-dark)] hover:text-[var(--color-teal)]"
          >
            {actionLabel ?? "View"} →
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[0.88rem]">{children}</table>
    </div>
  )
}

function THead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr>
        {cols.map((c, i) => (
          <th
            key={c}
            className={`px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)] ${
              i === cols.length - 1 ? "text-right" : "text-left"
            }`}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="px-5 py-10 text-center text-[0.92rem] text-[var(--color-ink-muted)]">
      {message}
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
