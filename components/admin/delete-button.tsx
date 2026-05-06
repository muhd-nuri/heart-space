"use client"

import { useState, useTransition } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  action: () => Promise<unknown>
  label?: string
  confirmMessage: string
  className?: string
  size?: "sm" | "md"
}

/**
 * Generic delete button with two-step confirmation. The first click flips
 * to a "Confirm?" red state; second click runs the action.
 */
export function DeleteButton({
  action,
  label = "Delete",
  confirmMessage,
  className,
  size = "md",
}: Props) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function onClick() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 4000)
      return
    }
    startTransition(async () => {
      await action()
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={confirming ? confirmMessage : label}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors",
        size === "sm" ? "px-2.5 py-1.5 text-[0.78rem]" : "px-3.5 py-2 text-[0.85rem]",
        confirming
          ? "border-[var(--color-coral)] bg-[var(--color-coral)] text-white hover:bg-[var(--color-coral-dark)]"
          : "border-[var(--color-hairline)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-coral)]/60 hover:text-[var(--color-coral-dark)]",
        "disabled:opacity-60",
        className
      )}
    >
      {isPending ? (
        <Loader2 size={size === "sm" ? 12 : 14} className="animate-spin" />
      ) : (
        <Trash2 size={size === "sm" ? 12 : 14} />
      )}
      {confirming ? "Confirm?" : label}
    </button>
  )
}
