import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const STATIC_ROUTES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}> = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about/vision", changeFrequency: "monthly", priority: 0.7 },
  { path: "/campaigns", changeFrequency: "daily", priority: 0.9 },
  { path: "/contribute", changeFrequency: "weekly", priority: 0.95 },
  { path: "/volunteer", changeFrequency: "weekly", priority: 0.85 },
  { path: "/news", changeFrequency: "daily", priority: 0.8 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const [campaigns, news] = await Promise.all([
    prisma.campaign
      .findMany({
        where: { status: { in: ["active", "completed"] } },
        select: { slug: true, createdAt: true },
      })
      .catch(() => []),
    prisma.newsPost
      .findMany({
        where: { published: true },
        select: { slug: true, publishedAt: true },
      })
      .catch(() => []),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const campaignEntries: MetadataRoute.Sitemap = campaigns.map((c) => ({
    url: `${BASE}/campaigns/${c.slug}`,
    lastModified: c.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const newsEntries: MetadataRoute.Sitemap = news.map((p) => ({
    url: `${BASE}/news/${p.slug}`,
    lastModified: p.publishedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...campaignEntries, ...newsEntries]
}
