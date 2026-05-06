import type { Metadata } from "next"
import { Building2, Globe, Hospital, Briefcase } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"
import { SectionLabel, SectionWrapper } from "@/components/ui/section-wrapper"

export const metadata: Metadata = {
  title: "Partners",
  description:
    "HeartSpace partners with corporates, healthcare providers, and international institutions to scale humanitarian healthcare.",
}

const TIERS = [
  {
    icon: Briefcase,
    label: "Corporate CSR",
    title: "Match a campaign. Scale impact.",
    body:
      "Match-fund a quarterly campaign, sponsor a mobile clinic, or run a workplace contribution drive. Reportable, measurable, and visible.",
    cta: { label: "CSR conversation", href: "/contact?topic=csr" },
  },
  {
    icon: Hospital,
    label: "Healthcare delivery",
    title: "Co-deliver clinical programmes.",
    body:
      "Hospital partners, clinical educators, and medtech vendors join us to operate mobile clinics, training programmes, and disaster response.",
    cta: { label: "Partner with us", href: "/contact?topic=clinical" },
  },
  {
    icon: Globe,
    label: "Institutional",
    title: "International alignment.",
    body:
      "ISO 9001 trajectory, CHS aligned, and aligned to UN Sustainable Development Goals 3 and 17. Reach out for institutional MoUs.",
    cta: { label: "Institutional brief", href: "/contact?topic=institutional" },
  },
] as const

const PARTNERS = [
  "Bukit Bintang Hospital",
  "Sabah Mobile Health Network",
  "South-East Asia Youth Forum",
  "Asia Disaster Response Coalition",
  "Crescent Aid Initiative",
  "MyHeart Foundation",
  "International Clinical Educators",
  "Global Humanitarian Fellowship",
] as const

export default function PartnersPage() {
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
              "radial-gradient(820px 420px at 20% 25%, rgba(26,172,176,0.4), transparent 70%), radial-gradient(620px 320px at 90% 80%, rgba(240,123,114,0.28), transparent 70%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grain opacity-25" />

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-[calc(60px+5rem)] md:px-8 md:pb-28 md:pt-[calc(72px+8rem)]">
          <SectionLabel tone="teal">Partners</SectionLabel>
          <h1 className="mt-7 max-w-4xl font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.022em] text-white sm:text-[3.5rem] md:text-[4.5rem]">
            We don&apos;t scale alone.
          </h1>
          <p className="mt-7 max-w-2xl text-[1.05rem] leading-relaxed text-white/80 md:text-[1.18rem]">
            Corporates, hospitals, foundations, and international institutions
            partner with HeartSpace to put healthcare where the system
            doesn&apos;t reach. Three lanes below — pick yours.
          </p>
        </div>
      </section>

      {/* Three lanes */}
      <SectionWrapper tone="white">
        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => {
            const Icon = t.icon
            return (
              <div
                key={t.label}
                className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-7 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-md bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]">
                  <Icon size={20} strokeWidth={1.6} />
                </span>
                <p className="mt-6 font-display text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[var(--color-coral)]">
                  {t.label}
                </p>
                <h3 className="mt-2 font-display text-[1.32rem] font-bold leading-tight text-[var(--color-ink)]">
                  {t.title}
                </h3>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {t.body}
                </p>
                <div className="mt-6">
                  <CTAButton href={t.cta.href} variant="secondary" size="sm" arrow>
                    {t.cta.label}
                  </CTAButton>
                </div>
              </div>
            )
          })}
        </div>
      </SectionWrapper>

      {/* Partner wall — names only until logo files arrive */}
      <SectionWrapper tone="ash">
        <SectionLabel tone="teal">Selected partners</SectionLabel>
        <h2 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.08] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
          Trusted by people who don&apos;t hand trust out lightly.
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-3 lg:grid-cols-4">
          {PARTNERS.map((name) => (
            <div
              key={name}
              className="flex aspect-[3/1.2] items-center justify-center bg-white px-5 py-6 text-center"
            >
              <p className="font-display text-[0.92rem] font-bold leading-snug tracking-[-0.005em] text-[var(--color-ink-soft)]">
                {name}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[0.86rem] leading-relaxed text-[var(--color-ink-muted)]">
          Logos coming soon. Reach out via{" "}
          <a href="mailto:partners@heartspace.my" className="text-[var(--color-teal-dark)] underline underline-offset-2">
            partners@heartspace.my
          </a>{" "}
          for partnership decks.
        </p>
      </SectionWrapper>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-[var(--color-charcoal)] py-20 text-white md:py-28">
        <div
          aria-hidden
          className="absolute inset-0 opacity-45"
          style={{
            background:
              "radial-gradient(620px 320px at 90% 30%, rgba(26,172,176,0.22), transparent 70%), radial-gradient(520px 280px at 10% 80%, rgba(240,123,114,0.18), transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:px-8">
          <div>
            <SectionLabel tone="teal">Let&apos;s talk</SectionLabel>
            <h2 className="mt-5 font-display text-[2.25rem] font-extrabold leading-[1.06] tracking-[-0.022em] text-white md:text-[2.85rem]">
              Build something with us.
            </h2>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-white/65 md:text-[1.1rem]">
              Tell us what you&apos;d like to fund, deliver, or co-build. We
              respond in plain English within two working days.
            </p>
          </div>
          <div className="md:justify-self-end">
            <CTAButton href="/contact?topic=partner" variant="white" size="lg" arrow>
              Start a partnership
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  )
}
