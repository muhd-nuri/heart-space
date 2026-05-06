import Link from "next/link"
import { Plus, ExternalLink, Pencil } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { DeleteButton } from "@/components/admin/delete-button"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { deleteNews, toggleNewsPublished } from "./actions"

export const dynamic = "force-dynamic"

const TABS = [
  { id: "", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
] as const

type Props = { searchParams: Promise<{ status?: string }> }

export default async function AdminNewsPage({ searchParams }: Props) {
  const { status } = await searchParams

  const where =
    status === "published"
      ? { published: true }
      : status === "draft"
        ? { published: false }
        : {}

  const posts = await prisma.newsPost.findMany({
    where,
    orderBy: [{ published: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  })

  const counts = await prisma.newsPost.groupBy({
    by: ["published"],
    _count: { _all: true },
  })
  const publishedCount = counts.find((c) => c.published)?._count._all ?? 0
  const draftCount = counts.find((c) => !c.published)?._count._all ?? 0
  const total = publishedCount + draftCount
  const countMap = { published: publishedCount, draft: draftCount }

  return (
    <>
      <AdminPageHeader
        title="News"
        subtitle={`${total} total · ${publishedCount} published · ${draftCount} draft`}
        actions={
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-teal)] px-3.5 py-2 text-[0.86rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
          >
            <Plus size={14} strokeWidth={2.4} />
            New post
          </Link>
        }
      />

      <div className="space-y-6 p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = (status ?? "") === t.id
            const c = t.id ? countMap[t.id as "published" | "draft"] : total
            const href = t.id ? `/admin/news?status=${t.id}` : "/admin/news"
            return (
              <Link
                key={t.id || "all"}
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[0.82rem] font-medium transition-colors",
                  active
                    ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white"
                    : "border-[var(--color-hairline)] bg-white text-[var(--color-ink)] hover:border-[var(--color-teal)]"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[0.7rem] font-bold",
                    active ? "bg-white/20 text-white" : "bg-[var(--color-ash)] text-[var(--color-ink-muted)]"
                  )}
                >
                  {c}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-md border border-[var(--color-hairline)] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-[0.88rem]">
              <thead>
                <tr>
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th>Status</Th>
                  <Th>Published</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[var(--color-ink-muted)]">
                      No posts yet.{" "}
                      <Link href="/admin/news/new" className="text-[var(--color-teal-dark)] underline">
                        Write the first one.
                      </Link>
                    </td>
                  </tr>
                )}
                {posts.map((p) => (
                  <tr key={p.id} className="border-t border-[var(--color-hairline)]">
                    <Td>
                      <Link
                        href={`/admin/news/${p.id}/edit`}
                        className="font-display font-bold text-[var(--color-ink)] hover:text-[var(--color-teal-dark)]"
                      >
                        {p.title}
                      </Link>
                      <div className="mt-0.5 truncate text-[0.78rem] text-[var(--color-ink-muted)]">
                        by {p.author}
                      </div>
                    </Td>
                    <Td>
                      <span className="inline-flex rounded-full bg-[var(--color-ash)] px-2 py-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
                        {p.category}
                      </span>
                    </Td>
                    <Td>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em]",
                          p.published
                            ? "bg-[#DCFCE7] text-[#15803D]"
                            : "bg-[var(--color-ash)] text-[var(--color-ink-soft)]"
                        )}
                      >
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[var(--color-ink-muted)]">
                        {p.publishedAt
                          ? p.publishedAt.toLocaleDateString("en-MY", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </Td>
                    <Td align="right">
                      <div className="flex justify-end gap-2">
                        <form action={async () => { "use server"; await toggleNewsPublished(p.id) }}>
                          <button
                            type="submit"
                            className="rounded-md border border-[var(--color-hairline)] bg-white px-2.5 py-1.5 text-[0.78rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
                            title={p.published ? "Move to draft" : "Publish"}
                          >
                            {p.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <Link
                          href={`/admin/news/${p.id}/edit`}
                          aria-label={`Edit ${p.title}`}
                          className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-hairline)] bg-white text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
                        >
                          <Pencil size={12} />
                        </Link>
                        {p.published && (
                          <Link
                            href={`/news/${p.slug}`}
                            target="_blank"
                            aria-label={`View ${p.title} on the site`}
                            className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-hairline)] bg-white text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-dark)]"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        )}
                        <DeleteButton
                          size="sm"
                          confirmMessage={`Delete "${p.title}"?`}
                          action={async () => {
                            "use server"
                            await deleteNews(p.id)
                          }}
                        />
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
        align === "right" ? "text-right" : "text-left"
      )}
    >
      {children}
    </th>
  )
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return <td className={cn("px-5 py-3 align-top", align === "right" ? "text-right" : "")}>{children}</td>
}
