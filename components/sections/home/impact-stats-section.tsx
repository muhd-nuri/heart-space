"use client"

import { useMemo } from "react"
import CountUp from "react-countup"
import * as Icons from "lucide-react"
import { motion } from "framer-motion"

type Stat = { id: string; label: string; value: string; icon: string; order: number }

function parseValue(value: string) {
  const numeric = parseFloat(value.replace(/[^\d.]/g, ""))
  const suffix = value.replace(/[\d,.\s]/g, "")
  return { numeric: isNaN(numeric) ? 0 : numeric, suffix }
}

export function ImpactStatsSection({ stats }: { stats: Stat[] }) {
  const items = useMemo(() => stats.slice(0, 4), [stats])

  return (
    <section className="relative overflow-hidden bg-[var(--color-teal)] text-white">
      {/* soft texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(700px 300px at 0% 50%, rgba(255,255,255,0.18), transparent 70%), radial-gradient(700px 300px at 100% 50%, rgba(0,0,0,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-0">
          {items.map((stat, i) => {
            const { numeric, suffix } = parseValue(stat.value)
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>>)[stat.icon] ?? Icons.Heart
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                className={`relative flex flex-col items-center text-center md:px-6 ${i > 0 ? "md:before:absolute md:before:left-0 md:before:top-1/2 md:before:h-16 md:before:w-px md:before:-translate-y-1/2 md:before:bg-white/25" : ""}`}
              >
                <Icon size={22} strokeWidth={1.5} className="mb-3 text-white/80" />
                <div className="font-display text-[2.5rem] font-extrabold leading-none tracking-[-0.03em] text-white md:text-[3.5rem] lg:text-[4rem]">
                  <CountUp
                    end={numeric}
                    duration={2.4}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  {suffix && <span aria-hidden>{suffix}</span>}
                </div>
                <div className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
