import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { NewsForm } from "@/components/admin/news-form"

export default function NewPostPage() {
  return (
    <>
      <AdminPageHeader
        title="New post"
        subtitle="Write a new news, mission, impact, or press post."
        actions={
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
          >
            <ChevronLeft size={14} />
            Back to list
          </Link>
        }
      />
      <div className="max-w-3xl p-6 md:p-8">
        <div className="rounded-md border border-[var(--color-hairline)] bg-white p-6 md:p-8">
          <NewsForm mode={{ kind: "create" }} />
        </div>
      </div>
    </>
  )
}
