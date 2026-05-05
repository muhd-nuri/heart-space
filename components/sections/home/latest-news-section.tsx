import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { NewsCard, type NewsCardData } from "@/components/ui/news-card"
import { SectionLabel, SectionWrapper } from "@/components/ui/section-wrapper"

export function LatestNewsSection({ posts }: { posts: NewsCardData[] }) {
  return (
    <SectionWrapper tone="ash">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-12">
        <div className="max-w-2xl">
          <SectionLabel tone="teal">Latest from the Field</SectionLabel>
          <h2 className="text-display-md mt-4 font-display font-extrabold text-[var(--color-ink)] md:text-display-lg">
            News & Impact
          </h2>
        </div>

        <Link
          href="/news"
          className="group inline-flex items-center gap-1.5 rounded-md border border-[var(--color-hairline)] bg-white px-4 py-2.5 text-[0.86rem] font-medium text-[var(--color-teal-dark)] transition-all hover:border-[var(--color-teal)] hover:bg-[var(--color-teal-pale)]"
        >
          View all
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((p, i) => (
          <NewsCard key={p.slug} post={p} index={i} />
        ))}
      </div>
    </SectionWrapper>
  )
}
