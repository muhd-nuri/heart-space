import type { Metadata } from "next"
import { ContributeForm } from "@/components/sections/contribute/contribute-form"
import { SectionLabel } from "@/components/ui/section-wrapper"
import { getAllCampaigns } from "@/lib/data"

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Support HeartSpace via Sadaqah, Zakat, Waqf, or General. Choose a campaign or fund the general mission. Secure payment via ToyyibPay.",
}

type Props = { searchParams: Promise<{ campaign?: string; type?: string }> }

const TYPES = ["sadaqah", "zakat", "waqf", "general"] as const
type Type = (typeof TYPES)[number]

export default async function ContributePage({ searchParams }: Props) {
  const sp = await searchParams
  const campaigns = await getAllCampaigns()

  const initialType = TYPES.includes(sp.type as Type) ? (sp.type as Type) : "sadaqah"
  const initialCampaignSlug = sp.campaign

  return (
    <>
      <header className="border-b border-[var(--color-hairline)] bg-[var(--color-ash)]">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
          <SectionLabel tone="coral">Contribute</SectionLabel>
          <h1 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.05] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
            Where do you want to send
            <br className="hidden sm:block" /> your support?
          </h1>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.12rem]">
            Pick a type, choose a campaign — or fund our general mission —
            then a secure payment via ToyyibPay. Receipt arrives by email.
          </p>
        </div>
      </header>

      <section className="bg-[var(--color-off-white)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <ContributeForm
            campaigns={campaigns}
            initialType={initialType}
            initialCampaignSlug={initialCampaignSlug}
          />
        </div>
      </section>
    </>
  )
}
