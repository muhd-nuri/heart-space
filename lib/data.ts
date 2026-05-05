import { prisma } from "@/lib/prisma"
import type { CampaignCardData } from "@/components/ui/campaign-card"
import type { NewsCardData } from "@/components/ui/news-card"

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
