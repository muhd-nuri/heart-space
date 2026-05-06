import type { Metadata } from "next"
import Link from "next/link"
import { Check, Mail, ArrowRight } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"
import { SectionLabel } from "@/components/ui/section-wrapper"
import { prisma } from "@/lib/prisma"
import { formatRM } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your contribution to HeartSpace was successful.",
}

type Props = { searchParams: Promise<{ ref?: string }> }

export default async function SuccessPage({ searchParams }: Props) {
  const { ref } = await searchParams

  const contribution = ref
    ? await prisma.contribution
        .findUnique({
          where: { id: ref },
          include: { campaign: { select: { title: true, slug: true } } },
        })
        .catch(() => null)
    : null

  return (
    <section className="relative isolate -mt-[60px] overflow-hidden bg-[var(--color-off-white)] md:-mt-[72px]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[60svh] -z-10 bg-gradient-to-b from-[var(--color-teal-pale)] via-[var(--color-off-white)] to-[var(--color-off-white)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[60svh] -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(700px 320px at 50% 20%, rgba(26,172,176,0.25), transparent 70%)",
        }}
      />

      <div className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-[calc(60px+5rem)] text-center md:px-8 md:pb-24 md:pt-[calc(72px+6rem)]">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-teal)] text-white shadow-[0_8px_24px_rgba(26,172,176,0.4)]">
          <Check size={36} strokeWidth={2.5} />
        </div>

        <SectionLabel tone="teal">
          <span className="ml-1">Confirmed</span>
        </SectionLabel>

        <h1 className="mt-3 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.022em] text-[var(--color-ink)] md:text-[3.5rem]">
          Thank you{contribution ? `, ${contribution.contributorName.split(" ")[0]}` : ""}.
        </h1>

        <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.15rem]">
          {contribution
            ? `Your contribution of ${formatRM(contribution.amount)} has been received. We'll send a receipt to ${contribution.contributorEmail} shortly.`
            : "Your contribution has been received. A receipt will arrive by email shortly."}
        </p>

        {contribution && (
          <dl className="mt-9 grid w-full max-w-md grid-cols-2 gap-4 rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-6 text-left shadow-[var(--shadow-card)]">
            <SummaryRow label="Reference" value={contribution.id.slice(-10).toUpperCase()} />
            <SummaryRow label="Type" value={contribution.type} />
            <SummaryRow
              label="Going to"
              value={contribution.campaign?.title ?? "General Fund"}
            />
            <SummaryRow label="Status" value={contribution.status === "paid" ? "Paid" : "Processing"} />
          </dl>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CTAButton href="/" variant="primary" size="md">
            Back to home
          </CTAButton>
          {contribution?.campaign?.slug && (
            <CTAButton
              href={`/campaigns/${contribution.campaign.slug}`}
              variant="ghost"
              size="md"
              arrow
            >
              View campaign progress
            </CTAButton>
          )}
        </div>

        <p className="mt-12 inline-flex items-center gap-2 text-[0.82rem] text-[var(--color-ink-muted)]">
          <Mail size={14} />
          A receipt for tax purposes is on its way to your inbox.
        </p>
      </div>
    </section>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        {label}
      </dt>
      <dd className="mt-1 font-display text-[0.95rem] font-bold capitalize text-[var(--color-ink)]">
        {value}
      </dd>
    </div>
  )
}
