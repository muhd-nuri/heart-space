import { cn } from "@/lib/utils"

type Props = {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function AdminPageHeader({ title, subtitle, actions, className }: Props) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-[var(--color-hairline)] bg-white px-6 py-5 md:flex-row md:items-end md:justify-between md:gap-6 md:px-8 md:py-6",
        className
      )}
    >
      <div>
        <h1 className="font-display text-[1.5rem] font-extrabold tracking-[-0.018em] text-[var(--color-ink)] md:text-[1.85rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[0.92rem] text-[var(--color-ink-muted)]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
