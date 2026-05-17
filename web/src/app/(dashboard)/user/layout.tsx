import { requireAuth } from "@/features/auth/server/actions/auth"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enforce server-side role restriction: only "user" allowed
  await requireAuth(["user"])

  return <>{children}</>
}
