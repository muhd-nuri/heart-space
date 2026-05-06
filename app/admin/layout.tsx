import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null)
  if (!session) redirect("/login?from=/admin")

  return (
    <div className="min-h-svh bg-[var(--color-ash)] lg:flex">
      <AdminSidebar
        user={{
          name: session.user.name ?? "",
          email: session.user.email,
        }}
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
