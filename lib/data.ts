import { prisma } from "@/lib/prisma"
import type { CampaignCardData } from "@/components/ui/campaign-card"
import type { NewsCardData } from "@/components/ui/news-card"

export type CampaignDetail = CampaignCardData & {
  startDate: Date
  endDate: Date | null
  status: string
  contributorCount: number
}

const FALLBACK_STATS = [
  { id: "stat-1", label: "People Served", value: "50,000+", icon: "Heart", order: 1 },
  { id: "stat-2", label: "Mobile Clinics", value: "8", icon: "Truck", order: 2 },
  { id: "stat-3", label: "Countries", value: "12", icon: "Globe", order: 3 },
  { id: "stat-4", label: "Youth Trained", value: "3,000+", icon: "Users", order: 4 },
]

const FALLBACK_CAMPAIGNS: CampaignCardData[] = [
  {
    title: "Gaza Medical Relief",
    slug: "gaza-medical-relief",
    description:
      "Emergency medical supplies and field hospital support for families in Gaza.",
    image: "/images/campaigns/gaza.jpg",
    category: "disaster",
    raised: 312000,
    target: 500000,
  },
  {
    title: "Mobile Clinic — Sabah",
    slug: "mobile-clinic-sabah",
    description:
      "Bringing primary healthcare to remote communities in Sabah, East Malaysia.",
    image: "/images/campaigns/sabah.jpg",
    category: "healthcare",
    raised: 89000,
    target: 150000,
  },
  {
    title: "Waqf Health Fund 2026",
    slug: "waqf-health-fund-2026",
    description:
      "Build a Shariah-compliant endowment fund for sustainable healthcare for the ummah.",
    image: "/images/campaigns/waqf.jpg",
    category: "waqf",
    raised: 445000,
    target: 1000000,
  },
]

const FALLBACK_NEWS: NewsCardData[] = [
  {
    title: "8th Mobile Clinic Launches in East Sabah",
    slug: "8th-mobile-clinic-east-sabah",
    excerpt:
      "Our newest mobile unit will serve 14 remote villages along the Kinabatangan, reaching 6,000 patients a year.",
    coverImage: "/images/news/sabah-clinic.jpg",
    category: "mission",
    publishedAt: new Date("2026-04-12"),
    author: "HeartSpace Team",
  },
  {
    title: "RM 2.4M Raised for Gaza Field Hospital",
    slug: "gaza-field-hospital-update",
    excerpt:
      "Three weeks of fundraising. Two field hospitals deployed. A thank-you from the doctors on the ground.",
    coverImage: "/images/news/gaza-update.jpg",
    category: "impact",
    publishedAt: new Date("2026-03-28"),
    author: "Field Operations",
  },
  {
    title: "Run for Humanity 2026 — Registration Open",
    slug: "run-for-humanity-2026",
    excerpt:
      "Bukit Jalil, 12 July 2026. Every kilometre funds a vaccination for a child in a refugee camp.",
    coverImage: "/images/news/run.jpg",
    category: "news",
    publishedAt: new Date("2026-04-30"),
    author: "Events Team",
  },
]

// Reads tolerate a missing/unmigrated DB so the homepage still renders during
// initial setup — until DATABASE_URL is wired and `prisma migrate dev` has run.
export async function getImpactStats() {
  try {
    const stats = await prisma.impactStat.findMany({ orderBy: { order: "asc" } })
    return stats.length ? stats : FALLBACK_STATS
  } catch {
    return FALLBACK_STATS
  }
}

export async function getFeaturedCampaigns(limit = 3): Promise<CampaignCardData[]> {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
    if (!campaigns.length) return FALLBACK_CAMPAIGNS
    return campaigns.map((c) => ({
      title: c.title,
      slug: c.slug,
      description: c.description,
      image: c.image,
      category: c.category,
      raised: c.raised,
      target: c.target,
    }))
  } catch {
    return FALLBACK_CAMPAIGNS
  }
}

export async function getAllCampaigns(opts?: {
  category?: string
}): Promise<CampaignCardData[]> {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: "active",
        ...(opts?.category ? { category: opts.category } : {}),
      },
      orderBy: { createdAt: "desc" },
    })
    if (!campaigns.length && !opts?.category) return FALLBACK_CAMPAIGNS
    return campaigns.map((c) => ({
      title: c.title,
      slug: c.slug,
      description: c.description,
      image: c.image,
      category: c.category,
      raised: c.raised,
      target: c.target,
    }))
  } catch {
    if (opts?.category) {
      return FALLBACK_CAMPAIGNS.filter((c) => c.category === opts.category)
    }
    return FALLBACK_CAMPAIGNS
  }
}

export async function getCampaign(slug: string): Promise<CampaignDetail | null> {
  try {
    const c = await prisma.campaign.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { contributions: { where: { status: "paid" } } },
        },
      },
    })
    if (!c) {
      // dev fallback so the page still works without a DB
      return makeFallbackDetail(slug)
    }
    return {
      title: c.title,
      slug: c.slug,
      description: c.description,
      image: c.image,
      category: c.category,
      raised: c.raised,
      target: c.target,
      startDate: c.startDate,
      endDate: c.endDate,
      status: c.status,
      contributorCount: c._count.contributions,
    }
  } catch {
    return makeFallbackDetail(slug)
  }
}

function makeFallbackDetail(slug: string): CampaignDetail | null {
  const fb = FALLBACK_CAMPAIGNS.find((c) => c.slug === slug)
  if (!fb) return null
  return {
    ...fb,
    startDate: new Date("2026-01-01"),
    endDate: null,
    status: "active",
    contributorCount: 0,
  }
}

export async function getAllNews(opts?: { category?: string }): Promise<NewsCardData[]> {
  try {
    const posts = await prisma.newsPost.findMany({
      where: {
        published: true,
        ...(opts?.category ? { category: opts.category } : {}),
      },
      orderBy: { publishedAt: "desc" },
    })
    if (!posts.length && !opts?.category) return FALLBACK_NEWS
    return posts.map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      category: p.category,
      publishedAt: p.publishedAt,
      author: p.author,
    }))
  } catch {
    if (opts?.category) {
      return FALLBACK_NEWS.filter((p) => p.category === opts.category)
    }
    return FALLBACK_NEWS
  }
}

export type NewsPostFull = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  publishedAt: Date | null
  author: string
}

export async function getNewsPost(slug: string): Promise<NewsPostFull | null> {
  try {
    const post = await prisma.newsPost.findUnique({ where: { slug } })
    if (!post || !post.published) return null
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      publishedAt: post.publishedAt,
      author: post.author,
    }
  } catch {
    return null
  }
}

export async function getRelatedNews(currentSlug: string, limit = 3): Promise<NewsCardData[]> {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true, slug: { not: currentSlug } },
      orderBy: { publishedAt: "desc" },
      take: limit,
    })
    return posts.map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      category: p.category,
      publishedAt: p.publishedAt,
      author: p.author,
    }))
  } catch {
    return FALLBACK_NEWS.filter((p) => p.slug !== currentSlug).slice(0, limit)
  }
}

export async function getLatestNews(limit = 3): Promise<NewsCardData[]> {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
    })
    if (!posts.length) return FALLBACK_NEWS
    return posts.map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      category: p.category,
      publishedAt: p.publishedAt,
      author: p.author,
    }))
  } catch {
    return FALLBACK_NEWS
  }
}
