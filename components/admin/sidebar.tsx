"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Megaphone,
  HandCoins,
  Newspaper,
  Users,
  BarChart3,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { signOutAction } from "@/app/admin/actions"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/contributions", label: "Contributions", icon: HandCoins },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/volunteers", label: "Volunteers", icon: Users },
  { href: "/admin/stats", label: "Impact Stats", icon: BarChart3 },
] as const

type Props = {
  user: { name: string; email: string }
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-hairline)] bg-white px-4 py-3 lg:hidden">
        <span className="font-display text-[0.95rem] font-extrabold tracking-tight text-[var(--color-ink)]">
          HeartSpace · Admin
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-9 w-9 place-items-center rounded-md text-[var(--color-ink)] hover:bg-[var(--color-ash)]"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[var(--color-hairline)] bg-white transition-transform lg:sticky lg:top-0 lg:h-svh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-hairline)] px-5 py-4">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-md bg-[var(--color-teal)] text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </span>
          <div className="flex-1">
            <p className="font-display text-[0.95rem] font-extrabold leading-tight tracking-tight text-[var(--color-ink)]">
              HeartSpace
            </p>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Admin
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = isActive(item.href, "exact" in item ? item.exact : false)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.9rem] font-medium transition-colors",
                  active
                    ? "bg-[var(--color-teal-pale)] text-[var(--color-teal-dark)]"
                    : "text-[var(--color-ink)] hover:bg-[var(--color-ash)]"
                )}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          <div className="my-3 border-t border-[var(--color-hairline)]" />

          <Link
            href="/"
            target="_blank"
            className="mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.9rem] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ash)]"
          >
            <ExternalLink size={16} strokeWidth={1.8} />
            <span>View site</span>
          </Link>
        </nav>

        <div className="border-t border-[var(--color-hairline)] p-3">
          <div className="rounded-md bg-[var(--color-ash)] p-3">
            <p className="truncate font-display text-[0.86rem] font-bold text-[var(--color-ink)]">
              {user.name || user.email.split("@")[0]}
            </p>
            <p className="truncate text-[0.78rem] text-[var(--color-ink-muted)]">{user.email}</p>
            <form action={signOutAction} className="mt-3">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--color-hairline)] bg-white px-3 py-2 text-[0.82rem] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-coral)]/60 hover:bg-[var(--color-coral-pale)] hover:text-[var(--color-coral-dark)]"
              >
                <LogOut size={14} strokeWidth={1.8} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {open && (
        <button
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-10 bg-black/30 lg:hidden"
        />
      )}
    </>
  )
}
