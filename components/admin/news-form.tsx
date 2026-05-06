"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import {
  createNews,
  updateNews,
  type NewsFormState,
} from "@/app/admin/news/actions"
import { TipTapEditor } from "@/components/admin/tiptap-editor"
import { cn } from "@/lib/utils"

type Mode = { kind: "create" } | { kind: "edit"; id: string; publishedAt: string | null }

type Initial = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: "news" | "mission" | "impact" | "press"
  author: string
  published: boolean
}

const EMPTY: Initial = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "/images/news/",
  category: "news",
  author: "",
  published: false,
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

export function NewsForm({
  mode,
  initial = EMPTY,
}: {
  mode: Mode
  initial?: Initial
}) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<NewsFormState | null>(null)

  const [title, setTitle] = useState(initial.title)
  const [slug, setSlug] = useState(initial.slug)
  const [slugTouched, setSlugTouched] = useState(mode.kind === "edit" || !!initial.slug)
  const [excerpt, setExcerpt] = useState(initial.excerpt)
  const [coverImage, setCoverImage] = useState(initial.coverImage)
  const [category, setCategory] = useState(initial.category)
  const [author, setAuthor] = useState(initial.author)
  const [published, setPublished] = useState(initial.published)

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
          ? await createNews(state, formData)
          : await updateNews(mode.id, state, formData)
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
        name="slug"
        hint="URL path: /news/<slug>"
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

      <Field
        label="Excerpt"
        name="excerpt"
        hint="Short summary shown on the news index and social previews."
        error={state?.fieldErrors?.excerpt}
      >
        <textarea
          name="excerpt"
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={cn(inputCls(state?.fieldErrors?.excerpt), "resize-y")}
        />
      </Field>

      <Field label="Content" name="content" error={state?.fieldErrors?.content}>
        <TipTapEditor
          name="content"
          defaultValue={initial.content}
          placeholder="Tell the story…"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Cover image (path or URL)" name="coverImage" error={state?.fieldErrors?.coverImage}>
          <input
            name="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className={cn(inputCls(state?.fieldErrors?.coverImage), "font-mono text-[0.88rem]")}
          />
        </Field>

        <Field label="Category" name="category">
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Initial["category"])}
            className={inputCls()}
          >
            <option value="news">News</option>
            <option value="mission">Mission</option>
            <option value="impact">Impact</option>
            <option value="press">Press</option>
          </select>
        </Field>
      </div>

      <Field label="Author" name="author" error={state?.fieldErrors?.author}>
        <input
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={inputCls(state?.fieldErrors?.author)}
        />
      </Field>

      <div className="flex items-start gap-3 rounded-md border border-[var(--color-hairline)] bg-[var(--color-ash)] p-4">
        <input
          type="checkbox"
          id="published"
          name="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--color-hairline)] text-[var(--color-teal)] focus:ring-[var(--color-teal)]"
        />
        <div className="flex-1">
          <label htmlFor="published" className="cursor-pointer font-display text-[0.92rem] font-bold text-[var(--color-ink)]">
            Publish this post
          </label>
          <p className="mt-0.5 text-[0.82rem] text-[var(--color-ink-muted)]">
            {mode.kind === "edit" && mode.publishedAt
              ? `Originally published ${new Date(mode.publishedAt).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}.`
              : "Publishing makes the post visible on /news and the homepage's Latest News section."}
          </p>
        </div>
      </div>

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
          {mode.kind === "create"
            ? published
              ? "Create & publish"
              : "Save draft"
            : "Save changes"}
        </button>
        <Link
          href="/admin/news"
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
