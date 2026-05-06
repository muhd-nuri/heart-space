/**
 * JSON-LD schema builders. We use schema.org's NGO type for the
 * organisation, Article for news posts, and DonateAction for campaigns.
 *
 * Each builder returns a plain object — render via:
 *   <script type="application/ld+json"
 *           dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "HeartSpace",
  alternateName: "MyHeart",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description:
    "Asia's leading youth-driven healthcare and humanitarian movement — powered by waqf, driven by youth, governed to international standards.",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lot 1A, Plaza Hamodal, Jalan Tun Razak",
    addressLocality: "Kuala Lumpur",
    postalCode: "50400",
    addressCountry: "MY",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@heartspace.my",
      telephone: "+60-3-1234-5678",
      areaServed: "MY",
      availableLanguage: ["English", "Bahasa Melayu"],
    },
  ],
  sameAs: [],
  areaServed: ["Asia", "Middle East", "East Africa"],
}

export type ArticleLDInput = {
  title: string
  slug: string
  description: string
  image?: string | null
  publishedAt: Date | null
  author: string
  category?: string
}

export function articleLD(a: ArticleLDInput) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.description,
    url: `${SITE_URL}/news/${a.slug}`,
    image: a.image ? [absolute(a.image)] : undefined,
    datePublished: a.publishedAt?.toISOString(),
    dateModified: a.publishedAt?.toISOString(),
    author: { "@type": "Person", name: a.author },
    publisher: {
      "@type": "NGO",
      name: "HeartSpace",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
    },
    articleSection: a.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/news/${a.slug}` },
  }
}

export type CampaignLDInput = {
  title: string
  slug: string
  description: string
  image?: string | null
  raised: number
  target: number
  startDate?: Date | null
  endDate?: Date | null
}

export function campaignLD(c: CampaignLDInput) {
  return {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    name: c.title,
    description: c.description,
    url: `${SITE_URL}/campaigns/${c.slug}`,
    image: c.image ? absolute(c.image) : undefined,
    recipient: { "@type": "NGO", name: "HeartSpace" },
    startTime: c.startDate?.toISOString(),
    endTime: c.endDate?.toISOString() ?? undefined,
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "MYR",
      minPrice: 5,
    },
    // Custom field — non-standard but commonly indexed
    fundraisingTotal: { raised: c.raised, target: c.target, currency: "MYR" },
  }
}

function absolute(path: string) {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`
}

/**
 * Small helper to render an LD object as a JSON-LD <script> tag.
 */
export function ldScriptProps(obj: object) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(obj) },
  }
}
