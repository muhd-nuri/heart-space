"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Loader2, Users, Globe2, Sparkles, Calendar } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"
import { submitVolunteer, type VolunteerFormState } from "@/app/(public)/volunteer/actions"
import { cn } from "@/lib/utils"

type Program = "yert" | "fellowship" | "general" | "event"

const PROGRAMS: Array<{
  id: Program
  label: string
  shortLabel: string
  tagline: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}> = [
  {
    id: "yert",
    label: "YERT",
    shortLabel: "Youth Emergency Response Team",
    tagline: "Frontline mobilisation, training, deployment.",
    icon: Sparkles,
  },
  {
    id: "fellowship",
    label: "Fellowship",
    shortLabel: "Global Humanitarian Fellowship",
    tagline: "A flagship year-long programme for committed humanitarians.",
    icon: Globe2,
  },
  {
    id: "general",
    label: "General",
    shortLabel: "General volunteer",
    tagline: "Flexible support across missions, events, operations.",
    icon: Users,
  },
  {
    id: "event",
    label: "Event",
    shortLabel: "Event volunteer",
    tagline: "Run for Humanity, fundraisers, community gatherings.",
    icon: Calendar,
  },
]

export function VolunteerForm({ initialProgram }: { initialProgram?: Program }) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<VolunteerFormState | null>(null)
  const [program, setProgram] = useState<Program>(initialProgram ?? "yert")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("program", program)
    startTransition(async () => {
      const result = await submitVolunteer(state, formData)
      setState(result)
      if (result.ok) {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  return (
    <AnimatePresence mode="wait">
      {state?.ok && state.applied ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <SuccessState applied={state.applied} />
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid gap-12 md:grid-cols-12 md:gap-12 lg:gap-16"
        >
          <div className="md:col-span-7 space-y-12">
            <Step number="01" title="Pick your programme">
              <input type="hidden" name="program" value={program} />
              <div className="grid gap-3 sm:grid-cols-2">
                {PROGRAMS.map((p) => {
                  const active = p.id === program
                  const Icon = p.icon
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setProgram(p.id)}
                      aria-pressed={active}
                      className={cn(
                        "group relative rounded-[var(--radius-card)] border-2 bg-white p-5 text-left transition-all",
                        active
                          ? "-translate-y-0.5 border-[var(--color-teal)] shadow-[0_4px_0_0_var(--color-teal)]"
                          : "border-[var(--color-hairline)] hover:border-[var(--color-teal)]/60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "grid h-10 w-10 place-items-center rounded-full transition-colors",
                            active
                              ? "bg-[var(--color-teal)] text-white"
                              : "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]"
                          )}
                        >
                          <Icon size={18} strokeWidth={1.8} />
                        </span>
                        {active && (
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-teal)] text-white">
                            <Check size={13} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <h3 className="mt-5 font-display text-[1.18rem] font-bold text-[var(--color-ink)]">
                        {p.label}
                      </h3>
                      <p className="mt-1 text-[0.78rem] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
                        {p.shortLabel}
                      </p>
                      <p className="mt-3 text-[0.88rem] leading-relaxed text-[var(--color-ink-muted)]">
                        {p.tagline}
                      </p>
                    </button>
                  )
                })}
              </div>
            </Step>

            <Step number="02" title="Tell us about you">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  name="name"
                  autoComplete="name"
                  error={state?.fieldErrors?.name}
                  className="sm:col-span-2"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  error={state?.fieldErrors?.email}
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+60 12 345 6789"
                  error={state?.fieldErrors?.phone}
                />
                <Field
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Kuala Lumpur"
                  error={state?.fieldErrors?.city}
                />
                <Field
                  label="Age (optional)"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  error={state?.fieldErrors?.age}
                />
              </div>
              <p className="mt-4 text-[0.82rem] leading-relaxed text-[var(--color-ink-muted)]">
                We use your details only to assess fit and follow up. We never
                share or resell.
              </p>
            </Step>

            {state && !state.ok && state.message && (
              <p className="rounded-[var(--radius-card)] border border-[var(--color-coral)]/40 bg-[var(--color-coral-pale)] px-5 py-3.5 text-[0.9rem] text-[var(--color-coral-dark)]">
                {state.message}
              </p>
            )}
          </div>

          <aside className="md:col-span-5">
            <div className="md:sticky md:top-[88px]">
              <ApplyCard
                program={program}
                isPending={isPending}
              />
            </div>
          </aside>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

function Step({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[var(--color-coral)]">
          {number}
        </span>
        <h2 className="font-display text-[1.4rem] font-bold tracking-[-0.012em] text-[var(--color-ink)] md:text-[1.6rem]">
          {title}
        </h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  inputMode,
  error,
  className,
}: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  placeholder?: string
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal"
  error?: string
  className?: string
}) {
  return (
    <div data-field={name} className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={name}
        className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        className={cn(
          "rounded-md border-2 bg-white px-4 py-3 text-[0.95rem] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-muted)]/70",
          error
            ? "border-[var(--color-coral)] focus:border-[var(--color-coral-dark)]"
            : "border-[var(--color-hairline)] focus:border-[var(--color-teal)]"
        )}
      />
      {error && <p className="text-[0.82rem] text-[var(--color-coral-dark)]">{error}</p>}
    </div>
  )
}

function ApplyCard({
  program,
  isPending,
}: {
  program: Program
  isPending: boolean
}) {
  const p = PROGRAMS.find((x) => x.id === program)!
  return (
    <motion.div
      layout
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-7 shadow-[var(--shadow-card)]"
    >
      <p className="font-display text-[0.74rem] font-bold uppercase tracking-[0.18em] text-[var(--color-coral)]">
        Your application
      </p>

      <div className="mt-5 flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]">
          <p.icon size={20} strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[1.4rem] font-extrabold leading-tight text-[var(--color-ink)]">
            {p.label}
          </p>
          <p className="text-[0.82rem] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
            {p.shortLabel}
          </p>
        </div>
      </div>

      <ul className="mt-7 space-y-3 border-t border-[var(--color-hairline)] pt-6 text-[0.9rem] text-[var(--color-ink-soft)]">
        <Bullet>We review every application.</Bullet>
        <Bullet>You'll hear from us within 5 working days.</Bullet>
        <Bullet>No fee. Open to all backgrounds.</Bullet>
      </ul>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "group/cta mt-7 flex w-full items-center justify-center gap-2 rounded-full font-display font-bold whitespace-nowrap transition-all duration-200",
          "h-[3.25rem] px-8 text-[1rem] tracking-[-0.005em]",
          "bg-[var(--color-teal)] text-white shadow-[0_4px_0_0_var(--color-teal-dark)]",
          "hover:bg-[var(--color-teal-dark)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#0d6164]",
          "active:translate-y-1 active:shadow-[0_0_0_0_var(--color-teal-dark)]",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[var(--color-teal)] disabled:hover:shadow-[0_4px_0_0_var(--color-teal-dark)]"
        )}
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Submitting…</span>
          </>
        ) : (
          <>
            <span>Apply to join</span>
            <ArrowRight size={18} strokeWidth={2.4} className="transition-transform group-hover/cta:translate-x-0.5" />
          </>
        )}
      </button>
    </motion.div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-[var(--color-teal)] text-white">
        <Check size={9} strokeWidth={3.5} />
      </span>
      <span>{children}</span>
    </li>
  )
}

function SuccessState({ applied }: { applied: { firstName: string; program: string } }) {
  const programLabel =
    applied.program === "yert" ? "YERT" : capitalize(applied.program)

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div
        aria-hidden
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--color-teal)] text-white shadow-[0_8px_28px_rgba(26,172,176,0.4)]"
      >
        <Check size={36} strokeWidth={2.5} />
      </div>

      <p className="mt-7 font-display text-[0.74rem] font-bold uppercase tracking-[0.18em] text-[var(--color-coral)]">
        — You&apos;re in
      </p>
      <h2 className="mt-3 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.022em] text-[var(--color-ink)] md:text-[3.25rem]">
        Welcome, {applied.firstName}.
      </h2>
      <p className="mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.12rem]">
        Your application for the <strong className="text-[var(--color-ink)]">{programLabel}</strong> programme is in. A member of the team will reach
        out within 5 working days. Check your inbox for a confirmation.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <CTAButton href="/" variant="primary" size="md">
          Back to home
        </CTAButton>
        <CTAButton href="/news" variant="ghost" size="md" arrow>
          See latest from the field
        </CTAButton>
      </div>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
