"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Loader2, Pencil, Plus, X } from "lucide-react"
import {
  createUpdate,
  editUpdate,
  deleteUpdate,
  type UpdateFormState,
} from "@/app/admin/campaigns/[id]/updates-actions"
import { DeleteButton } from "@/components/admin/delete-button"
import {
  UpdateImageGallery,
  type GalleryImage,
} from "@/components/admin/update-image-gallery"
import { cn } from "@/lib/utils"

type Update = {
  id: string
  title: string
  body: string
  postedAt: string // ISO string
  images: GalleryImage[]
}

type Props = {
  campaignId: string
  updates: Update[]
}

export function CampaignUpdates({ campaignId, updates }: Props) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[1.05rem] font-bold text-[var(--color-ink)]">
          Field updates
          <span className="ml-2 text-[0.78rem] font-medium text-[var(--color-ink-muted)]">
            ({updates.length})
          </span>
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-teal)] px-3 py-1.5 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
          >
            <Plus size={12} strokeWidth={2.4} />
            New update
          </button>
        )}
      </div>

      <p className="mt-1.5 text-[0.86rem] leading-relaxed text-[var(--color-ink-muted)]">
        Posted in reverse-chronological order on the public campaign page.
      </p>

      <div className="mt-5 space-y-3">
        {adding && (
          <UpdateForm
            campaignId={campaignId}
            mode={{ kind: "create" }}
            onDone={() => setAdding(false)}
            onCancel={() => setAdding(false)}
          />
        )}

        {updates.length === 0 && !adding && (
          <div className="rounded-md border border-dashed border-[var(--color-hairline)] bg-white p-8 text-center text-[var(--color-ink-muted)]">
            No updates yet. Click <span className="font-display font-bold text-[var(--color-ink)]">New update</span> above to post the first.
          </div>
        )}

        {updates.map((u) =>
          editingId === u.id ? (
            <UpdateForm
              key={u.id}
              campaignId={campaignId}
              mode={{ kind: "edit", id: u.id }}
              initial={u}
              onDone={() => setEditingId(null)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <UpdateRow
              key={u.id}
              update={u}
              campaignId={campaignId}
              onEdit={() => setEditingId(u.id)}
            />
          )
        )}
      </div>
    </section>
  )
}

function UpdateRow({
  update: u,
  campaignId,
  onEdit,
}: {
  update: Update
  campaignId: string
  onEdit: () => void
}) {
  const date = new Date(u.postedAt).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return (
    <article className="rounded-md border border-[var(--color-hairline)] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-coral)]">
            {date}
          </p>
          <h3 className="mt-1.5 font-display text-[1.05rem] font-bold leading-tight text-[var(--color-ink)]">
            {u.title}
          </h3>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit update"
            className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-hairline)] bg-white text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
          >
            <Pencil size={12} />
          </button>
          <DeleteButton
            size="sm"
            confirmMessage={`Delete "${u.title}"?`}
            action={() => deleteUpdate(u.id, campaignId)}
          />
        </div>
      </div>
      <p className="mt-3 whitespace-pre-line text-[0.92rem] leading-relaxed text-[var(--color-ink-soft)]">
        {u.body}
      </p>
      {u.images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {u.images.map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              className="relative aspect-square overflow-hidden rounded-md border border-[var(--color-hairline)] bg-[var(--color-ash)]"
            >
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

type Mode = { kind: "create" } | { kind: "edit"; id: string }

function UpdateForm({
  campaignId,
  mode,
  initial,
  onDone,
  onCancel,
}: {
  campaignId: string
  mode: Mode
  initial?: Update
  onDone: () => void
  onCancel: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<UpdateFormState | null>(null)

  const today = new Date().toISOString().slice(0, 10)
  const initialDate = initial ? initial.postedAt.slice(0, 10) : today

  const [title, setTitle] = useState(initial?.title ?? "")
  const [body, setBody] = useState(initial?.body ?? "")
  const [postedAt, setPostedAt] = useState(initialDate)
  const [images, setImages] = useState<GalleryImage[]>(initial?.images ?? [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result =
        mode.kind === "create"
          ? await createUpdate(state, formData)
          : await editUpdate(mode.id, state, formData)
      setState(result)
      if (result.ok) onDone()
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-md border-2 border-[var(--color-teal)] bg-white p-5 shadow-[0_4px_0_0_var(--color-teal)]"
    >
      <input type="hidden" name="campaignId" value={campaignId} />

      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[var(--color-coral)]">
          {mode.kind === "create" ? "— New update" : "— Edit update"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="grid h-6 w-6 place-items-center rounded-md text-[var(--color-ink-muted)] hover:bg-[var(--color-ash)]"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-8">
          <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Title
          </label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls(state?.fieldErrors?.title)}
            placeholder="Field hospital deployed in Rafah"
          />
          {state?.fieldErrors?.title && (
            <p className="mt-1 text-[0.78rem] text-[var(--color-coral-dark)]">
              {state.fieldErrors.title}
            </p>
          )}
        </div>
        <div className="sm:col-span-4">
          <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Posted on
          </label>
          <input
            name="postedAt"
            type="date"
            value={postedAt}
            onChange={(e) => setPostedAt(e.target.value)}
            className={inputCls(state?.fieldErrors?.postedAt)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          Body
        </label>
        <textarea
          name="body"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Three doctors landed at 06:00…"
          className={cn(inputCls(state?.fieldErrors?.body), "resize-y leading-relaxed")}
        />
        {state?.fieldErrors?.body && (
          <p className="mt-1 text-[0.78rem] text-[var(--color-coral-dark)]">
            {state.fieldErrors.body}
          </p>
        )}
        <p className="mt-1 text-[0.74rem] text-[var(--color-ink-muted)]">
          Plain text. Line breaks are preserved.
        </p>
      </div>

      <div className="mt-5">
        <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          Photos
        </label>
        <div className="mt-1.5">
          <UpdateImageGallery name="images" value={images} onChange={setImages} />
        </div>
      </div>

      {state && !state.ok && state.message && (
        <p className="mt-3 rounded-md border border-[var(--color-coral)]/40 bg-[var(--color-coral-pale)] px-3 py-2 text-[0.82rem] text-[var(--color-coral-dark)]">
          {state.message}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-teal)] px-4 py-2 text-[0.86rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)] disabled:opacity-60"
        >
          {isPending && <Loader2 size={12} className="animate-spin" />}
          {mode.kind === "create" ? "Post update" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-2 text-[0.82rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function inputCls(error?: string) {
  return cn(
    "mt-1.5 w-full rounded-md border bg-white px-3 py-2 text-[0.92rem] text-[var(--color-ink)] outline-none transition-colors",
    error
      ? "border-[var(--color-coral)] focus:border-[var(--color-coral-dark)]"
      : "border-[var(--color-hairline)] focus:border-[var(--color-teal)]"
  )
}
