"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

const GRADIENTS: Record<string, string> = {
  healthcare: "from-[#1AACB0] via-[#4DC4C7] to-[#0E5E60]",
  disaster: "from-[#F07B72] via-[#F5A39C] to-[#A93D33]",
  waqf: "from-[#8B5CF6] via-[#A78BFA] to-[#4C1D95]",
  zakat: "from-[#10B981] via-[#34D399] to-[#065F46]",
  general: "from-[#1AACB0] via-[#4DC4C7] to-[#1C2B2B]",
  news: "from-[#1AACB0] via-[#4DC4C7] to-[#0E5E60]",
  mission: "from-[#F07B72] via-[#F5A39C] to-[#A93D33]",
  impact: "from-[#10B981] via-[#34D399] to-[#065F46]",
  press: "from-[#374040] via-[#6B7F7F] to-[#1C2B2B]",
}

type Props = {
  src: string
  alt: string
  category?: string
  className?: string
}

/**
 * Renders the campaign image when available; falls back to a tasteful
 * gradient + grain placeholder per category. The fallback is the design
 * — not a "broken image" experience — so the homepage looks intentional
 * before client photography arrives.
 */
export function CampaignImage({ src, alt, category = "general", className }: Props) {
  const [errored, setErrored] = useState(false)
  const gradient = GRADIENTS[category] ?? GRADIENTS.general

  if (!errored && src && !src.startsWith("/images/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        onError={() => setErrored(true)}
        className={cn("object-cover", className)}
      />
    )
  }

  return (
    <div className={cn("absolute inset-0", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
      <div className="absolute inset-0 bg-grain opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      <div className="relative z-10 flex h-full items-end p-6">
        <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/85">
          {alt}
        </span>
      </div>
    </div>
  )
}
