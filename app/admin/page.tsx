import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function AdminPage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null)

  if (!session) redirect("/login?from=/admin")

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <p className="text-label accent-line font-display text-[var(--color-teal)]">
        Admin
      </p>
      <h1 className="text-display-lg mt-4 font-display font-extrabold text-[var(--color-ink)]">
        Welcome, {session.user.name ?? session.user.email}.
      </h1>
      <p className="mt-3 max-w-xl text-[1.02rem] text-[var(--color-ink-muted)]">
        The full admin dashboard is built in Phase 3. For now, this page
        confirms that authentication and the route guard work.
      </p>
    </div>
  )
}
