import type { Metadata } from "next"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { ContactForm } from "@/components/sections/contact/contact-form"
import { SectionLabel } from "@/components/ui/section-wrapper"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with HeartSpace — partnerships, press, donor relations, or general enquiries.",
}

const TOPICS = ["general", "partner", "csr", "clinical", "institutional", "press", "donor"] as const

type Props = { searchParams: Promise<{ topic?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams
  const initialTopic = (TOPICS as readonly string[]).includes(sp.topic ?? "")
    ? (sp.topic as (typeof TOPICS)[number])
    : undefined

  return (
    <>
      <header className="border-b border-[var(--color-hairline)] bg-[var(--color-ash)]">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
          <SectionLabel tone="teal">Contact</SectionLabel>
          <h1 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.05] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
            Tell us what you&apos;re thinking.
          </h1>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.12rem]">
            Partnerships, press, donor relations, clinical collaborations — or
            just a question. Plain-English replies within two working days.
          </p>
        </div>
      </header>

      <section className="bg-[var(--color-off-white)] py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-12 md:gap-12 md:px-8 lg:gap-16">
          <div className="md:col-span-7">
            <ContactForm initialTopic={initialTopic} />
          </div>

          <aside className="md:col-span-5">
            <div className="md:sticky md:top-[88px] space-y-4">
              <ContactCard
                icon={MapPin}
                label="HQ · Kuala Lumpur"
                lines={[
                  "Lot 1A, Plaza Hamodal",
                  "Jalan Tun Razak, 50400 KL",
                  "Malaysia",
                ]}
              />
              <ContactCard
                icon={Phone}
                label="Phone"
                lines={[
                  <a key="t" href="tel:+60312345678" className="text-[var(--color-teal-dark)] hover:text-[var(--color-teal)]">
                    +60 3-1234 5678
                  </a>,
                ]}
              />
              <ContactCard
                icon={Mail}
                label="Email"
                lines={[
                  <a key="g" href="mailto:hello@heartspace.my" className="text-[var(--color-teal-dark)] hover:text-[var(--color-teal)]">
                    hello@heartspace.my
                  </a>,
                  <a key="p" href="mailto:partners@heartspace.my" className="text-[var(--color-teal-dark)] hover:text-[var(--color-teal)]">
                    partners@heartspace.my
                  </a>,
                  <a key="r" href="mailto:press@heartspace.my" className="text-[var(--color-teal-dark)] hover:text-[var(--color-teal)]">
                    press@heartspace.my
                  </a>,
                ]}
              />
              <ContactCard
                icon={Clock}
                label="Office hours"
                lines={[
                  "Monday — Friday",
                  "09:00 — 18:00 MYT",
                  "Closed on Malaysian public holidays",
                ]}
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function ContactCard({
  icon: Icon,
  label,
  lines,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  lines: React.ReactNode[]
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-5">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]">
          <Icon size={16} strokeWidth={1.8} />
        </span>
        <p className="font-display text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          {label}
        </p>
      </div>
      <ul className="mt-4 space-y-1.5 text-[0.92rem] leading-[1.65] text-[var(--color-ink-soft)]">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
