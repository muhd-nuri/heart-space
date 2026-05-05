import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CampaignCard, type CampaignCardData } from "@/components/ui/campaign-card"
import { SectionLabel, SectionWrapper } from "@/components/ui/section-wrapper"

export function ActiveCampaignsSection({ campaigns }: { campaigns: CampaignCardData[] }) {
  return (
    <SectionWrapper tone="default">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-12">
        <div className="max-w-2xl">
          <SectionLabel tone="teal">Make an Impact</SectionLabel>
          <h2 className="text-display-md mt-4 font-display font-extrabold text-[var(--color-ink)] md:text-display-lg">
            Active Campaigns
          </h2>
          <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-[var(--color-ink-muted)]">
            Real campaigns. Real progress. Pick one — or fund our general
            mission — and watch the bar move.
          </p>
        </div>

        <Link
          href="/campaigns"
          className="group inline-flex items-center gap-1.5 rounded-md border border-[var(--color-hairline)] bg-white px-4 py-2.5 text-[0.86rem] font-medium text-[var(--color-teal-dark)] transition-all hover:border-[var(--color-teal)] hover:bg-[var(--color-teal-pale)]"
        >
          View all campaigns
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {campaigns.map((c, i) => (
          <CampaignCard key={c.slug} campaign={c} index={i} />
        ))}
      </div>
    </SectionWrapper>
  )
}
