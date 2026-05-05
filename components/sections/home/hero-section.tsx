"use client"

import { motion } from "framer-motion"
import { Hospital, ShieldCheck, Globe } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"

const stagger = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay },
})

export function HeroSection() {
  return (
    <section className="relative isolate -mt-[60px] overflow-hidden md:-mt-[72px]">
      {/* Layered background — gradient + grain so the hero looks intentional
          before client photography arrives. Dark overlay tuned to ~55%.
          Negative top-margin pulls the hero up under the sticky navbar so
          the over-hero transparent state has actual dark pixels behind it. */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-[var(--color-charcoal)]" />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-[#0E5E60] via-[#1AACB0]/45 to-[#1C2B2B]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-[0.55] mix-blend-multiply"
        style={{
          background:
            "radial-gradient(900px 480px at 18% 22%, rgba(26,172,176,0.45), transparent 70%), radial-gradient(720px 420px at 85% 75%, rgba(240,123,114,0.32), transparent 70%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grain opacity-30" />

      {/* coral accent line — subtle vertical mark on left edge */}
      <div aria-hidden className="absolute left-0 top-1/2 -z-10 hidden h-32 w-[3px] -translate-y-1/2 bg-[var(--color-coral)] md:block" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pb-24 pt-[calc(60px+5rem)] md:px-8 md:pb-32 md:pt-[calc(72px+6rem)]">
        <motion.span {...stagger(0)} className="text-label accent-line font-display text-[var(--color-teal-light)]">
          Youth Healthcare & Humanitarian Movement
        </motion.span>

        <motion.h1
          {...stagger(0.1)}
          className="mt-7 max-w-[18ch] font-display text-[3rem] font-extrabold leading-[1.02] tracking-[-0.025em] text-white sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.5rem]"
        >
          Care{" "}
          <span className="relative inline-block">
            Without
            <span
              aria-hidden
              className="absolute -bottom-2 left-0 h-[10px] w-full rounded-full bg-[var(--color-coral)] opacity-90"
              style={{ transform: "skewX(-8deg)" }}
            />
          </span>
          <br />
          Borders.
        </motion.h1>

        <motion.p
          {...stagger(0.2)}
          className="mt-7 max-w-[52ch] text-[1.05rem] leading-relaxed text-white/80 md:text-[1.18rem]"
        >
          HeartSpace mobilises youth, clinics, and communities to deliver
          healthcare and humanitarian aid across Asia and beyond. Join us in
          building a healthier, more compassionate world.
        </motion.p>

        <motion.div {...stagger(0.3)} className="mt-9 flex flex-wrap items-center gap-3">
          <CTAButton href="/contribute" variant="contribute" size="lg" arrow>
            Contribute Now
          </CTAButton>
          <CTAButton
            href="/volunteer"
            variant="secondary"
            size="lg"
            arrow
            className="border-white/80 bg-transparent text-white shadow-[0_4px_0_0_rgba(255,255,255,0.35)] hover:bg-white hover:text-[var(--color-charcoal)] hover:shadow-[0_6px_0_0_rgba(255,255,255,0.5)] active:shadow-[0_0_0_0_rgba(255,255,255,0.35)]"
          >
            Join the Movement
          </CTAButton>
        </motion.div>

        <motion.div
          {...stagger(0.4)}
          className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.82rem] text-white/65"
        >
          {[
            { icon: Hospital, label: "Registered NGO Malaysia" },
            { icon: ShieldCheck, label: "Shariah-Compliant" },
            { icon: Globe, label: "Active in 12 Countries" },
          ].map(({ icon: Icon, label }, i) => (
            <span key={label} className="inline-flex items-center gap-2">
              <Icon size={14} className="text-[var(--color-teal-light)]" />
              <span className="font-medium tracking-wide">{label}</span>
              {i < 2 && <span aria-hidden className="ml-3 text-white/25">·</span>}
            </span>
          ))}
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-white/40 md:flex"
      >
        <span>Scroll</span>
        <span className="block h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  )
}
