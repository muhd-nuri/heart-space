"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { CTAButton } from "@/components/ui/cta-button"

function LoginForm() {
  const router = useRouter()
  const search = useSearchParams()
  const from = search.get("from") ?? "/admin"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await authClient.signIn.email({ email, password })
      if (error) {
        setError(error.message ?? "Invalid email or password")
      } else {
        router.push(from)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--color-hairline)] bg-white px-4 py-3 text-[0.95rem] text-[var(--color-ink)] outline-none transition focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--color-hairline)] bg-white px-4 py-3 text-[0.95rem] text-[var(--color-ink)] outline-none transition focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30"
        />
      </div>

      {error && (
        <p className="rounded-md border border-[var(--color-coral)]/40 bg-[var(--color-coral-pale)] px-4 py-3 text-[0.88rem] text-[var(--color-coral-dark)]">
          {error}
        </p>
      )}

      <CTAButton type="submit" variant="primary" className="w-full justify-center">
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
      </CTAButton>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-68px-180px)] max-w-md flex-col justify-center px-6 py-16 md:px-8">
      <div className="rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-8 shadow-[var(--shadow-card)]">
        <p className="text-label accent-line font-display text-[var(--color-teal)]">
          HeartSpace · Admin
        </p>
        <h1 className="text-display-md mt-4 font-display font-extrabold text-[var(--color-ink)]">
          Sign in
        </h1>
        <p className="mt-2 text-[0.93rem] text-[var(--color-ink-muted)]">
          Sign in to manage campaigns, contributions, and news.
        </p>
        <div className="mt-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-[0.82rem] text-[var(--color-ink-muted)]">
          Trouble signing in?{" "}
          <Link href="/contact" className="font-medium text-[var(--color-teal-dark)] underline-offset-2 hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
