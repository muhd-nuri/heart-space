import type { Metadata } from "next"
import { ArrowLeft, ArrowRight, Target } from "lucide-react"
import Link from "next/link"
import { CTAButton } from "@/components/ui/cta-button"
import { SectionLabel, SectionWrapper } from "@/components/ui/section-wrapper"

export const metadata: Metadata = {
  title: "Our 2030 Vision",
  description:
    "HeartSpace's five-year plan: 100,000 people served annually, 20 mobile clinics, USD 11M raised, governed to ISO standards.",
}

const TARGETS = [
  { value: "100,000", label: "people served / year", body: "Up from ~50,000 today. Mobile clinics, primary care, emergency response, refugee health." },
  { value: "20", label: "mobile clinic units", body: "From 8 today. Each unit supports 6–8 villages and ~6,000 patient encounters/year." },
  { value: "$11M", label: "raised annually", body: "Diversified across waqf principal, sadaqah/zakat, corporate CSR, and grants." },
  { value: "10,000+", label: "youth in the standing force", body: "YERT members + fellows + event volunteers, ready to mobilise within 48h." },
]

const TIMELINE = [
  {
    year: "2026",
    title: "Foundations",
    points: [
      "ISO 9001 alignment begins; first external audit cycle.",
      "Waqf principal targets RM 10M raised by year-end.",
      "Mobile clinic fleet expands to 10 units across Malaysia + Indonesia.",
    ],
  },
  {
    year: "2027",
    title: "Regional reach",
    points: [
      "Open operational hubs in Bangladesh and Yemen.",
      "Global Humanitarian Fellowship cohort scales to 80 fellows.",
      "Public live-impact dashboard launches.",
    ],
  },
  {
    year: "2028",
    title: "Resilience",
    points: [
      "Waqf principal at RM 30M, generating sustaining yield.",
      "Independent advisory board; quarterly impact reports.",
      "Disaster response capacity upgraded — 72h deployment.",
    ],
  },
  {
    year: "2029",
    title: "Maturity",
    points: [
      "15 mobile clinic units; 70,000 people served annually.",
      "Joint programmes with two UN agencies.",
      "First clinical trial site for a partner research institution.",
    ],
  },
  {
    year: "2030",
    title: "100,000",
    points: [
      "100,000 people served per year.",
      "20 mobile clinic units across 12 countries.",
      "Annual raise USD 11M, with 60% from compounding waqf yield.",
    ],
  },
]

export default function VisionPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate -mt-[60px] overflow-hidden md:-mt-[72px]">
        <div aria-hidden className="absolute inset-0 -z-30 bg-[var(--color-charcoal)]" />
        <div
          aria-hidden
          className="absolute inset-0 -z-20 opacity-55"
          style={{
            background:
              "radial-gradient(900px 480px at 80% 25%, rgba(26,172,176,0.4), transparent 70%), radial-gradient(620px 360px at 10% 90%, rgba(240,123,114,0.3), transparent 70%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grain opacity-25" />

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-[calc(60px+5rem)] md:px-8 md:pb-28 md:pt-[calc(72px+8rem)]">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-white/75 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to About
          </Link>

          <SectionLabel tone="teal">Our 2030 Vision</SectionLabel>
          <h1 className="mt-5 max-w-4xl font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.025em] text-white sm:text-[3.5rem] md:text-[4.5rem]">
            By 2030, we will serve{" "}
            <span className="relative inline-block">
              100,000 people
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-[10px] w-full rounded-full bg-[var(--color-coral)] opacity-90"
                style={{ transform: "skewX(-8deg)" }}
              />
            </span>{" "}
            a year.
          </h1>
          <p className="mt-7 max-w-2xl text-[1.05rem] leading-relaxed text-white/80 md:text-[1.2rem]">
            Asia&apos;s leading youth-driven healthcare and humanitarian
            movement — powered by waqf, driven by youth, governed to
            international standards. Five-year plan below, in plain English.
          </p>
        </div>
      </section>

      {/* North-star numbers */}
      <SectionWrapper tone="white" spacing="default">
        <div className="flex items-center gap-3">
          <Target size={18} className="text-[var(--color-coral)]" />
          <SectionLabel tone="coral">North-star targets</SectionLabel>
        </div>
        <h2 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.08] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
          Four numbers we hold ourselves to.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-2 lg:grid-cols-4">
          {TARGETS.map((t, i) => (
            <div key={t.label} className="bg-white p-7">
              <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]/50">
                0{i + 1}
              </span>
              <p className="mt-3 font-display text-[2.5rem] font-extrabold leading-[1] tracking-[-0.025em] text-[var(--color-teal-dark)] md:text-[3rem]">
                {t.value}
              </p>
              <p className="mt-2 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
                {t.label}
              </p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--color-ink-muted)]">
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Timeline */}
      <SectionWrapper tone="ash">
        <SectionLabel tone="teal">Roadmap</SectionLabel>
        <h2 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.08] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
          Year by year, 2026 → 2030.
        </h2>

        <ol className="mt-14 space-y-10 md:space-y-14">
          {TIMELINE.map((y, i) => (
            <li key={y.year} className="grid gap-6 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-3">
                <p className="font-display text-[3rem] font-extrabold leading-none tracking-[-0.025em] text-[var(--color-teal)] md:text-[3.75rem]">
                  {y.year}
                </p>
                <p className="mt-2 font-display text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[var(--color-coral)]">
                  Phase {String(i + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="relative md:col-span-9 md:border-l md:border-[var(--color-hairline)] md:pl-10">
                <h3 className="font-display text-[1.6rem] font-bold leading-tight tracking-[-0.012em] text-[var(--color-ink)] md:text-[1.85rem]">
                  {y.title}
                </h3>
                <ul className="mt-5 space-y-3 text-[0.98rem] leading-[1.7] text-[var(--color-ink-soft)]">
                  {y.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-coral)]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </SectionWrapper>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-[var(--color-coral)] py-20 text-white md:py-28">
        <div
          aria-hidden
          className="absolute inset-0 opacity-50 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(700px 320px at 12% 30%, rgba(255,255,255,0.3), transparent 60%), radial-gradient(680px 320px at 88% 80%, rgba(0,0,0,0.18), transparent 70%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-grain opacity-25" />

        <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
          <h2 className="font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.025em] text-white md:text-[3.5rem]">
            We can&apos;t hit 100,000 alone.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[1.02rem] leading-relaxed text-white/90 md:text-[1.15rem]">
            Contributions fund operations. Volunteers run them. Partners scale
            them. Pick your lane.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <CTAButton href="/contribute" variant="white" size="lg" arrow>
              Contribute
            </CTAButton>
            <CTAButton
              href="/volunteer"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              Volunteer
              <ArrowRight size={18} />
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  )
}
