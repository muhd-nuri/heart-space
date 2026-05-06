"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react"
import type { CampaignCardData } from "@/components/ui/campaign-card"
import { CategoryBadge } from "@/components/ui/category-badge"
import { CampaignImage } from "@/components/ui/campaign-image"
import { CTAButton } from "@/components/ui/cta-button"
import { submitContribution, type ContributionFormState } from "@/app/(public)/contribute/actions"
import { cn, formatRM, progressPct } from "@/lib/utils"

type Type = "sadaqah" | "zakat" | "waqf" | "general"

const TYPES: Array<{ id: Type; label: string; tagline: string }> = [
  { id: "sadaqah", label: "Sadaqah", tagline: "Voluntary charity. Open to anyone, anytime." },
  { id: "zakat", label: "Zakat", tagline: "Obligatory alms. Direct to eligible recipients." },
  { id: "waqf", label: "Waqf", tagline: "Endowment. Funds last for generations." },
  { id: "general", label: "General", tagline: "Unrestricted. Where need is greatest." },
]

const PRESETS = [25, 50, 100, 250, 500] as const

type Props = {
  campaigns: CampaignCardData[]
  initialType?: Type
  initialCampaignSlug?: string
}

export function ContributeForm({ campaigns, initialType = "sadaqah", initialCampaignSlug }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ContributionFormState | null>(null)

  const [type, setType] = useState<Type>(initialType)
  const [campaignSlug, setCampaignSlug] = useState<string>(
    initialCampaignSlug && campaigns.some((c) => c.slug === initialCampaignSlug)
      ? initialCampaignSlug
      : "general-fund"
  )
  const [presetAmount, setPresetAmount] = useState<number | null>(50)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const amount = presetAmount ?? Number(customAmount || 0)
  const selectedCampaign = campaigns.find((c) => c.slug === campaignSlug)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("amount", String(amount))
    startTransition(async () => {
      const result = await submitContribution(state, formData)
      // submitContribution redirects on success, so we only land here on validation failure.
      setState(result)
    })
  }

  // Scroll to first error if validation fails.
  useEffect(() => {
    if (state && !state.ok && state.fieldErrors) {
      const first = Object.keys(state.fieldErrors)[0]
      const el = document.querySelector(`[data-field="${first}"]`)
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [state])

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 md:grid-cols-12 md:gap-12 lg:gap-16">
      <div className="md:col-span-7 space-y-12">
        {/* TYPE */}
        <Step number="01" title="Type of contribution">
          <input type="hidden" name="type" value={type} />
          <div className="grid gap-3 sm:grid-cols-2">
            {TYPES.map((t) => {
              const active = t.id === type
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id)}
                  data-field={active ? "type" : undefined}
                  className={cn(
                    "group relative rounded-[var(--radius-card)] border-2 bg-white p-5 text-left transition-all",
                    active
                      ? "border-[var(--color-teal)] shadow-[0_4px_0_0_var(--color-teal)] -translate-y-0.5"
                      : "border-[var(--color-hairline)] hover:border-[var(--color-teal)]/60"
                  )}
                  aria-pressed={active}
                >
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={t.id} />
                    {active && <ShieldCheck size={18} strokeWidth={2.2} className="text-[var(--color-teal)]" />}
                  </div>
                  <h3 className="mt-4 font-display text-[1.18rem] font-bold text-[var(--color-ink)]">
                    {t.label}
                  </h3>
                  <p className="mt-1 text-[0.86rem] leading-relaxed text-[var(--color-ink-muted)]">
                    {t.tagline}
                  </p>
                </button>
              )
            })}
          </div>
        </Step>

        {/* CAMPAIGN */}
        <Step number="02" title="Where it goes">
          <input type="hidden" name="campaignSlug" value={campaignSlug} />
          <div className="space-y-2.5">
            <CampaignRow
              active={campaignSlug === "general-fund"}
              onClick={() => setCampaignSlug("general-fund")}
              title="HeartSpace General Fund"
              description="Unrestricted — we direct it to where it's needed most this month."
              accent="teal"
            />
            {campaigns.map((c) => (
              <CampaignRow
                key={c.slug}
                active={campaignSlug === c.slug}
                onClick={() => setCampaignSlug(c.slug)}
                title={c.title}
                description={c.description}
                image={c.image}
                category={c.category}
                progress={progressPct(c.raised, c.target)}
              />
            ))}
          </div>
        </Step>

        {/* AMOUNT */}
        <Step number="03" title="Amount">
          <div data-field="amount" className="space-y-4">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {PRESETS.map((v) => {
                const active = presetAmount === v
                return (
                  <button
                    type="button"
                    key={v}
                    onClick={() => {
                      setPresetAmount(v)
                      setCustomAmount("")
                    }}
                    className={cn(
                      "rounded-full border-2 px-4 py-3 text-center font-display text-[0.95rem] font-bold tracking-[-0.005em] transition-all",
                      active
                        ? "border-[var(--color-coral)] bg-[var(--color-coral)] text-white shadow-[0_3px_0_0_var(--color-coral-dark)]"
                        : "border-[var(--color-hairline)] bg-white text-[var(--color-ink)] hover:border-[var(--color-coral)]/60"
                    )}
                  >
                    RM {v}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                or
              </span>
              <div className="flex flex-1 items-center rounded-full border-2 border-[var(--color-hairline)] bg-white pl-5 transition-colors focus-within:border-[var(--color-coral)]">
                <span className="font-display text-[0.95rem] font-bold text-[var(--color-ink-muted)]">RM</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={5}
                  step={1}
                  placeholder="custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setPresetAmount(null)
                  }}
                  className="w-full bg-transparent px-3 py-3 font-display text-[0.95rem] font-bold tracking-[-0.005em] text-[var(--color-ink)] placeholder:font-body placeholder:font-normal placeholder:text-[var(--color-ink-muted)] focus:outline-none"
                />
              </div>
            </div>
            {state?.fieldErrors?.amount && (
              <p className="text-[0.82rem] text-[var(--color-coral-dark)]">
                {state.fieldErrors.amount}
              </p>
            )}
          </div>
        </Step>

        {/* DETAILS */}
        <Step number="04" title="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              name="name"
              value={name}
              onChange={setName}
              autoComplete="name"
              error={state?.fieldErrors?.name}
              className="sm:col-span-2"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              error={state?.fieldErrors?.email}
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={setPhone}
              autoComplete="tel"
              placeholder="+60 12 345 6789"
              error={state?.fieldErrors?.phone}
            />
          </div>
          <p className="mt-4 text-[0.82rem] leading-relaxed text-[var(--color-ink-muted)]">
            We use your details only to send a receipt and the occasional
            field update. We never share or resell.
          </p>
        </Step>

        {state && !state.ok && state.message && (
          <p className="rounded-[var(--radius-card)] border border-[var(--color-coral)]/40 bg-[var(--color-coral-pale)] px-5 py-3.5 text-[0.9rem] text-[var(--color-coral-dark)]">
            {state.message}
          </p>
        )}
      </div>

      {/* Sticky summary */}
      <aside className="md:col-span-5">
        <div className="md:sticky md:top-[88px]">
          <Summary
            type={type}
            campaign={
              campaignSlug === "general-fund"
                ? { title: "HeartSpace General Fund", description: "Unrestricted" }
                : selectedCampaign
                  ? { title: selectedCampaign.title, description: selectedCampaign.description }
                  : { title: "HeartSpace General Fund", description: "Unrestricted" }
            }
            amount={amount}
            isPending={isPending}
          />
        </div>
      </aside>
    </form>
  )
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
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

function CampaignRow({
  active,
  onClick,
  title,
  description,
  image,
  category,
  progress,
  accent = "default",
}: {
  active: boolean
  onClick: () => void
  title: string
  description: string
  image?: string
  category?: string
  progress?: number
  accent?: "default" | "teal"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group flex w-full items-center gap-4 rounded-[var(--radius-card)] border-2 bg-white p-4 text-left transition-all",
        active
          ? "border-[var(--color-teal)] shadow-[0_4px_0_0_var(--color-teal)] -translate-y-0.5"
          : "border-[var(--color-hairline)] hover:border-[var(--color-teal)]/60"
      )}
    >
      <span
        className={cn(
          "relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full",
          accent === "teal" ? "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]" : ""
        )}
      >
        {image && category ? (
          <CampaignImage src={image} alt={title} category={category} className="absolute inset-0 h-full w-full" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[1rem] font-bold text-[var(--color-ink)]">{title}</span>
        <span className="mt-0.5 block truncate text-[0.86rem] text-[var(--color-ink-muted)]">{description}</span>
        {typeof progress === "number" && (
          <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-[var(--color-teal-pale)]">
            <span
              className="block h-full rounded-full bg-[var(--color-teal)]"
              style={{ width: `${progress}%` }}
            />
          </span>
        )}
      </span>
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
          active ? "border-[var(--color-teal)] bg-[var(--color-teal)]" : "border-[var(--color-hairline)]"
        )}
      >
        {active && (
          <span className="h-2 w-2 rounded-full bg-white" />
        )}
      </span>
    </button>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  error,
  className,
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  placeholder?: string
  error?: string
  className?: string
}) {
  return (
    <div data-field={name} className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={name} className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
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

function Summary({
  type,
  campaign,
  amount,
  isPending,
}: {
  type: Type
  campaign: { title: string; description: string }
  amount: number
  isPending: boolean
}) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-7 shadow-[var(--shadow-card)]"
    >
      <p className="font-display text-[0.74rem] font-bold uppercase tracking-[0.18em] text-[var(--color-coral)]">
        Your contribution
      </p>

      <dl className="mt-5 space-y-4">
        <Row label="Type" value={type.charAt(0).toUpperCase() + type.slice(1)} />
        <Row label="Going to" value={campaign.title} sub={campaign.description} />
      </dl>

      <div className="mt-6 border-t border-[var(--color-hairline)] pt-6">
        <p className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Total
        </p>
        <p className="mt-1 font-display text-[3rem] font-extrabold leading-none tracking-[-0.025em] text-[var(--color-ink)] md:text-[3.5rem]">
          {amount > 0 ? formatRM(amount) : <span className="text-[var(--color-stone)]">RM —</span>}
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending || amount < 5}
        className={cn(
          "group/cta mt-6 flex w-full items-center justify-center gap-2 rounded-full font-display font-bold whitespace-nowrap transition-all duration-200",
          "h-[3.25rem] px-8 text-[1rem] tracking-[-0.005em]",
          "bg-[var(--color-coral)] text-white shadow-[0_4px_0_0_var(--color-coral-dark)]",
          "hover:bg-[var(--color-coral-dark)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#a8443c]",
          "active:translate-y-1 active:shadow-[0_0_0_0_var(--color-coral-dark)]",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[var(--color-coral)] disabled:hover:shadow-[0_4px_0_0_var(--color-coral-dark)]"
        )}
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Processing…</span>
          </>
        ) : (
          <>
            <span>Continue to payment</span>
            <ArrowRight size={18} strokeWidth={2.4} className="transition-transform group-hover/cta:translate-x-0.5" />
          </>
        )}
      </button>

      <div className="mt-5 flex items-center gap-2 text-[0.78rem] text-[var(--color-ink-muted)]">
        <ShieldCheck size={14} className="text-[var(--color-teal)]" />
        <span>Secured by ToyyibPay · FPX, cards, e-wallets · MYR</span>
      </div>
    </motion.div>
  )
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        {label}
      </dt>
      <dd className="text-right">
        <span className="block font-display text-[0.95rem] font-bold text-[var(--color-ink)]">{value}</span>
        {sub && <span className="block text-[0.78rem] text-[var(--color-ink-muted)]">{sub}</span>}
      </dd>
    </div>
  )
}
