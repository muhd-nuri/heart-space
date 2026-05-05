"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"

export function CTABannerSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-coral)] text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(700px 320px at 12% 30%, rgba(255,255,255,0.32), transparent 60%), radial-gradient(680px 320px at 88% 80%, rgba(0,0,0,0.18), transparent 70%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-grain opacity-25" />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:px-8 md:py-32">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur"
        >
          Contribute · Sadaqah · Zakat · Waqf
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="mt-7 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.025em] text-white sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem]"
        >
          Every ringgit
          <br />
          saves a life.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-white/90 md:text-[1.15rem]"
        >
          Join thousands of donors who have trusted HeartSpace to deliver
          healthcare where it matters most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <CTAButton href="/contribute" variant="white" size="lg" arrow>
            Contribute Now
          </CTAButton>
          <CTAButton
            href="/about"
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/10"
          >
            See how we use your contributions
            <ArrowRight size={16} />
          </CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
