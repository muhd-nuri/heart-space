"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"

export type GalleryImage = { url: string; alt?: string }

type Props = {
  /** Hidden input name — value is JSON.stringify(images). */
  name: string
  value: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}

export function UpdateImageGallery({ name, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const { startUpload, isUploading } = useUploadThing("updateImage", {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      const newImages: GalleryImage[] =
        res?.map((r) => ({
          url: r.serverData?.url ?? r.ufsUrl ?? r.url,
          alt: "",
        })) ?? []
      if (newImages.length) onChange([...value, ...newImages])
      setProgress(0)
      setError(null)
    },
    onUploadError: (err) => {
      setProgress(0)
      setError(err.message ?? "Upload failed.")
    },
  })

  function pick(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (valid.length === 0) {
      setError("None of those looked like images.")
      return
    }
    startUpload(valid)
  }

  function setAlt(idx: number, alt: string) {
    const next = value.slice()
    next[idx] = { ...next[idx], alt }
    onChange(next)
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir
    if (target < 0 || target >= value.length) return
    const next = value.slice()
    const tmp = next[idx]
    next[idx] = next[target]
    next[target] = tmp
    onChange(next)
  }

  function remove(idx: number) {
    onChange(value.slice(0, idx).concat(value.slice(idx + 1)))
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(value)} />

      {value.length === 0 ? (
        <DropZone
          dragOver={dragOver}
          isUploading={isUploading}
          progress={progress}
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            pick(e.dataTransfer.files)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          empty
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {value.map((img, i) => (
              <div
                key={`${img.url}-${i}`}
                className="overflow-hidden rounded-md border border-[var(--color-hairline)] bg-white"
              >
                <div className="relative aspect-square bg-[var(--color-ash)]">
                  <Image
                    src={img.url}
                    alt={img.alt ?? ""}
                    fill
                    sizes="(min-width: 640px) 200px, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute right-1.5 top-1.5 flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className={iconBtnCls()}
                    >
                      <ArrowUp size={11} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === value.length - 1}
                      aria-label="Move down"
                      className={iconBtnCls()}
                    >
                      <ArrowDown size={11} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      aria-label="Remove image"
                      className={iconBtnCls("danger")}
                    >
                      <Trash2 size={11} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={img.alt ?? ""}
                    onChange={(e) => setAlt(i, e.target.value)}
                    className="w-full bg-transparent px-1 py-1 text-[0.78rem] text-[var(--color-ink-soft)] placeholder:text-[var(--color-ink-muted)]/70 focus:outline-none"
                  />
                </div>
              </div>
            ))}

            <DropZone
              dragOver={dragOver}
              isUploading={isUploading}
              progress={progress}
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                pick(e.dataTransfer.files)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
            />
          </div>
          <p className="text-[0.74rem] text-[var(--color-ink-muted)]">
            {value.length} {value.length === 1 ? "image" : "images"} · arrows to reorder · captions optional
          </p>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => pick(e.target.files)}
        className="sr-only"
      />

      {error && (
        <p className="inline-flex items-center gap-1.5 text-[0.82rem] text-[var(--color-coral-dark)]">
          <AlertTriangle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

function DropZone({
  dragOver,
  isUploading,
  progress,
  onClick,
  onDrop,
  onDragOver,
  onDragLeave,
  empty,
}: {
  dragOver: boolean
  isUploading: boolean
  progress: number
  onClick: () => void
  onDrop: (e: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (e: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: () => void
  empty?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      disabled={isUploading}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed bg-white p-4 text-center transition-colors",
        empty ? "aspect-[3/2] w-full" : "aspect-square",
        dragOver
          ? "border-[var(--color-teal)] bg-[var(--color-teal-pale)]/30"
          : "border-[var(--color-hairline)] hover:border-[var(--color-teal)]/60 hover:bg-[var(--color-ash)]/40",
        isUploading && "pointer-events-none opacity-70"
      )}
    >
      {isUploading ? (
        <>
          <Loader2 size={16} className="animate-spin text-[var(--color-teal)]" />
          <span className="text-[0.78rem] font-medium text-[var(--color-ink)]">
            {progress}%
          </span>
        </>
      ) : (
        <>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]">
            <ImagePlus size={16} strokeWidth={1.8} />
          </span>
          <span className="font-display text-[0.82rem] font-bold text-[var(--color-ink)]">
            {empty ? "Add photos" : "Add more"}
          </span>
          {empty && (
            <span className="text-[0.74rem] text-[var(--color-ink-muted)]">
              Click or drop · multiple OK · 4 MB each
            </span>
          )}
        </>
      )}
    </button>
  )
}

function iconBtnCls(tone?: "danger") {
  return cn(
    "grid h-6 w-6 place-items-center rounded-md border border-white/40 bg-white/90 text-[var(--color-ink-muted)] backdrop-blur transition-colors",
    "hover:bg-white",
    tone === "danger"
      ? "hover:border-[var(--color-coral)] hover:text-[var(--color-coral-dark)]"
      : "hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/90 disabled:hover:text-[var(--color-ink-muted)]"
  )
}
