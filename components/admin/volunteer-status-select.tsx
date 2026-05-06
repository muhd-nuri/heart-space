"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { setVolunteerStatus } from "@/app/admin/volunteers/actions"
import { cn } from "@/lib/utils"

const STATUSES = [
  { id: "pending", label: "Pending" },
  { id: "active", label: "Active" },
  { id: "alumni", label: "Alumni" },
] as const

export function VolunteerStatusSelect({
  id,
  current,
}: {
  id: string
  current: string
}) {
  const [value, setValue] = useState(current)
  const [isPending, startTransition] = useTransition()

  function tone(s: string) {
    if (s === "active") return "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]"
    if (s === "alumni") return "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)] border-[var(--color-teal)]/40"
    return "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)] border-[var(--color-coral)]/40"
  }

  return (
    <span className={cn("relative inline-flex items-center", isPending && "opacity-70")}>
      <select
        aria-label="Volunteer status"
        value={value}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value
          setValue(next)
          startTransition(() => setVolunteerStatus(id, next))
        }}
        className={cn(
          "cursor-pointer appearance-none rounded-full border px-3 py-0.5 pr-7 text-[0.7rem] font-semibold uppercase tracking-[0.1em] outline-none transition-colors focus:ring-2 focus:ring-[var(--color-teal)]/40",
          tone(value)
        )}
      >
        {STATUSES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[0.6rem]">
        {isPending ? <Loader2 size={10} className="animate-spin" /> : "▾"}
      </span>
    </span>
  )
}
