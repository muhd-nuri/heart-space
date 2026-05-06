import { Plus } from "lucide-react"
import * as Icons from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { StatRow } from "@/components/admin/stat-row"
import { prisma } from "@/lib/prisma"
import { addStat } from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminStatsPage() {
  const stats = await prisma.impactStat.findMany({ orderBy: { order: "asc" } })

  return (
    <>
      <AdminPageHeader
        title="Impact stats"
        subtitle="The four (or more) numbers shown on the homepage Impact strip."
        actions={
          <form action={addStat}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-teal)] px-3.5 py-2 text-[0.86rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
            >
              <Plus size={14} strokeWidth={2.4} />
              Add stat
            </button>
          </form>
        }
      />

      <div className="space-y-6 p-6 md:p-8">
        {/* Live preview */}
        {stats.length > 0 && (
          <div className="overflow-hidden rounded-md border border-[var(--color-hairline)] bg-[var(--color-teal)] text-white">
            <div className="border-b border-white/15 bg-black/10 px-5 py-2.5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/70">
                Live preview · how it renders on the homepage
              </p>
            </div>
            <div
              className="grid gap-y-6 p-6 md:p-8"
              style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
            >
              {stats.slice(0, 4).map((s) => {
                const Icon =
                  (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[s.icon]
                return (
                  <div key={s.id} className="flex flex-col items-center text-center">
                    {Icon ? (
                      <Icon size={20} strokeWidth={1.5} className="mb-2 text-white/80" />
                    ) : (
                      <span className="mb-2 inline-block h-5 w-5" />
                    )}
                    <div className="font-display text-[2rem] font-extrabold leading-none tracking-[-0.025em] text-white md:text-[2.6rem]">
                      {s.value}
                    </div>
                    <div className="mt-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white/80">
                      {s.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Editable rows */}
        <div className="space-y-3">
          {stats.length === 0 ? (
            <div className="rounded-md border border-dashed border-[var(--color-hairline)] bg-white p-10 text-center text-[var(--color-ink-muted)]">
              No impact stats yet. Click <span className="font-display font-bold text-[var(--color-ink)]">Add stat</span> above to create the first.
            </div>
          ) : (
            stats.map((s) => <StatRow key={s.id} stat={s} />)
          )}
        </div>

        <p className="text-[0.82rem] text-[var(--color-ink-muted)]">
          Order is the integer that decides display position (lowest first).
          The homepage shows the first four. Icon names map to the{" "}
          <a
            href="https://lucide.dev/icons/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-teal-dark)] underline underline-offset-2"
          >
            Lucide icon set
          </a>{" "}
          — match the PascalCase name (e.g. <code className="rounded bg-[var(--color-ash)] px-1.5 py-0.5 font-mono text-[0.78rem]">Heart</code>, <code className="rounded bg-[var(--color-ash)] px-1.5 py-0.5 font-mono text-[0.78rem]">Truck</code>, <code className="rounded bg-[var(--color-ash)] px-1.5 py-0.5 font-mono text-[0.78rem]">Globe</code>, <code className="rounded bg-[var(--color-ash)] px-1.5 py-0.5 font-mono text-[0.78rem]">Users</code>).
        </p>
      </div>
    </>
  )
}
