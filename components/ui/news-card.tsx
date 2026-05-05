"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { CategoryBadge } from "@/components/ui/category-badge"
import { CampaignImage } from "@/components/ui/campaign-image"

export type NewsCardData = {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  category: string
  publishedAt: Date | string | null
  author: string
}

function formatDate(d: Date | string | null) {
  if (!d) return ""
  const dt = typeof d === "string" ? new Date(d) : d
  return dt.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function NewsCard({ post, index = 0 }: { post: NewsCardData; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    >
      <Link href={`/news/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <CampaignImage
          src={post.coverImage}
          alt={post.title}
          category={post.category}
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <CategoryBadge category={post.category} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-[0.78rem] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
          {formatDate(post.publishedAt)}
          <span className="mx-2 text-[var(--color-stone)]">·</span>
          {post.author}
        </p>
        <Link href={`/news/${post.slug}`}>
          <h3 className="font-display text-[1.2rem] font-bold leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-teal-dark)]">
            {post.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-[0.93rem] leading-relaxed text-[var(--color-ink-muted)]">
          {post.excerpt}
        </p>
        <Link
          href={`/news/${post.slug}`}
          className="mt-auto inline-flex items-center gap-1 text-[0.86rem] font-medium text-[var(--color-teal-dark)] transition-colors hover:text-[var(--color-teal)]"
        >
          Read more <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  )
}
