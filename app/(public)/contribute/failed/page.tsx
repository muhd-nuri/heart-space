import type { Metadata } from "next"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"
import { SectionLabel } from "@/components/ui/section-wrapper"

export const metadata: Metadata = {
  title: "Payment failed",
  description: "We couldn't complete your contribution.",
}

type Props = { searchParams: Promise<{ reason?: string }> }

export default async function FailedPage({ searchParams }: Props) {
  const { reason } = await searchParams

  return (
    <section className="relative isolate -mt-[60px] overflow-hidden bg-[var(--color-off-white)] md:-mt-[72px]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[60svh] bg-gradient-to-b from-[var(--color-coral-pale)] via-[var(--color-off-white)] to-[var(--color-off-white)]"
      />

      <div className="mx-auto flex min-h-[80svh] max-w-2xl flex-col items-center justify-center px-6 pb-16 pt-[calc(60px+5rem)] text-center md:px-8 md:pb-24 md:pt-[calc(72px+6rem)]">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-coral)] text-white">
          <AlertTriangle size={36} strokeWidth={2.5} />
        </div>

        <SectionLabel tone="coral">Payment failed</SectionLabel>

        <h1 className="mt-3 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.022em] text-[var(--color-ink)] md:text-[3.25rem]">
          Something didn&apos;t go through.
        </h1>

        <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.1rem]">
          We weren&apos;t able to complete your contribution. No money was
          taken. Try again, or contact us if the problem keeps happening.
        </p>

        {reason && (
          <p className="mt-6 max-w-md rounded-md border border-[var(--color-coral)]/40 bg-[var(--color-coral-pale)] px-4 py-3 text-[0.82rem] text-[var(--color-coral-dark)]">
            <strong className="font-semibold">Detail:</strong> {reason}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CTAButton href="/contribute" variant="contribute" size="md" arrow>
            Try again
          </CTAButton>
          <CTAButton href="/contact" variant="ghost" size="md">
            <ArrowLeft size={14} /> Contact us
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
