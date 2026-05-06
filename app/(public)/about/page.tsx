import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Users, Building2, Globe, BarChart3, ShieldCheck, Heart, Truck, Stethoscope } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"
import { SectionLabel, SectionWrapper } from "@/components/ui/section-wrapper"

export const metadata: Metadata = {
  title: "About",
  description:
    "HeartSpace is a youth-driven healthcare and humanitarian movement. Built by youth, governed to international standards, powered by waqf.",
}

const PILLARS = [
  { icon: Stethoscope, title: "Healthcare delivery", body: "Mobile clinics, primary care, emergency response — the operational core." },
  { icon: Truck, title: "Logistics & supply", body: "Pre-positioned supplies and a deployable mobile fleet across the region." },
  { icon: Users, title: "Youth mobilisation", body: "YERT, fellowships, and event volunteers — a standing force, not a side project." },
  { icon: Building2, title: "Waqf endowment", body: "Shariah-compliant fund built to outlast donor cycles and political weather." },
  { icon: Globe, title: "Global partnerships", body: "Asia, the Middle East, East Africa — local partners who know the ground." },
  { icon: BarChart3, title: "Data & evidence", body: "ISO governance, public impact reports, evidence-led service design." },
  { icon: Heart, title: "Community trust", body: "We earn trust block by block, not on a launch day." },
  { icon: ShieldCheck, title: "Compliance", body: "CHS, ISO 9001 trajectory, transparent audit. Boring, deliberately." },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate -mt-[60px] overflow-hidden md:-mt-[72px]">
        <div aria-hidden className="absolute inset-0 -z-30 bg-[var(--color-charcoal)]" />
        <div
          aria-hidden
          className="absolute inset-0 -z-20 opacity-60"
          style={{
            background:
              "radial-gradient(800px 460px at 18% 22%, rgba(26,172,176,0.4), transparent 70%), radial-gradient(620px 380px at 88% 80%, rgba(240,123,114,0.3), transparent 70%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grain opacity-30" />

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-[calc(60px+5rem)] md:px-8 md:pb-28 md:pt-[calc(72px+8rem)]">
          <SectionLabel tone="teal">About HeartSpace</SectionLabel>
          <h1 className="mt-7 max-w-4xl font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.022em] text-white sm:text-[3.5rem] md:text-[4.5rem]">
            We mobilise youth.
            <br />
            We deliver care.
            <br />
            <span className="relative inline-block">
              We don&apos;t flinch.
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-[10px] w-full rounded-full bg-[var(--color-coral)] opacity-90"
                style={{ transform: "skewX(-8deg)" }}
              />
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-white/80 md:text-[1.18rem]">
            HeartSpace (operating as MyHeart in Malaysia) is a youth-driven
            healthcare and humanitarian movement. Built by young people who
            refused to wait their turn, governed to international standards,
            and powered by a Shariah-compliant endowment.
          </p>
        </div>
      </section>

      {/* Manifesto split */}
      <SectionWrapper tone="white" spacing="default">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <SectionLabel tone="coral">Why we exist</SectionLabel>
            <h2 className="text-display-md mt-4 font-display font-extrabold leading-[1.08] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
              No parent should pray for medicine that already exists.
            </h2>
          </div>
          <div className="md:col-span-7 md:pt-8">
            <div className="space-y-5 text-[1rem] leading-[1.85] text-[var(--color-ink-soft)] md:text-[1.05rem]">
              <p>
                HeartSpace was founded by young doctors, students, and field
                workers who kept arriving at the same conclusion: the
                healthcare system fails the people it&apos;s supposed to reach
                most. Mobile clinics break down because nobody funds the
                third-year maintenance. Disaster response shows up after the
                cameras leave. Aid goes to where it&apos;s easy to deliver, not
                where it&apos;s needed most.
              </p>
              <p>
                We exist to close those gaps the system leaves open — by
                building a movement that actually mobilises, an endowment that
                outlasts donor cycles, and operations governed to standards
                that survive an external audit on their worst day.
              </p>
              <p>
                Bold. Warm. Human. Three words on the wall, and the only ones
                that aren&apos;t up for debate.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Pillars */}
      <SectionWrapper tone="ash">
        <SectionLabel tone="teal">Eight pillars</SectionLabel>
        <h2 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.08] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
          What we&apos;re built on.
        </h2>
        <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-[var(--color-ink-muted)]">
          Eight load-bearing pillars. Lose any of them and the whole thing
          tilts.
        </p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className="group relative bg-white p-7 transition-colors hover:bg-[var(--color-teal-pale)]/40"
            >
              <span className="absolute right-7 top-6 font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-md bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)] transition-colors group-hover:bg-[var(--color-teal)] group-hover:text-white">
                <p.icon size={20} strokeWidth={1.6} />
              </span>
              <h3 className="mt-6 font-display text-[1.1rem] font-bold leading-tight text-[var(--color-ink)]">
                {p.title}
              </h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--color-ink-muted)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Numbers */}
      <SectionWrapper tone="default" spacing="tight">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-[3rem] font-extrabold leading-none tracking-[-0.025em] text-[var(--color-teal-dark)] md:text-[3.75rem]">
              50K+
            </p>
            <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              People served to date
            </p>
            <p className="mt-2 text-[0.92rem] text-[var(--color-ink-soft)]">
              Mobile clinics, emergency response, primary care.
            </p>
          </div>
          <div>
            <p className="font-display text-[3rem] font-extrabold leading-none tracking-[-0.025em] text-[var(--color-teal-dark)] md:text-[3.75rem]">
              12
            </p>
            <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Countries of operation
            </p>
            <p className="mt-2 text-[0.92rem] text-[var(--color-ink-soft)]">
              Asia, the Middle East, East Africa — local-led.
            </p>
          </div>
          <div>
            <p className="font-display text-[3rem] font-extrabold leading-none tracking-[-0.025em] text-[var(--color-teal-dark)] md:text-[3.75rem]">
              3,000+
            </p>
            <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Youth trained
            </p>
            <p className="mt-2 text-[0.92rem] text-[var(--color-ink-soft)]">
              YERT members, fellows, event volunteers.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA strip */}
      <section className="bg-[var(--color-charcoal)] py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:px-8">
          <div>
            <SectionLabel tone="teal">Where we&apos;re going</SectionLabel>
            <h2 className="mt-5 font-display text-[2.25rem] font-extrabold leading-[1.06] tracking-[-0.022em] text-white md:text-[2.85rem]">
              By 2030, 100,000 people served a year.
            </h2>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-white/65 md:text-[1.1rem]">
              The full five-year plan, the targets we hold ourselves to, and
              how we measure them.
            </p>
          </div>
          <div className="md:justify-self-end">
            <CTAButton
              href="/about/vision"
              variant="secondary"
              size="lg"
              arrow
              className="border-white/70 bg-transparent text-white shadow-none hover:border-white hover:bg-white/10 hover:text-white hover:shadow-none active:shadow-none"
            >
              Read the 5-year vision
              <ArrowRight size={18} />
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  )
}
