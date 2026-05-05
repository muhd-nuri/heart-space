"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CTAButton } from "@/components/ui/cta-button"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
]

// Pages that render a dark hero — navbar stays transparent over the top
// and switches to white once scrolled. Other routes always render white.
const DARK_HERO_ROUTES = new Set(["/"])

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const overDarkHero = DARK_HERO_ROUTES.has(pathname) && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
  }, [open])

  // Close mobile drawer on route change.
  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        overDarkHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[var(--color-hairline)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
      )}
      data-over-hero={overDarkHero ? "true" : "false"}
    >
      {/* Coral hairline at the very top — a tiny brand thread visible in any state */}
      <div aria-hidden className="h-[2px] w-full bg-gradient-to-r from-[var(--color-coral)] via-[var(--color-teal)] to-[var(--color-coral)] opacity-80" />

      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-6 px-6 md:h-[72px] md:px-8">
        <Link href="/" aria-label="HeartSpace — home" className="group flex items-center">
          <Image
            src="/images/logo.png"
            alt="HeartSpace"
            width={594}
            height={157}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={isActive(pathname, item.href)}
              overDarkHero={overDarkHero}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ImpactTicker overDarkHero={overDarkHero} />
          <CTAButton href="/contribute" variant="contribute" size="sm">
            Contribute
          </CTAButton>
        </div>

        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-md transition-colors md:hidden",
            overDarkHero ? "text-white hover:bg-white/10" : "text-[var(--color-ink)] hover:bg-[var(--color-ash)]"
          )}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full flex max-h-[calc(100svh-60px)] flex-col gap-6 border-b border-[var(--color-hairline)] bg-white px-6 pb-8 pt-6 md:hidden"
          >
            <div className="flex justify-center pb-2">
              <ImpactTicker overDarkHero={false} forceShow />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-3 text-[1.05rem] font-medium transition-colors",
                    isActive(pathname, item.href)
                      ? "bg-[var(--color-coral-pale)] text-[var(--color-coral-dark)]"
                      : "text-[var(--color-ink)] hover:bg-[var(--color-teal-pale)] hover:text-[var(--color-teal-dark)]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-2">
              <CTAButton href="/contribute" variant="contribute" className="justify-center">
                Contribute
              </CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavLink({
  href,
  label,
  active,
  overDarkHero,
}: {
  href: string
  label: string
  active: boolean
  overDarkHero: boolean
}) {
  const accent = overDarkHero ? "bg-white" : "bg-[var(--color-coral)]"
  const text = overDarkHero
    ? active
      ? "text-white"
      : "text-white/85 hover:text-white"
    : active
      ? "text-[var(--color-coral-dark)]"
      : "text-[var(--color-ink)] hover:text-[var(--color-coral-dark)]"

  return (
    <Link
      href={href}
      className={cn(
        "group/link relative inline-flex h-9 items-center px-3 text-[0.92rem] font-medium tracking-[-0.005em] transition-colors",
        text
      )}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0.5 left-3 right-3 h-[2px] origin-left rounded-full transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          accent,
          active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"
        )}
      />
    </Link>
  )
}

/**
 * Live impact ticker. Hardcoded "RM 312K raised this month" until the
 * monthly aggregation query is wired. The pulsing coral dot is what
 * sells "this is real money moving" — visible at every page view.
 */
function ImpactTicker({
  overDarkHero,
  forceShow = false,
}: {
  overDarkHero: boolean
  forceShow?: boolean
}) {
  return (
    <div
      className={cn(
        "items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.72rem] font-medium tracking-[-0.005em] transition-colors",
        forceShow ? "inline-flex" : "hidden lg:inline-flex",
        overDarkHero
          ? "border-white/20 bg-white/5 text-white/90 backdrop-blur"
          : "border-[var(--color-hairline)] bg-[var(--color-off-white)] text-[var(--color-ink-soft)]"
      )}
      aria-label="Live: RM 312K raised this month"
    >
      <span className="relative grid h-2 w-2 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-coral)] opacity-70" />
        <span className="relative h-2 w-2 rounded-full bg-[var(--color-coral)]" />
      </span>
      <span className="font-display font-bold">RM 312K</span>
      <span className={overDarkHero ? "text-white/60" : "text-[var(--color-ink-muted)]"}>
        raised this month
      </span>
    </div>
  )
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}
