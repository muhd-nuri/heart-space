"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Loader2, Trash2, Upload, AlertTriangle, ImageOff } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { cn } from "@/lib/utils"

type Endpoint = keyof OurFileRouter

type Props = {
  endpoint: Endpoint
  /** Form field name — a hidden input mirrors `value` so native form submit picks it up. */
  name: string
  value: string
  onChange: (url: string) => void
  helpText?: string
  /** Aspect ratio for the preview tile (e.g. "16/10", "16/9"). Defaults to 16/10. */
  aspect?: string
}

/**
 * Image upload field powered by UploadThing. Replaces the legacy text-path
 * input on admin forms — uploads return a URL stored as a string in the DB
 * (Campaign.image, NewsPost.coverImage), so no schema change.
 *
 * Behaviour:
 *   - Drag-and-drop OR click to pick.
 *   - Shows a thumbnail + Remove + Replace once a URL is set.
 *   - The Remove button only clears the form value — it does NOT delete the
 *     file from UploadThing storage. (Orphan-cleanup is a separate cron job.)
 */
export function ImageUpload({
  endpoint,
  name,
  value,
  onChange,
  helpText,
  aspect = "16/10",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.url
      if (url) onChange(url)
      setProgress(0)
      setError(null)
    },
    onUploadError: (err) => {
      setProgress(0)
      setError(err.message ?? "Upload failed.")
    },
  })

  function pickFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    const file = files[0]
    if (!file.type.startsWith("image/")) {
      setError("That doesn't look like an image.")
      return
    }
    startUpload([file])
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragOver(false)
    pickFiles(e.dataTransfer.files)
  }

  // Three states: empty → dropzone, legacy local path → placeholder, https URL → live preview.
  const isLegacyLocal = !!value && !/^https?:\/\//.test(value)

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={value} />

      {value && !isLegacyLocal ? (
        <div className="space-y-2">
          <div
            className="relative w-full overflow-hidden rounded-md border border-[var(--color-hairline)] bg-[var(--color-ash)]"
            style={{ aspectRatio: aspect }}
          >
            <Image
              src={value}
              alt="Cover preview"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
              onError={() =>
                setError("Couldn't load the image at this URL.")
              }
            />
            {isUploading && (
              <div className="absolute inset-0 grid place-items-center bg-black/50 text-white">
                <div className="flex items-center gap-2 text-[0.86rem]">
                  <Loader2 size={14} className="animate-spin" />
                  Uploading {progress}%
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)] disabled:opacity-60"
            >
              <Upload size={12} />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-coral)]/60 hover:text-[var(--color-coral-dark)] disabled:opacity-60"
            >
              <Trash2 size={12} />
              Remove
            </button>
            <code className="ml-1 truncate rounded bg-[var(--color-ash)] px-1.5 py-0.5 font-mono text-[0.72rem] text-[var(--color-ink-muted)]">
              {prettyUrl(value)}
            </code>
          </div>
        </div>
      ) : isLegacyLocal ? (
        <div className="space-y-2">
          <div
            className="relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--color-hairline)] bg-[var(--color-ash)] p-6 text-center"
            style={{ aspectRatio: aspect }}
          >
            <ImageOff size={20} strokeWidth={1.6} className="text-[var(--color-ink-muted)]" />
            <p className="font-display text-[0.92rem] font-bold text-[var(--color-ink)]">
              Local placeholder
            </p>
            <code className="rounded bg-white px-2 py-0.5 font-mono text-[0.72rem] text-[var(--color-ink-muted)]">
              {value}
            </code>
            <p className="max-w-xs text-[0.78rem] text-[var(--color-ink-muted)]">
              The site renders a gradient fallback for this. Upload a real
              image to replace — or leave as is.
            </p>
            {isUploading && (
              <div className="absolute inset-0 grid place-items-center bg-black/40 text-white">
                <div className="flex items-center gap-2 text-[0.86rem]">
                  <Loader2 size={14} className="animate-spin" />
                  Uploading {progress}%
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)] disabled:opacity-60"
            >
              <Upload size={12} />
              Upload to replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-coral)]/60 hover:text-[var(--color-coral-dark)] disabled:opacity-60"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`upload-${name}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed bg-white p-8 text-center transition-colors",
            dragOver
              ? "border-[var(--color-teal)] bg-[var(--color-teal-pale)]/30"
              : "border-[var(--color-hairline)] hover:border-[var(--color-teal)]/60 hover:bg-[var(--color-ash)]/40",
            isUploading && "pointer-events-none opacity-70"
          )}
          style={{ aspectRatio: aspect }}
        >
          {isUploading ? (
            <>
              <Loader2 size={20} className="animate-spin text-[var(--color-teal)]" />
              <p className="text-[0.92rem] font-medium text-[var(--color-ink)]">
                Uploading {progress}%
              </p>
            </>
          ) : (
            <>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]">
                <Upload size={18} strokeWidth={1.8} />
              </span>
              <p className="font-display text-[0.95rem] font-bold text-[var(--color-ink)]">
                Click or drop an image
              </p>
              <p className="text-[0.78rem] text-[var(--color-ink-muted)]">
                JPG, PNG, WEBP — up to 4&nbsp;MB
              </p>
            </>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        id={`upload-${name}`}
        type="file"
        accept="image/*"
        onChange={(e) => pickFiles(e.target.files)}
        className="sr-only"
      />

      {error && (
        <p className="inline-flex items-center gap-1.5 text-[0.82rem] text-[var(--color-coral-dark)]">
          <AlertTriangle size={12} />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-[0.78rem] text-[var(--color-ink-muted)]">{helpText}</p>
      )}
    </div>
  )
}

function prettyUrl(url: string) {
  try {
    const u = new URL(url)
    const last = u.pathname.split("/").filter(Boolean).pop() ?? u.hostname
    return last.length > 30 ? last.slice(0, 14) + "…" + last.slice(-12) : last
  } catch {
    return url
  }
}
