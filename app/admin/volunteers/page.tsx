import Link from "next/link"
import { Search } from "lucide-react"
import { Prisma } from "@prisma/client"
import { AdminPageHeader } from "@/components/admin/page-header"
import { DeleteButton } from "@/components/admin/delete-button"
import { VolunteerStatusSelect } from "@/components/admin/volunteer-status-select"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { deleteVolunteer } from "./actions"

export const dynamic = "force-dynamic"

const TABS = [
  { id: "", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "active", label: "Active" },
  { id: "alumni", label: "Alumni" },
] as const

const PROGRAMS = ["", "yert", "fellowship", "general", "event"] as const

type Props = {
  searchParams: Promise<{ status?: string; program?: string; q?: string }>
}

export default async function AdminVolunteersPage({ searchParams }: Props) {
  const sp = await searchParams

  const where: Prisma.VolunteerWhereInput = {}
  if (sp.status) where.status = sp.status
  if (sp.program) where.program = sp.program
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q, mode: "insensitive" } },
      { email: { contains: sp.q, mode: "insensitive" } },
      { city: { contains: sp.q, mode: "insensitive" } },
    ]
  }

  const [items, statusCounts, total] = await Promise.all([
    prisma.volunteer.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.volunteer.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.volunteer.count(),
  ])

  const statusCountMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count._all])
  )

  return (
    <>
      <AdminPageHeader
        title="Volunteers"
        subtitle={`${items.length.toLocaleString("en-MY")} of ${total.toLocaleString("en-MY")} · ${statusCountMap.pending ?? 0} pending`}
      />

      <div className="space-y-6 p-6 md:p-8">
        {/* Filters */}
        <form
          method="get"
          action="/admin/volunteers"
          className="grid items-end gap-3 sm:grid-cols-12"
        >
          <div className="sm:col-span-12 flex flex-wrap gap-2">
            {TABS.map((t) => {
              const active = (sp.status ?? "") === t.id
              const c = t.id ? (statusCountMap[t.id] ?? 0) : total
              const params = new URLSearchParams()
              if (sp.program) params.set("program", sp.program)
              if (sp.q) params.set("q", sp.q)
              if (t.id) params.set("status", t.id)
              return (
                <Link
                  key={t.id || "all"}
                  href={`/admin/volunteers${params.toString() ? `?${params}` : ""}`}
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

          <div className="sm:col-span-7">
            <label htmlFor="q" className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Search name, email, or city
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" />
              <input
                id="q"
                name="q"
                defaultValue={sp.q ?? ""}
                placeholder="alia or kuala…"
                className="w-full rounded-md border border-[var(--color-hairline)] bg-white py-2 pl-9 pr-3 text-[0.88rem] outline-none focus:border-[var(--color-teal)]"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="program" className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Programme
            </label>
            <select
              id="program"
              name="program"
              defaultValue={sp.program ?? ""}
              className="w-full rounded-md border border-[var(--color-hairline)] bg-white py-2 px-3 text-[0.88rem] outline-none focus:border-[var(--color-teal)]"
            >
              {PROGRAMS.map((p) => (
                <option key={p || "all"} value={p}>
                  {p === "" ? "All programmes" : p === "yert" ? "YERT" : p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <input type="hidden" name="status" value={sp.status ?? ""} />

          <div className="sm:col-span-2 flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-[var(--color-teal)] px-4 py-2 text-[0.86rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
            >
              Apply
            </button>
            {(sp.q || sp.program) && (
              <Link
                href={`/admin/volunteers${sp.status ? `?status=${sp.status}` : ""}`}
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
                  <Th>Applied</Th>
                  <Th>Name</Th>
                  <Th>Programme</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[var(--color-ink-muted)]">
                      No volunteer applications match these filters.
                    </td>
                  </tr>
                )}
                {items.map((v) => (
                  <tr key={v.id} className="border-t border-[var(--color-hairline)]">
                    <Td>
                      <span className="text-[var(--color-ink-muted)]">
                        {v.createdAt.toLocaleDateString("en-MY", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </Td>
                    <Td>
                      <div className="font-medium text-[var(--color-ink)]">{v.name}</div>
                      <div className="text-[0.78rem] text-[var(--color-ink-muted)]">
                        <a href={`mailto:${v.email}`} className="hover:text-[var(--color-teal-dark)]">
                          {v.email}
                        </a>
                        {" · "}
                        <a href={`tel:${v.phone}`} className="hover:text-[var(--color-teal-dark)]">
                          {v.phone}
                        </a>
                      </div>
                    </Td>
                    <Td>
                      <span className="rounded-full bg-[var(--color-ash)] px-2 py-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
                        {v.program === "yert" ? "YERT" : v.program}
                      </span>
                    </Td>
                    <Td>
                      <div className="text-[var(--color-ink)]">{v.city}</div>
                      {v.age != null && (
                        <div className="text-[0.78rem] text-[var(--color-ink-muted)]">
                          age {v.age}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <VolunteerStatusSelect id={v.id} current={v.status} />
                    </Td>
                    <Td align="right">
                      <DeleteButton
                        size="sm"
                        confirmMessage={`Delete ${v.name}?`}
                        action={async () => {
                          "use server"
                          await deleteVolunteer(v.id)
                        }}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
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
