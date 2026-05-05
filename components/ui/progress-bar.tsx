"use client"

import { motion } from "framer-motion"
import { formatRM, progressPct } from "@/lib/utils"

type Props = {
  raised: number
  target: number
  showLabels?: boolean
  variant?: "light" | "dark"
}

export function ProgressBar({ raised, target, showLabels = false, variant = "light" }: Props) {
  const pct = progressPct(raised, target)
  const reached = raised >= target

  return (
    <div className="w-full">
      {showLabels && (
        <div className="mb-2 flex items-end justify-between gap-3">
          <p className="text-[0.95rem]">
            <span className="font-display font-bold text-[var(--color-teal-dark)]">
              {formatRM(raised)}
            </span>
            <span className="ml-1.5 text-[var(--color-ink-muted)]">
              of {formatRM(target)}
            </span>
          </p>
          <span className="font-display rounded-full bg-[var(--color-teal-pale)] px-2.5 py-1 text-[0.72rem] font-bold tracking-wide text-[var(--color-teal-dark)]">
            {pct}%
          </span>
        </div>
      )}
      <div
        className={`relative h-2 w-full overflow-hidden rounded-full ${variant === "dark" ? "bg-white/15" : "bg-[var(--color-teal-pale)]"}`}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-teal-light)]"
        />
      </div>
      {reached && showLabels && (
        <p className="mt-2 text-[0.78rem] font-medium text-[var(--color-success)]">
          Goal reached. Thank you 🤍
        </p>
      )}
    </div>
  )
}
