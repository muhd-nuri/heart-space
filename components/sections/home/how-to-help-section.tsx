"use client"

import { motion } from "framer-motion"
import { Heart, Users, Handshake, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { SectionLabel, SectionWrapper } from "@/components/ui/section-wrapper"
import { CTAButton } from "@/components/ui/cta-button"

const PATHS = [
  {
    icon: Heart,
    title: "Fund the Mission",
    body: "Your contribution funds clinics, mobile units, and emergency responses across Asia.",
    cta: { label: "Contribute Now", href: "/contribute", variant: "contribute" as const },
    accent: "coral" as const,
  },
  {
    icon: Users,
    title: "Join the Movement",
    body: "Train as a YERT member or apply for our Global Humanitarian Fellowship.",
    cta: { label: "Volunteer", href: "/volunteer", variant: "primary" as const },
    accent: "teal" as const,
  },
  {
    icon: Handshake,
    title: "Partner With Us",
    body: "CSR programmes, corporate partnerships, and institutional collaboration.",
    cta: { label: "Partner", href: "/partners", variant: "secondary" as const },
    accent: "teal" as const,
  },
]

export function HowToHelpSection() {
  return (
    <SectionWrapper tone="white">
      <div className="text-center">
        <SectionLabel tone="teal">Get Involved</SectionLabel>
        <h2 className="text-display-md mt-4 font-display font-extrabold text-[var(--color-ink)] md:text-display-lg">
          Three ways to make a difference.
        </h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {PATHS.map((p, i) => {
          const accent =
            p.accent === "coral"
              ? "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)]"
              : "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]"
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="group relative flex flex-col gap-6 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-8 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-14 w-14 place-items-center rounded-full ${accent}`}>
                  <p.icon size={26} strokeWidth={1.6} />
                </span>
                <Link
                  href={p.cta.href}
                  aria-label={`${p.title} — go`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-hairline)] text-[var(--color-ink-muted)] transition-all group-hover:border-[var(--color-teal)] group-hover:text-[var(--color-teal-dark)]"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <div>
                <h3 className="font-display text-[1.45rem] font-bold leading-tight text-[var(--color-ink)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {p.body}
                </p>
              </div>

              <div className="mt-auto pt-2">
                <CTAButton href={p.cta.href} variant={p.cta.variant} size="sm">
                  {p.cta.label}
                </CTAButton>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
