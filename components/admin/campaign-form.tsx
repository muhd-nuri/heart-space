"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import {
  createCampaign,
  updateCampaign,
  type CampaignFormState,
} from "@/app/admin/campaigns/actions"
import { ImageUpload } from "@/components/admin/image-upload"
import { cn, formatRM } from "@/lib/utils"

type Mode = { kind: "create" } | { kind: "edit"; id: string; raised: number }

type Initial = {
  title: string
  slug: string
  description: string
  image: string
  target: number
  status: "active" | "draft" | "completed"
  category: "healthcare" | "disaster" | "waqf" | "zakat"
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD or empty
}

const EMPTY: Initial = {
  title: "",
  slug: "",
  description: "",
  image: "/images/campaigns/",
  target: 50000,
  status: "draft",
  category: "healthcare",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export function CampaignForm({
  mode,
  initial = EMPTY,
}: {
  mode: Mode
  initial?: Initial
}) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<CampaignFormState | null>(null)

  const [title, setTitle] = useState(initial.title)
  const [slug, setSlug] = useState(initial.slug)
  const [slugTouched, setSlugTouched] = useState(mode.kind === "edit" || !!initial.slug)
  const [description, setDescription] = useState(initial.description)
  const [image, setImage] = useState(initial.image)
  const [target, setTarget] = useState<string>(String(initial.target))
  const [status, setStatus] = useState(initial.status)
  const [category, setCategory] = useState(initial.category)
  const [startDate, setStartDate] = useState(initial.startDate)
  const [endDate, setEndDate] = useState(initial.endDate)

  // Auto-fill slug from title in create mode until the user edits it manually.
  useEffect(() => {
    if (mode.kind === "create" && !slugTouched) {
      setSlug(slugify(title))
    }
  }, [title, slugTouched, mode.kind])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result =
        mode.kind === "create"
          ? await createCampaign(state, formData)
          : await updateCampaign(mode.id, state, formData)
      setState(result)
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Field label="Title" name="title" error={state?.fieldErrors?.title}>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls(state?.fieldErrors?.title)}
        />
      </Field>

      <Field
        label="Slug"
        hint="URL path: /campaigns/<slug>. Auto-derived from title; edit to override."
        name="slug"
        error={state?.fieldErrors?.slug}
      >
        <input
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugTouched(true)
          }}
          className={cn(inputCls(state?.fieldErrors?.slug), "font-mono text-[0.88rem]")}
        />
      </Field>

      <Field label="Short description" name="description" error={state?.fieldErrors?.description}>
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={cn(inputCls(state?.fieldErrors?.description), "resize-y leading-relaxed")}
        />
      </Field>

      <Field
        label="Cover image"
        name="image"
        hint="16:10 ratio reads best in cards and detail hero. JPG / PNG / WEBP up to 4 MB."
        error={state?.fieldErrors?.image}
      >
        <ImageUpload
          endpoint="campaignImage"
          name="image"
          value={image}
          onChange={setImage}
          aspect="16/10"
        />
      </Field>

      <Field label="Target (RM)" name="target" error={state?.fieldErrors?.target}>
        <input
          name="target"
          type="number"
          min={1}
          step={100}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className={cn(inputCls(state?.fieldErrors?.target), "max-w-xs")}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Status" name="status">
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Initial["status"])}
            className={inputCls()}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </Field>

        <Field label="Category" name="category">
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Initial["category"])}
            className={inputCls()}
          >
            <option value="healthcare">Healthcare</option>
            <option value="disaster">Disaster Relief</option>
            <option value="waqf">Waqf</option>
            <option value="zakat">Zakat</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Start date" name="startDate" error={state?.fieldErrors?.startDate}>
          <input
            name="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputCls(state?.fieldErrors?.startDate)}
          />
        </Field>

        <Field label="End date (optional)" name="endDate" error={state?.fieldErrors?.endDate}>
          <input
            name="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputCls(state?.fieldErrors?.endDate)}
          />
        </Field>
      </div>

      {mode.kind === "edit" && (
        <div className="rounded-md border border-[var(--color-hairline)] bg-[var(--color-ash)] px-5 py-3.5">
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Raised so far
          </p>
          <p className="mt-1 font-display text-[1.5rem] font-extrabold text-[var(--color-teal-dark)]">
            {formatRM(mode.raised)}
          </p>
          <p className="mt-1 text-[0.78rem] text-[var(--color-ink-muted)]">
            Updated automatically by the contribution webhook.
          </p>
        </div>
      )}

      {state && !state.ok && state.message && (
        <p className="rounded-md border border-[var(--color-coral)]/40 bg-[var(--color-coral-pale)] px-4 py-3 text-[0.88rem] text-[var(--color-coral-dark)]">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-hairline)] pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--color-teal)] px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)] disabled:opacity-60"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
          {mode.kind === "create" ? "Create campaign" : "Save changes"}
        </button>
        <Link
          href="/admin/campaigns"
          className="rounded-md px-3 py-2 text-[0.88rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  hint,
  error,
  children,
}: {
  label: string
  name: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[0.78rem] text-[var(--color-ink-muted)]">{hint}</p>}
      {error && <p className="text-[0.82rem] text-[var(--color-coral-dark)]">{error}</p>}
    </div>
  )
}

function inputCls(error?: string) {
  return cn(
    "w-full rounded-md border bg-white px-3.5 py-2.5 text-[0.92rem] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-muted)]/70",
    error
      ? "border-[var(--color-coral)] focus:border-[var(--color-coral-dark)]"
      : "border-[var(--color-hairline)] focus:border-[var(--color-teal)]"
  )
}
