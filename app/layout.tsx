import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppFloat } from "@/components/layout/whatsapp-float"

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
})

// General Sans (Fontshare). Self-hosted from /public/fonts/general-sans.
const body = localFont({
  src: [
    { path: "../public/fonts/general-sans/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/general-sans/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/general-sans/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "HeartSpace | Youth Healthcare & Humanitarian Movement",
    template: "%s · HeartSpace",
  },
  description:
    "HeartSpace mobilises youth, clinics and communities to deliver healthcare and humanitarian aid across Asia and beyond. Contribute, volunteer, or partner with us.",
  openGraph: {
    title: "HeartSpace | Youth Healthcare & Humanitarian Movement",
    description:
      "Asia's leading youth-driven healthcare and humanitarian movement — powered by waqf, driven by youth.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className={`${body.className} bg-[var(--color-off-white)] text-[var(--color-ink-soft)] antialiased`}>
        <Navbar />
        <main className="min-h-[calc(100svh-68px)]">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  )
}
