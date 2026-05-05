"use client"

import { motion } from "framer-motion"
import { CTAButton } from "@/components/ui/cta-button"
import { SectionLabel } from "@/components/ui/section-wrapper"

const fadeRise = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

export function VisionStripSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-charcoal)] text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(620px 360px at 90% 30%, rgba(26,172,176,0.22), transparent 70%), radial-gradient(520px 280px at 10% 80%, rgba(240,123,114,0.16), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-12 md:gap-12 md:px-8 md:py-32">
        <div className="md:col-span-7">
          <motion.div {...fadeRise}>
            <SectionLabel tone="teal">Our 2030 Vision</SectionLabel>
          </motion.div>
          <motion.h2
            {...fadeRise}
            transition={{ ...fadeRise.transition, delay: 0.1 }}
            className="mt-6 font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-[-0.022em] text-white sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem]"
          >
            By 2030, we will serve{" "}
            <span className="relative">
              <span className="relative z-10">100,000 people</span>
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 z-0 h-[10px] w-full bg-[var(--color-teal)] opacity-90"
                style={{ transform: "skewX(-8deg)" }}
              />
            </span>{" "}
            a year.
          </motion.h2>
          <motion.p
            {...fadeRise}
            transition={{ ...fadeRise.transition, delay: 0.2 }}
            className="mt-7 max-w-xl text-[1.05rem] leading-relaxed text-white/65 md:text-[1.15rem]"
          >
            Asia&apos;s leading youth-driven healthcare and humanitarian movement —
            powered by waqf, driven by youth, governed by international standards.
          </motion.p>
          <motion.div
            {...fadeRise}
            transition={{ ...fadeRise.transition, delay: 0.3 }}
            className="mt-9"
          >
            <CTAButton
              href="/about/vision"
              variant="secondary"
              arrow
              className="border-white/80 bg-transparent text-white shadow-[0_4px_0_0_rgba(255,255,255,0.35)] hover:bg-white hover:text-[var(--color-charcoal)] hover:shadow-[0_6px_0_0_rgba(255,255,255,0.5)] active:shadow-[0_0_0_0_rgba(255,255,255,0.35)]"
            >
              Read our full vision
            </CTAButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="md:col-span-5"
        >
          <VisionTotem />
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Editorial visual block — replaces the placeholder /images/vision.jpg.
 * A composition of layered numbers, an angled coral accent, and a soft
 * teal mesh: feels like a magazine cover, not a stock photo.
 */
function VisionTotem() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1AACB0]/30 via-[#0E5E60] to-[#1C2B2B]" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(560px 340px at 80% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(380px 280px at 10% 90%, rgba(240,123,114,0.35), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-grain opacity-30" />

      {/* coral diagonal */}
      <div
        aria-hidden
        className="absolute -left-8 top-12 h-[2px] w-48 origin-left rotate-[28deg] bg-[var(--color-coral)]"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-8">
        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.2em] text-white/60">
          <span>HeartSpace</span>
          <span>2026 → 2030</span>
        </div>
        <div className="space-y-3">
          <div className="font-display text-[5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-white sm:text-[6.5rem]">
            100K
          </div>
          <div className="text-[0.85rem] uppercase tracking-[0.18em] text-white/70">
            people served / year
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 text-[0.78rem] text-white/65">
            <div>
              <div className="font-display text-[1.6rem] font-bold text-[var(--color-teal-light)]">
                20
              </div>
              <div className="uppercase tracking-[0.14em]">Mobile units</div>
            </div>
            <div>
              <div className="font-display text-[1.6rem] font-bold text-[var(--color-coral-light)]">
                $11M
              </div>
              <div className="uppercase tracking-[0.14em]">Annual raise</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
