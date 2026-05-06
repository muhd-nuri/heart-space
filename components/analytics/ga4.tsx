import Script from "next/script"

/**
 * Google Analytics 4 loader. Renders nothing if NEXT_PUBLIC_GA_ID is unset
 * — keeps local dev clean and avoids inflating numbers from preview envs.
 */
export function GA4() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  if (!id) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}', { anonymize_ip: true });
      `}</Script>
    </>
  )
}
