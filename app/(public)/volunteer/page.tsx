import type { Metadata } from "next"
import { VolunteerForm } from "@/components/sections/volunteer/volunteer-form"
import { SectionLabel } from "@/components/ui/section-wrapper"

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Join HeartSpace as a youth volunteer. Apply for YERT, the Global Humanitarian Fellowship, or general / event volunteering.",
}

const PROGRAMS = ["yert", "fellowship", "general", "event"] as const
type Program = (typeof PROGRAMS)[number]

type Props = { searchParams: Promise<{ program?: string }> }

export default async function VolunteerPage({ searchParams }: Props) {
  const { program } = await searchParams
  const initialProgram = PROGRAMS.includes(program as Program)
    ? (program as Program)
    : undefined

  return (
    <>
      <header className="border-b border-[var(--color-hairline)] bg-[var(--color-ash)]">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
          <SectionLabel tone="coral">Volunteer</SectionLabel>
          <h1 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.05] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
            Join the movement.
          </h1>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.12rem]">
            Pick a programme and tell us about yourself. We read every
            application and reply within 5 working days. No fee. Open to
            all backgrounds.
          </p>
        </div>
      </header>

      <section className="bg-[var(--color-off-white)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <VolunteerForm initialProgram={initialProgram} />
        </div>
      </section>
    </>
  )
}
