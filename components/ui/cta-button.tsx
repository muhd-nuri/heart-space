"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "contribute" | "secondary" | "ghost" | "white"
type Size = "sm" | "md" | "lg"

type Common = {
  variant?: Variant
  size?: Size
  /** Append a sliding arrow at the end of the label. */
  arrow?: boolean
  className?: string
  children: React.ReactNode
}

type AsLink = Common & { href: string; onClick?: never; type?: never; disabled?: never }
type AsButton = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined
  }

// Pill + hard offset shadow gives the button weight (poster/festival-pass
// energy) without a soft glow. Hover lifts and the shadow grows; active
// presses the button flat into the shadow — a tactile "stamp" feel.
//
// `[&>svg:last-child]` slides any trailing icon on hover, which covers both
// the `arrow` prop AND existing usages that pass an <ArrowRight /> inline.
const base =
  "group/cta relative inline-flex items-center justify-center gap-2 font-display font-bold rounded-full select-none whitespace-nowrap will-change-transform transition-all duration-200 ease-out " +
  "[&>svg:last-child]:transition-transform [&>svg:last-child]:duration-200 [&>svg:last-child]:ease-out hover:[&>svg:last-child]:translate-x-0.5 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-[0.82rem] tracking-[-0.005em]",
  md: "h-11 px-6 text-[0.92rem] tracking-[-0.005em]",
  lg: "h-[3.25rem] px-8 text-[1rem] tracking-[-0.005em]",
}

// Each "lift" variant defines four states via a hard offset shadow.
// rest:    shadow 4px below      / no translate
// hover:   shadow 6px + lift 2px  → opens a 4px gap between button and shadow
// active:  shadow 0px + sink 4px  → button "lands" flush with shadow base
const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-teal)] text-white " +
    "shadow-[0_4px_0_0_var(--color-teal-dark)] " +
    "hover:bg-[var(--color-teal-dark)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#0d6164] " +
    "active:translate-y-1 active:shadow-[0_0_0_0_var(--color-teal-dark)] " +
    "focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-white",
  contribute:
    "bg-[var(--color-coral)] text-white " +
    "shadow-[0_4px_0_0_var(--color-coral-dark)] " +
    "hover:bg-[var(--color-coral-dark)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#a8443c] " +
    "active:translate-y-1 active:shadow-[0_0_0_0_var(--color-coral-dark)] " +
    "focus-visible:ring-[var(--color-coral)] focus-visible:ring-offset-white",
  secondary:
    "bg-white text-[var(--color-teal-dark)] border-2 border-[var(--color-teal)] " +
    "shadow-[0_4px_0_0_var(--color-teal)] " +
    "hover:bg-[var(--color-teal-pale)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-teal-dark)] " +
    "active:translate-y-1 active:shadow-[0_0_0_0_var(--color-teal)] " +
    "focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-white",
  ghost:
    "bg-transparent text-[var(--color-teal-dark)] " +
    "hover:bg-[var(--color-teal-pale)] " +
    "active:bg-[var(--color-teal-pale)]/70 " +
    "focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-white",
  white:
    "bg-white text-[var(--color-charcoal)] " +
    "shadow-[0_4px_0_0_rgba(28,43,43,0.22)] " +
    "hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_rgba(28,43,43,0.28)] " +
    "active:translate-y-1 active:shadow-[0_0_0_0_rgba(28,43,43,0.22)] " +
    "focus-visible:ring-white focus-visible:ring-offset-[var(--color-coral)]",
}

const ARROW_SIZE: Record<Size, number> = { sm: 14, md: 16, lg: 18 }

export function CTAButton(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", arrow = false, className, children } = props
  const classes = cn(base, sizes[size], variants[variant], className)

  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={ARROW_SIZE[size]} strokeWidth={2.4} aria-hidden />}
    </>
  )

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    )
  }
  const {
    variant: _v,
    size: _s,
    arrow: _a,
    className: _c,
    children: _ch,
    href: _h,
    ...rest
  } = props as AsButton & { href?: undefined }
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  )
}
