import type { Metadata } from "next"
import { NewsCard } from "@/components/ui/news-card"
import { NewsCategoryFilter } from "@/components/sections/news/news-category-filter"
import { SectionLabel } from "@/components/ui/section-wrapper"
import { getAllNews } from "@/lib/data"

export const revalidate = 300

export const metadata: Metadata = {
  title: "News & Impact",
  description:
    "Stories from the field, mission updates, impact reports, and press from HeartSpace.",
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function NewsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const posts = await getAllNews({ category })

  return (
    <>
      <header className="border-b border-[var(--color-hairline)] bg-[var(--color-ash)]">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
          <SectionLabel tone="teal">News &amp; Impact</SectionLabel>
          <h1 className="text-display-md mt-4 max-w-3xl font-display font-extrabold leading-[1.05] tracking-[-0.022em] text-[var(--color-ink)] md:text-display-lg">
            Stories from the field.
          </h1>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-[var(--color-ink-muted)] md:text-[1.12rem]">
            Mission updates, impact reports, and press. The work, in plain
            English, monthly.
          </p>

          <div className="mt-9">
            <NewsCategoryFilter active={category ?? ""} />
          </div>
        </div>
      </header>

      <section className="bg-[var(--color-off-white)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-md rounded-[var(--radius-card)] border border-dashed border-[var(--color-hairline)] bg-white p-10 text-center">
              <p className="font-display text-[1.2rem] font-bold text-[var(--color-ink)]">
                Nothing in this category yet.
              </p>
              <p className="mt-3 text-[0.92rem] text-[var(--color-ink-muted)]">
                Check back soon — or browse all posts.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-8 text-[0.82rem] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                {posts.length}{" "}
                {posts.length === 1 ? "story" : "stories"}
                {category ? ` · ${formatCategory(category)}` : ""}
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p, i) => (
                  <NewsCard key={p.slug} post={p} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

function formatCategory(c: string) {
  return c.charAt(0).toUpperCase() + c.slice(1)
}
