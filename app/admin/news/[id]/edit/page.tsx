import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { NewsForm } from "@/components/admin/news-form"
import { DeleteButton } from "@/components/admin/delete-button"
import { prisma } from "@/lib/prisma"
import { deleteNews } from "../../actions"

type Props = { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const post = await prisma.newsPost.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <>
      <AdminPageHeader
        title={post.title}
        subtitle={
          post.published
            ? `Published ${post.publishedAt?.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}`
            : "Draft"
        }
        actions={
          <>
            {post.published && (
              <Link
                href={`/news/${post.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
              >
                <ExternalLink size={14} />
                View on site
              </Link>
            )}
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              <ChevronLeft size={14} />
              Back to list
            </Link>
          </>
        }
      />
      <div className="max-w-3xl p-6 md:p-8">
        <div className="rounded-md border border-[var(--color-hairline)] bg-white p-6 md:p-8">
          <NewsForm
            mode={{
              kind: "edit",
              id: post.id,
              publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
            }}
            initial={{
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              coverImage: post.coverImage,
              category: post.category as "news" | "mission" | "impact" | "press",
              author: post.author,
              published: post.published,
            }}
          />
        </div>

        <div className="mt-6 rounded-md border border-[var(--color-coral)]/30 bg-[var(--color-coral-pale)]/40 p-5">
          <h3 className="font-display text-[0.95rem] font-bold text-[var(--color-coral-dark)]">
            Danger zone
          </h3>
          <p className="mt-1 text-[0.86rem] text-[var(--color-ink-muted)]">
            Deleting a post is permanent. Public links to its slug will 404.
          </p>
          <div className="mt-4">
            <DeleteButton
              label="Delete post"
              confirmMessage={`Delete "${post.title}"?`}
              action={async () => {
                "use server"
                await deleteNews(post.id)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
