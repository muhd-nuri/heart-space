import Link from "next/link"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { id: "", label: "All" },
  { id: "news", label: "News" },
  { id: "mission", label: "Mission" },
  { id: "impact", label: "Impact" },
  { id: "press", label: "Press" },
] as const

export function NewsCategoryFilter({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const isActive = (active ?? "") === c.id
        const href = c.id ? `/news?category=${c.id}` : "/news"
        return (
          <Link
            key={c.id || "all"}
            href={href}
            scroll={false}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.82rem] font-medium tracking-[-0.005em] transition-all",
              isActive
                ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white shadow-[0_3px_0_0_var(--color-teal-dark)]"
                : "border-[var(--color-hairline)] bg-white text-[var(--color-ink)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
            )}
          >
            {c.label}
          </Link>
        )
      })}
    </div>
  )
}
