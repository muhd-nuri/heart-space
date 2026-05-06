"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { submitContact, type ContactFormState } from "@/app/(public)/contact/actions"
import { cn } from "@/lib/utils"

const TOPIC_OPTIONS = [
  { id: "general", label: "General enquiry" },
  { id: "partner", label: "Partnership" },
  { id: "csr", label: "Corporate CSR" },
  { id: "clinical", label: "Clinical / healthcare" },
  { id: "institutional", label: "Institutional" },
  { id: "press", label: "Press" },
  { id: "donor", label: "Donor relations" },
] as const

type Topic = (typeof TOPIC_OPTIONS)[number]["id"]

export function ContactForm({ initialTopic }: { initialTopic?: Topic }) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ContactFormState | null>(null)
  const [topic, setTopic] = useState<Topic>(initialTopic ?? "general")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("topic", topic)
    startTransition(async () => {
      const result = await submitContact(state, formData)
      setState(result)
      if (result.ok) window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  return (
    <AnimatePresence mode="wait">
      {state?.ok ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-10 text-center shadow-[var(--shadow-card)]"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--color-teal)] text-white">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <h3 className="mt-6 font-display text-[1.85rem] font-extrabold tracking-[-0.018em] text-[var(--color-ink)]">
            Got it, {state.submitted?.name.split(" ")[0]}.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
            We read every message. A team member replies in plain English
            within two working days.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={onSubmit}
          noValidate
          className="space-y-6 rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
        >
          <input type="hidden" name="topic" value={topic} />

          <Field label="What's this about?" name="topic">
            <div className="flex flex-wrap gap-2">
              {TOPIC_OPTIONS.map((t) => {
                const active = t.id === topic
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[0.82rem] font-medium tracking-[-0.005em] transition-all",
                      active
                        ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white shadow-[0_3px_0_0_var(--color-teal-dark)]"
                        : "border-[var(--color-hairline)] bg-white text-[var(--color-ink)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
                    )}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="name" error={state?.fieldErrors?.name}>
              <input
                name="name"
                autoComplete="name"
                className={inputCls(state?.fieldErrors?.name)}
              />
            </Field>
            <Field label="Email" name="email" error={state?.fieldErrors?.email}>
              <input
                name="email"
                type="email"
                autoComplete="email"
                className={inputCls(state?.fieldErrors?.email)}
              />
            </Field>
            <Field label="Organisation (optional)" name="organization" error={state?.fieldErrors?.organization}>
              <input
                name="organization"
                autoComplete="organization"
                className={inputCls(state?.fieldErrors?.organization)}
              />
            </Field>
            <Field label="Phone (optional)" name="phone" error={state?.fieldErrors?.phone}>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+60 12 345 6789"
                className={inputCls(state?.fieldErrors?.phone)}
              />
            </Field>
          </div>

          <Field label="Message" name="message" error={state?.fieldErrors?.message}>
            <textarea
              name="message"
              rows={6}
              placeholder="Tell us what you have in mind…"
              className={cn(inputCls(state?.fieldErrors?.message), "resize-y leading-relaxed")}
            />
          </Field>

          {state && !state.ok && state.message && (
            <p className="rounded-md border border-[var(--color-coral)]/40 bg-[var(--color-coral-pale)] px-4 py-3 text-[0.88rem] text-[var(--color-coral-dark)]">
              {state.message}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-hairline)] pt-6">
            <p className="text-[0.78rem] text-[var(--color-ink-muted)]">
              We never share or resell. Replies arrive within two working days.
            </p>
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "group/cta inline-flex items-center gap-2 rounded-full font-display font-bold whitespace-nowrap transition-all duration-200",
                "h-11 px-6 text-[0.92rem] tracking-[-0.005em]",
                "bg-[var(--color-teal)] text-white shadow-[0_4px_0_0_var(--color-teal-dark)]",
                "hover:bg-[var(--color-teal-dark)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#0d6164]",
                "active:translate-y-1 active:shadow-[0_0_0_0_var(--color-teal-dark)]",
                "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <ArrowRight size={16} strokeWidth={2.4} className="transition-transform group-hover/cta:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string
  name: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div data-field={name} className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-[0.82rem] text-[var(--color-coral-dark)]">{error}</p>}
    </div>
  )
}

function inputCls(error?: string) {
  return cn(
    "rounded-md border-2 bg-white px-4 py-3 text-[0.95rem] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-muted)]/70",
    error
      ? "border-[var(--color-coral)] focus:border-[var(--color-coral-dark)]"
      : "border-[var(--color-hairline)] focus:border-[var(--color-teal)]"
  )
}
