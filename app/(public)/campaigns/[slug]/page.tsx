import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { CampaignImage } from "@/components/ui/campaign-image"
import { CategoryBadge } from "@/components/ui/category-badge"
import { CampaignCard } from "@/components/ui/campaign-card"
import { ContributePanel } from "@/components/sections/campaigns/contribute-panel"
import { SectionLabel } from "@/components/ui/section-wrapper"
import { getAllCampaigns, getCampaign } from "@/lib/data"

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = await getCampaign(slug)
  if (!c) return { title: "Campaign not found" }
  return {
    title: c.title,
    description: c.description,
    openGraph: {
      title: c.title,
      description: c.description,
      images: c.image ? [c.image] : undefined,
    },
  }
}

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params
  const campaign = await getCampaign(slug)
  if (!campaign) notFound()

  const others = (await getAllCampaigns())
    .filter((c) => c.slug !== campaign.slug)
    .slice(0, 3)

  return (
    <>
      {/* Hero — full-bleed campaign image with overlay + meta */}
      <section className="relative isolate -mt-[60px] overflow-hidden md:-mt-[72px]">
        <div className="absolute inset-0 -z-10">
          <CampaignImage
            src={campaign.image}
            alt={campaign.title}
            category={campaign.category}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" />
        </div>

        <div className="mx-auto flex min-h-[72svh] max-w-6xl flex-col justify-end px-6 pb-14 pt-[calc(60px+5rem)] md:px-8 md:pb-20 md:pt-[calc(72px+6rem)]">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-1.5 self-start text-[0.78rem] font-medium uppercase tracking-[0.12em] text-white/75 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            All campaigns
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CategoryBadge category={campaign.category} />
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur">
              {campaign.status}
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.022em] text-white sm:text-[3.25rem] md:text-[4rem]">
            {campaign.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-white/85 md:text-[1.15rem]">
            {campaign.description}
          </p>
        </div>
      </section>

      {/* Body — 2-col with sticky contribute panel */}
      <section className="bg-[var(--color-off-white)] py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-12 md:gap-12 md:px-8 lg:gap-16">
          <article className="md:col-span-7">
            <SectionLabel tone="teal">About this campaign</SectionLabel>
            <h2 className="text-display-sm mt-4 font-display font-bold text-[var(--color-ink)] md:text-display-md">
              Where your contribution lands.
            </h2>

            <div className="prose-content mt-7 space-y-5 text-[1rem] leading-[1.8] text-[var(--color-ink-soft)] md:text-[1.05rem]">
              <p>{campaign.description}</p>
              <p>
                HeartSpace operates with international standards: every ringgit
                is logged, every disbursement is auditable, and field reports
                are published quarterly. Your contribution is governed by ISO
                processes and overseen by an independent advisory board.
              </p>
              <p>
                Funds raised here go directly into operational delivery —
                medical supplies, mobile clinic logistics, field staff, and
                emergency response. Administrative overhead is capped at 12%
                and disclosed in our annual impact report.
              </p>
            </div>

            <h3 className="mt-12 font-display text-[1.4rem] font-bold text-[var(--color-ink)]">
              What your contribution funds
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {WHAT_IT_FUNDS.map((line) => (
                <li
                  key={line.label}
                  className="flex gap-3 rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-4"
                >
                  <span className="font-display text-[1.5rem] font-extrabold leading-none text-[var(--color-coral)]">
                    {line.amount}
                  </span>
                  <span className="text-[0.92rem] leading-relaxed text-[var(--color-ink-soft)]">
                    {line.label}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-12 font-display text-[1.4rem] font-bold text-[var(--color-ink)]">
              Field updates
            </h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">
              Updates from the ground will appear here as the campaign
              progresses. Subscribe to our newsletter to get them delivered
              monthly.
            </p>
          </article>

          <div className="md:col-span-5">
            <ContributePanel
              slug={campaign.slug}
              raised={campaign.raised}
              target={campaign.target}
              contributorCount={campaign.contributorCount}
              endDate={campaign.endDate}
            />
          </div>
        </div>
      </section>

      {/* Other campaigns */}
      {others.length > 0 && (
        <section className="border-t border-[var(--color-hairline)] bg-[var(--color-ash)] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <SectionLabel tone="teal">More to fund</SectionLabel>
                <h2 className="text-display-sm mt-4 font-display font-bold text-[var(--color-ink)] md:text-display-md">
                  Other active campaigns
                </h2>
              </div>
              <Link
                href="/campaigns"
                className="text-[0.86rem] font-medium text-[var(--color-teal-dark)] hover:text-[var(--color-teal)]"
              >
                View all →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {others.map((c, i) => (
                <CampaignCard key={c.slug} campaign={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

const WHAT_IT_FUNDS = [
  { amount: "RM 25", label: "A week of essential medication for one patient." },
  { amount: "RM 100", label: "A full health screening and consult for a family." },
  { amount: "RM 500", label: "One day of a mobile clinic on the road." },
  { amount: "RM 2,500", label: "A month of field staff working in your name." },
]
