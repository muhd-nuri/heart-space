"use client"

import { useEffect, useState, useTransition } from "react"
import * as Icons from "lucide-react"
import { Check, Loader2, Trash2 } from "lucide-react"
import { deleteStat, updateStat, type StatFormState } from "@/app/admin/stats/actions"
import { cn } from "@/lib/utils"

type Stat = {
  id: string
  label: string
  value: string
  icon: string
  order: number
}

export function StatRow({ stat }: { stat: Stat }) {
  const [isSaving, startSave] = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [state, setState] = useState<StatFormState | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)

  const [label, setLabel] = useState(stat.label)
  const [value, setValue] = useState(stat.value)
  const [icon, setIcon] = useState(stat.icon)
  const [order, setOrder] = useState(String(stat.order))

  // Clear "saved" badge after a moment.
  useEffect(() => {
    if (!savedFlash) return
    const t = setTimeout(() => setSavedFlash(false), 1800)
    return () => clearTimeout(t)
  }, [savedFlash])

  // Auto-cancel the delete confirmation if the admin walks away.
  useEffect(() => {
    if (!confirmingDelete) return
    const t = setTimeout(() => setConfirmingDelete(false), 4000)
    return () => clearTimeout(t)
  }, [confirmingDelete])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startSave(async () => {
      const result = await updateStat(stat.id, state, formData)
      setState(result)
      if (result.ok) setSavedFlash(true)
    })
  }

  function onDelete() {
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    startDelete(async () => {
      await deleteStat(stat.id)
    })
  }

  const IconCmp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[icon]
  const iconValid = !!IconCmp && icon.length > 0

  return (
    <form
      onSubmit={onSubmit}
      className="grid items-end gap-3 rounded-md border border-[var(--color-hairline)] bg-white p-4 sm:grid-cols-12 sm:gap-4 sm:p-5"
    >
      {/* Order */}
      <Field label="Order" className="sm:col-span-1">
        <input
          name="order"
          type="number"
          min={0}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className={inputCls(state?.fieldErrors?.order)}
        />
      </Field>

      {/* Icon (with live preview) */}
      <Field label="Icon" hint="Lucide name" className="sm:col-span-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-md",
              iconValid
                ? "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]"
                : "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)]"
            )}
          >
            {iconValid ? (
              <IconCmp size={16} strokeWidth={1.8} />
            ) : (
              <span className="text-[0.65rem] font-bold">?</span>
            )}
          </span>
          <input
            name="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Heart"
            className={cn(inputCls(state?.fieldErrors?.icon), "font-mono text-[0.85rem]")}
          />
        </div>
      </Field>

      {/* Value */}
      <Field label="Value" hint="e.g. 100,000+ or 8" className="sm:col-span-2">
        <input
          name="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputCls(state?.fieldErrors?.value)}
        />
      </Field>

      {/* Label */}
      <Field label="Label" className="sm:col-span-4">
        <input
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className={inputCls(state?.fieldErrors?.label)}
        />
      </Field>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[0.82rem] font-semibold transition-colors",
            savedFlash
              ? "bg-[#DCFCE7] text-[#15803D]"
              : "bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)]"
          )}
        >
          {isSaving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : savedFlash ? (
            <Check size={12} strokeWidth={3} />
          ) : null}
          {savedFlash ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label={confirmingDelete ? "Confirm delete" : "Delete stat"}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2.5 py-2 text-[0.78rem] font-medium transition-colors disabled:opacity-60",
            confirmingDelete
              ? "border-[var(--color-coral)] bg-[var(--color-coral)] text-white hover:bg-[var(--color-coral-dark)]"
              : "border-[var(--color-hairline)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-coral)]/60 hover:text-[var(--color-coral-dark)]"
          )}
        >
          {isDeleting ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Trash2 size={12} />
          )}
          {confirmingDelete ? "Confirm?" : null}
        </button>
      </div>

      {state && !state.ok && state.message && (
        <p className="rounded-md border border-[var(--color-coral)]/40 bg-[var(--color-coral-pale)] px-3 py-2 text-[0.8rem] text-[var(--color-coral-dark)] sm:col-span-12">
          {state.message}
          {state.fieldErrors &&
            Object.values(state.fieldErrors).map((m) => (
              <span key={m} className="ml-1.5">
                · {m}
              </span>
            ))}
        </p>
      )}
    </form>
  )
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        {label}
      </label>
      {children}
      {hint && <p className="text-[0.7rem] text-[var(--color-ink-muted)]/80">{hint}</p>}
    </div>
  )
}

function inputCls(error?: string) {
  return cn(
    "w-full rounded-md border bg-white px-3 py-2 text-[0.9rem] text-[var(--color-ink)] outline-none transition-colors",
    error
      ? "border-[var(--color-coral)] focus:border-[var(--color-coral-dark)]"
      : "border-[var(--color-hairline)] focus:border-[var(--color-teal)]"
  )
}
