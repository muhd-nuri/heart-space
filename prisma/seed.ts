import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const stats = [
  { label: "People Served", value: "50,000+", icon: "Heart", order: 1 },
  { label: "Mobile Clinics", value: "8", icon: "Truck", order: 2 },
  { label: "Countries", value: "12", icon: "Globe", order: 3 },
  { label: "Youth Trained", value: "3,000+", icon: "Users", order: 4 },
]

const campaigns = [
  {
    title: "Gaza Medical Relief",
    slug: "gaza-medical-relief",
    description:
      "Emergency medical supplies and field hospital support for families in Gaza.",
    target: 500000,
    raised: 312000,
    image: "/images/campaigns/gaza.jpg",
    status: "active",
    category: "disaster",
    startDate: new Date("2026-01-01"),
  },
  {
    title: "Mobile Clinic — Sabah",
    slug: "mobile-clinic-sabah",
    description:
      "Bringing primary healthcare to remote communities in Sabah, East Malaysia.",
    target: 150000,
    raised: 89000,
    image: "/images/campaigns/sabah.jpg",
    status: "active",
    category: "healthcare",
    startDate: new Date("2026-03-01"),
  },
  {
    title: "Waqf Health Fund 2026",
    slug: "waqf-health-fund-2026",
    description:
      "Build a Shariah-compliant endowment fund for sustainable healthcare for the ummah.",
    target: 1000000,
    raised: 445000,
    image: "/images/campaigns/waqf.jpg",
    status: "active",
    category: "waqf",
    startDate: new Date("2026-01-01"),
  },
]

const news = [
  {
    title: "8th Mobile Clinic Launches in East Sabah",
    slug: "8th-mobile-clinic-east-sabah",
    excerpt:
      "Our newest mobile unit will serve 14 remote villages along the Kinabatangan, reaching 6,000 patients a year.",
    content: "Full story coming soon.",
    coverImage: "/images/news/sabah-clinic.jpg",
    category: "mission",
    published: true,
    publishedAt: new Date("2026-04-12"),
    author: "HeartSpace Team",
  },
  {
    title: "RM 2.4M Raised for Gaza Field Hospital",
    slug: "gaza-field-hospital-update",
    excerpt:
      "Three weeks of fundraising. Two field hospitals deployed. A thank-you from the doctors on the ground.",
    content: "Full story coming soon.",
    coverImage: "/images/news/gaza-update.jpg",
    category: "impact",
    published: true,
    publishedAt: new Date("2026-03-28"),
    author: "Field Operations",
  },
  {
    title: "Run for Humanity 2026 — Registration Open",
    slug: "run-for-humanity-2026",
    excerpt:
      "Bukit Jalil, 12 July 2026. Every kilometre funds a vaccination for a child in a refugee camp.",
    content: "Full story coming soon.",
    coverImage: "/images/news/run.jpg",
    category: "news",
    published: true,
    publishedAt: new Date("2026-04-30"),
    author: "Events Team",
  },
]

async function main() {
  console.log("Seeding HeartSpace …")

  for (const stat of stats) {
    await prisma.impactStat.upsert({
      where: { id: `stat-${stat.order}` },
      update: stat,
      create: { id: `stat-${stat.order}`, ...stat },
    })
  }

  for (const c of campaigns) {
    await prisma.campaign.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    })
  }

  for (const n of news) {
    await prisma.newsPost.upsert({
      where: { slug: n.slug },
      update: n,
      create: n,
    })
  }

  console.log("✓ Seed complete")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
