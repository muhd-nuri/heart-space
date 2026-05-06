import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import { CampaignImage } from "@/components/ui/campaign-image"
import { CategoryBadge } from "@/components/ui/category-badge"
import { NewsCard } from "@/components/ui/news-card"
import { CTAButton } from "@/components/ui/cta-button"
import { SectionLabel } from "@/components/ui/section-wrapper"
import { getNewsPost, getRelatedNews } from "@/lib/data"
import { articleLD, ldScriptProps } from "@/lib/json-ld"

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getNewsPost(slug)
  if (!post) return { title: "Story not found" }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getNewsPost(slug)
  if (!post) notFound()

  const related = await getRelatedNews(slug, 3)
  const readingMinutes = estimateReadingMinutes(post.content)

  const ld = articleLD({
    title: post.title,
    slug: post.slug,
    description: post.excerpt,
    image: post.coverImage,
    publishedAt: post.publishedAt,
    author: post.author,
    category: post.category,
  })

  return (
    <>
      <script {...ldScriptProps(ld)} />
      {/* Article hero — image bleed + meta over dark gradient */}
      <section className="relative isolate -mt-[60px] overflow-hidden md:-mt-[72px]">
        <div className="absolute inset-0 -z-10">
          <CampaignImage
            src={post.coverImage}
            alt={post.title}
            category={post.category}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />
        </div>

        <div className="mx-auto flex min-h-[64svh] max-w-3xl flex-col justify-end px-6 pb-14 pt-[calc(60px+5rem)] md:px-8 md:pb-20 md:pt-[calc(72px+6rem)]">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 self-start text-[0.78rem] font-medium uppercase tracking-[0.12em] text-white/75 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            All stories
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CategoryBadge category={post.category} />
            {post.publishedAt && (
              <span className="text-[0.82rem] font-medium uppercase tracking-[0.12em] text-white/75">
                {post.publishedAt.toLocaleDateString("en-MY", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[0.82rem] text-white/65">
              <Clock size={13} strokeWidth={1.8} />
              {readingMinutes} min read
            </span>
          </div>

          <h1 className="mt-6 font-display text-[2.25rem] font-extrabold leading-[1.06] tracking-[-0.022em] text-white sm:text-[3rem] md:text-[3.75rem]">
            {post.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/85">
            {post.excerpt}
          </p>
          <p className="mt-5 text-[0.82rem] font-medium uppercase tracking-[0.14em] text-white/60">
            By {post.author}
          </p>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-[var(--color-off-white)] py-16 md:py-20">
        <article
          className="tiptap-content mx-auto max-w-2xl px-6 md:px-8"
          // The content originates from the admin TipTap editor — a trusted
          // source. If the admin tier ever opens up, sanitize first.
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* End-of-article CTA */}
        <div className="mx-auto mt-14 max-w-2xl border-t border-[var(--color-hairline)] px-6 pt-10 md:px-8">
          <p className="font-display text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[var(--color-coral)]">
            Want to help next month&apos;s story land?
          </p>
          <h3 className="mt-3 font-display text-[1.5rem] font-bold leading-tight text-[var(--color-ink)] md:text-[1.85rem]">
            Contribute or volunteer.
          </h3>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <CTAButton href="/contribute" variant="contribute" arrow>
              Contribute Now
            </CTAButton>
            <CTAButton href="/volunteer" variant="secondary">
              Join the movement
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[var(--color-hairline)] bg-[var(--color-ash)] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <SectionLabel tone="teal">More from the field</SectionLabel>
                <h2 className="text-display-sm mt-4 font-display font-bold text-[var(--color-ink)] md:text-display-md">
                  Recent stories
                </h2>
              </div>
              <Link
                href="/news"
                className="text-[0.86rem] font-medium text-[var(--color-teal-dark)] hover:text-[var(--color-teal)]"
              >
                View all →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((p, i) => (
                <NewsCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

/**
 * Rough reading time. Strips HTML tags and assumes 220 wpm. Cheap to run
 * server-side and avoids reaching for an extra dep.
 */
function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  const words = text.split(" ").filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
