/**
 * Client-side analytics helpers. Safe to call regardless of whether the
 * trackers are loaded — both GA4 and Meta Pixel won't be injected unless
 * their env IDs are set.
 *
 * Use these to fire conversion events for the contribution + volunteer
 * flows once you wire them in.
 *
 * Example:
 *   trackEvent("contribute_started", { type: "sadaqah", amount: 100 })
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackPageView(url: string) {
  if (typeof window === "undefined") return
  window.gtag?.("event", "page_view", { page_path: url })
  window.fbq?.("track", "PageView")
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  window.gtag?.("event", name, params)
  window.fbq?.("trackCustom", name, params)
}

export function trackContribution(amount: number, currency: string = "MYR") {
  if (typeof window === "undefined") return
  window.gtag?.("event", "purchase", {
    value: amount,
    currency,
    transaction_id: `c_${Date.now()}`,
  })
  window.fbq?.("track", "Donate", { value: amount, currency })
}
