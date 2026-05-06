import type { Metadata } from "next"
import { CampaignCard } from "@/components/ui/campaign-card"
import { CategoryFilter } from "@/components/sections/campaigns/category-filter"
import { SectionLabel } from "@/components/ui/section-wrapper"
import { getAllCampaigns } from "@/lib/data"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Campaigns",
  description:
    "Active HeartSpace campaigns — choose where your contribution lands. Healthcare, disaster relief, waqf, zakat.",
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function CampaignsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const campaigns = await getAllCampaigns({ category })

  return (
    <>
      <header className="border-b border-[var(--color-hairline)] bg-[var(--color-ash)]">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
          <SectionLabel tone="teal">All Campaigns</SectionLabel>
          <h1 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.05] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
            Real campaigns. Real progress.
          </h1>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.12rem]">
            Pick a campaign — or fund our general mission. Every contribution
            updates a bar you can watch move in real time.
          </p>

          <div className="mt-9">
            <CategoryFilter active={category ?? ""} />
          </div>
        </div>
      </header>

      <section className="bg-[var(--color-off-white)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          {campaigns.length === 0 ? (
            <EmptyState category={category} />
          ) : (
            <>
              <p className="mb-8 text-[0.82rem] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                {campaigns.length}{" "}
                {campaigns.length === 1 ? "campaign" : "campaigns"}
                {category ? ` · ${formatCategory(category)}` : ""}
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((c, i) => (
                  <CampaignCard key={c.slug} campaign={c} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

function EmptyState({ category }: { category?: string }) {
  return (
    <div className="mx-auto max-w-md rounded-[var(--radius-card)] border border-dashed border-[var(--color-hairline)] bg-white p-10 text-center">
      <p className="font-display text-[1.2rem] font-bold text-[var(--color-ink)]">
        No active {category ? formatCategory(category).toLowerCase() : ""} campaigns yet.
      </p>
      <p className="mt-3 text-[0.92rem] text-[var(--color-ink-muted)]">
        Check back soon — or browse all campaigns.
      </p>
    </div>
  )
}

function formatCategory(c: string) {
  if (c === "disaster") return "Disaster Relief"
  return c.charAt(0).toUpperCase() + c.slice(1)
}
