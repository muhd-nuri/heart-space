"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { CTAButton } from "@/components/ui/cta-button"
import { CategoryBadge } from "@/components/ui/category-badge"
import { ProgressBar } from "@/components/ui/progress-bar"
import { CampaignImage } from "@/components/ui/campaign-image"

export type CampaignCardData = {
  title: string
  slug: string
  description: string
  image: string
  category: string
  raised: number
  target: number
}

export function CampaignCard({ campaign, index = 0 }: { campaign: CampaignCardData; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    >
      <Link href={`/campaigns/${campaign.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <CampaignImage
          src={campaign.image}
          alt={campaign.title}
          category={campaign.category}
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <CategoryBadge category={campaign.category} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <Link href={`/campaigns/${campaign.slug}`}>
            <h3 className="text-display-sm font-display font-bold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-dark)]">
              {campaign.title}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-[0.92rem] leading-relaxed text-[var(--color-ink-muted)]">
            {campaign.description}
          </p>
        </div>

        <ProgressBar raised={campaign.raised} target={campaign.target} showLabels />

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <CTAButton href={`/campaigns/${campaign.slug}`} variant="contribute" size="sm">
            Contribute to this Campaign
          </CTAButton>
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="hidden items-center gap-1 text-[0.85rem] font-medium text-[var(--color-teal-dark)] transition-colors hover:text-[var(--color-teal)] sm:inline-flex"
          >
            Learn more <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
