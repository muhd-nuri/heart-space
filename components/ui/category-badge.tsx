import { cn } from "@/lib/utils"

const STYLES: Record<string, string> = {
  healthcare: "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]",
  disaster: "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)]",
  zakat: "bg-[#DCFCE7] text-[#15803D]",
  waqf: "bg-[#EDE9FE] text-[#6D28D9]",
  general: "bg-[var(--color-ash)] text-[var(--color-ink)]",
  news: "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]",
  mission: "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)]",
  impact: "bg-[#DCFCE7] text-[#15803D]",
  press: "bg-[var(--color-ash)] text-[var(--color-ink)]",
}

export function CategoryBadge({ category }: { category: string }) {
  const styles = STYLES[category] ?? STYLES.general
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em]",
        styles
      )}
    >
      {category}
    </span>
  )
}
