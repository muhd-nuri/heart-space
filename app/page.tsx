import { HeroSection } from "@/components/sections/home/hero-section"
import { ImpactStatsSection } from "@/components/sections/home/impact-stats-section"
import { ActiveCampaignsSection } from "@/components/sections/home/active-campaigns-section"
import { VisionStripSection } from "@/components/sections/home/vision-strip-section"
import { WhyHeartSpaceSection } from "@/components/sections/home/why-heartspace-section"
import { HowToHelpSection } from "@/components/sections/home/how-to-help-section"
import { LatestNewsSection } from "@/components/sections/home/latest-news-section"
import { CTABannerSection } from "@/components/sections/home/cta-banner-section"
import { getFeaturedCampaigns, getImpactStats, getLatestNews } from "@/lib/data"

export const revalidate = 300

export default async function HomePage() {
  const [stats, campaigns, news] = await Promise.all([
    getImpactStats(),
    getFeaturedCampaigns(3),
    getLatestNews(3),
  ])

  return (
    <>
      <HeroSection />
      <ImpactStatsSection stats={stats} />
      <ActiveCampaignsSection campaigns={campaigns} />
      <VisionStripSection />
      <WhyHeartSpaceSection />
      <HowToHelpSection />
      <LatestNewsSection posts={news} />
      <CTABannerSection />
    </>
  )
}
