"use client"

import { motion } from "framer-motion"
import { Users, Calendar } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"
import { formatRM, progressPct } from "@/lib/utils"

type Props = {
  slug: string
  raised: number
  target: number
  contributorCount: number
  endDate: Date | null
}

export function ContributePanel({ slug, raised, target, contributorCount, endDate }: Props) {
  const pct = progressPct(raised, target)
  const days = daysLeft(endDate)
  const reached = raised >= target

  return (
    <aside className="sticky top-[88px] rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-6 shadow-[var(--shadow-card)] md:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-[2.25rem] font-extrabold leading-none tracking-[-0.025em] text-[var(--color-teal-dark)] md:text-[2.6rem]">
          {formatRM(raised)}
        </p>
        <span className="font-display rounded-full bg-[var(--color-teal-pale)] px-2.5 py-1 text-[0.72rem] font-bold tracking-wide text-[var(--color-teal-dark)]">
          {pct}%
        </span>
      </div>
      <p className="mt-1 text-[0.86rem] text-[var(--color-ink-muted)]">
        of {formatRM(target)} target
      </p>

      <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-teal-pale)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-teal-light)]"
        />
      </div>

      {reached && (
        <p className="mt-3 text-[0.82rem] font-medium text-[var(--color-success)]">
          Goal reached. Thank you 🤍
        </p>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--color-hairline)] pt-5">
        <Stat
          icon={<Users size={14} strokeWidth={1.8} />}
          label={contributorCount === 1 ? "contributor" : "contributors"}
          value={contributorCount > 0 ? contributorCount.toLocaleString("en-MY") : "Be the first"}
        />
        {days !== null ? (
          <Stat
            icon={<Calendar size={14} strokeWidth={1.8} />}
            label={days === 1 ? "day left" : "days left"}
            value={days.toString()}
          />
        ) : (
          <Stat
            icon={<Calendar size={14} strokeWidth={1.8} />}
            label="status"
            value="Ongoing"
          />
        )}
      </dl>

      <CTAButton
        href={`/contribute?campaign=${slug}`}
        variant="contribute"
        size="lg"
        arrow
        className="mt-7 w-full justify-center"
      >
        Contribute Now
      </CTAButton>

      <p className="mt-4 text-[0.78rem] leading-relaxed text-[var(--color-ink-muted)]">
        Secure payment via ToyyibPay (FPX, cards, e-wallets). Your contribution
        is logged and a receipt is emailed to you.
      </p>
    </aside>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[var(--color-ink-muted)]">
        {icon}
        <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
          {label}
        </dt>
      </div>
      <dd className="mt-1.5 font-display text-[1.05rem] font-bold text-[var(--color-ink)]">
        {value}
      </dd>
    </div>
  )
}

function daysLeft(endDate: Date | null) {
  if (!endDate) return null
  const ms = endDate.getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}
