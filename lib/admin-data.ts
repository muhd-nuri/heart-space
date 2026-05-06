import { prisma } from "@/lib/prisma"

export async function getDashboardSummary() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    monthAggregate,
    activeCampaigns,
    totalContributors,
    pendingVolunteers,
    recentContributions,
    recentVolunteers,
  ] = await Promise.all([
    prisma.contribution.aggregate({
      where: { status: "paid", paidAt: { gte: monthStart } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.campaign.count({ where: { status: "active" } }),
    prisma.contribution.findMany({
      where: { status: "paid" },
      distinct: ["contributorEmail"],
      select: { contributorEmail: true },
    }),
    prisma.volunteer.count({ where: { status: "pending" } }),
    prisma.contribution.findMany({
      where: { status: "paid" },
      include: { campaign: { select: { title: true } } },
      orderBy: { paidAt: "desc" },
      take: 8,
    }),
    prisma.volunteer.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  return {
    monthRaised: monthAggregate._sum.amount ?? 0,
    monthCount: monthAggregate._count,
    activeCampaigns,
    totalContributors: totalContributors.length,
    pendingVolunteers,
    recentContributions,
    recentVolunteers,
  }
}

export type DashboardSummary = Awaited<ReturnType<typeof getDashboardSummary>>
