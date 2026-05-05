"use client"

import { motion } from "framer-motion"
import { Users, Building2, Globe, BarChart3 } from "lucide-react"
import { SectionLabel, SectionWrapper } from "@/components/ui/section-wrapper"

const PILLARS = [
  {
    icon: Users,
    title: "Youth-Driven",
    body: "Over 10,000 young people trained. A standing force ready to mobilise.",
  },
  {
    icon: Building2,
    title: "Waqf-Backed",
    body: "Shariah-compliant, financially resilient. Built to last for generations.",
  },
  {
    icon: Globe,
    title: "Globally Connected",
    body: "Operating across Asia, the Middle East, and East Africa.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven",
    body: "Impact reports, ISO governance, and evidence-based healthcare delivery.",
  },
]

export function WhyHeartSpaceSection() {
  return (
    <SectionWrapper tone="ash">
      <div className="max-w-3xl">
        <SectionLabel tone="teal">Why HeartSpace</SectionLabel>
        <h2 className="text-display-md mt-4 font-display font-extrabold text-[var(--color-ink)] md:text-display-lg">
          A different kind of NGO.
        </h2>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.15rem]">
          We are not building just another charity. We are building a movement.
        </p>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
            className="group relative bg-white p-8 transition-colors hover:bg-[var(--color-teal-pale)]/40"
          >
            <span className="absolute right-7 top-7 font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]/40">
              0{i + 1}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-md bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)] transition-colors group-hover:bg-[var(--color-teal)] group-hover:text-white">
              <p.icon size={22} strokeWidth={1.75} />
            </span>
            <h3 className="mt-6 font-display text-[1.18rem] font-bold text-[var(--color-ink)]">
              {p.title}
            </h3>
            <p className="mt-2 text-[0.93rem] leading-relaxed text-[var(--color-ink-muted)]">
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
