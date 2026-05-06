"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const CATEGORY = ["news", "mission", "impact", "press"] as const

const NewsInput = z.object({
  title: z.string().min(2, "Title is required.").max(200),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes."),
  excerpt: z
    .string()
    .min(10, "Excerpt should be at least 10 characters.")
    .max(500, "Excerpt should be 500 characters or fewer."),
  content: z.string().min(10, "Content is required."),
  coverImage: z.string().min(1, "Cover image path or URL is required.").max(500),
  category: z.enum(CATEGORY),
  author: z.string().min(2, "Author is required.").max(120),
  published: z.preprocess(
    (v) => v === "on" || v === "true" || v === true || v === "1",
    z.boolean()
  ),
})

export type NewsFormState = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof NewsInput>, string>>
}

function parseFormData(formData: FormData) {
  return NewsInput.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    category: formData.get("category"),
    author: formData.get("author"),
    published: formData.get("published"),
  })
}

function flatten(parsed: ReturnType<typeof parseFormData>): NewsFormState {
  if (parsed.success) return { ok: true }
  const fieldErrors: NewsFormState["fieldErrors"] = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof z.infer<typeof NewsInput>
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors }
}

function bust(slug: string) {
  revalidatePath("/")
  revalidatePath("/news")
  revalidatePath(`/news/${slug}`)
  revalidatePath("/admin/news")
}

export async function createNews(
  _prev: NewsFormState | null,
  formData: FormData
): Promise<NewsFormState> {
  const parsed = parseFormData(formData)
  if (!parsed.success) return flatten(parsed)

  const { published, ...rest } = parsed.data
  try {
    await prisma.newsPost.create({
      data: {
        ...rest,
        published,
        publishedAt: published ? new Date() : null,
      },
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        message: "A post with this slug already exists.",
        fieldErrors: { slug: "Already in use" },
      }
    }
    return { ok: false, message: "Could not create post. Please try again." }
  }

  bust(parsed.data.slug)
  redirect("/admin/news")
}

export async function updateNews(
  id: string,
  _prev: NewsFormState | null,
  formData: FormData
): Promise<NewsFormState> {
  const parsed = parseFormData(formData)
  if (!parsed.success) return flatten(parsed)

  const existing = await prisma.newsPost.findUnique({
    where: { id },
    select: { slug: true, publishedAt: true, published: true },
  })

  // First-publish: stamp publishedAt. Subsequent re-publishes preserve the
  // original date.
  const { published, ...rest } = parsed.data
  let publishedAt = existing?.publishedAt ?? null
  if (published && !publishedAt) publishedAt = new Date()

  try {
    await prisma.newsPost.update({
      where: { id },
      data: { ...rest, published, publishedAt },
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        message: "A post with this slug already exists.",
        fieldErrors: { slug: "Already in use" },
      }
    }
    return { ok: false, message: "Could not update post. Please try again." }
  }

  bust(parsed.data.slug)
  if (existing && existing.slug !== parsed.data.slug) {
    revalidatePath(`/news/${existing.slug}`)
  }
  redirect("/admin/news")
}

export async function deleteNews(id: string) {
  const post = await prisma.newsPost.findUnique({ where: { id }, select: { slug: true } })
  await prisma.newsPost.delete({ where: { id } })
  if (post) bust(post.slug)
  redirect("/admin/news")
}

export async function toggleNewsPublished(id: string) {
  const existing = await prisma.newsPost.findUnique({
    where: { id },
    select: { published: true, publishedAt: true, slug: true },
  })
  if (!existing) return
  const next = !existing.published
  const publishedAt =
    next && !existing.publishedAt ? new Date() : existing.publishedAt
  await prisma.newsPost.update({
    where: { id },
    data: { published: next, publishedAt },
  })
  bust(existing.slug)
}
