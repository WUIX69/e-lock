import { requireAuth } from "@/features/auth/server/actions/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enforce server-side role restriction: only "admin" allowed
  await requireAuth(["admin"])

  return <>{children}</>
}
