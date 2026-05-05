import * as React from "react"
import { cn } from "@/lib/utils"

type Tone = "default" | "dark" | "teal" | "coral" | "ash" | "white"

const tones: Record<Tone, string> = {
  default: "bg-[var(--color-off-white)] text-[var(--color-ink-soft)]",
  dark: "bg-[var(--color-charcoal)] text-white",
  teal: "bg-[var(--color-teal)] text-white",
  coral: "bg-[var(--color-coral)] text-white",
  ash: "bg-[var(--color-ash)] text-[var(--color-ink-soft)]",
  white: "bg-white text-[var(--color-ink-soft)]",
}

type Props = {
  tone?: Tone
  spacing?: "default" | "tight" | "hero"
  bleed?: boolean
  className?: string
  innerClassName?: string
  children: React.ReactNode
  id?: string
}

export function SectionWrapper({
  tone = "default",
  spacing = "default",
  bleed = false,
  className,
  innerClassName,
  children,
  id,
}: Props) {
  const pad =
    spacing === "hero"
      ? "py-28 md:py-40"
      : spacing === "tight"
        ? "py-14 md:py-20"
        : "py-20 md:py-28"

  return (
    <section id={id} className={cn(tones[tone], pad, className)}>
      <div
        className={cn(
          bleed ? "" : "mx-auto max-w-6xl px-6 md:px-8",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}

export function SectionLabel({
  children,
  tone = "teal",
}: {
  children: React.ReactNode
  tone?: "teal" | "coral" | "white"
}) {
  const color =
    tone === "teal"
      ? "text-[var(--color-teal)]"
      : tone === "coral"
        ? "text-[var(--color-coral)]"
        : "text-white/80"
  return (
    <span className={cn("text-label accent-line font-display", color)}>
      {children}
    </span>
  )
}
