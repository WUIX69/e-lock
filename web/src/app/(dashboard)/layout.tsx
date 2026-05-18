import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SidebarProvider } from "@/context/sidebar-context"
import { SessionProvider } from "@/context/session-context"
import { requireAuth } from "@/features/auth/server/actions/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enforce server-side authentication for the entire dashboard
  await requireAuth()

  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
              <Footer />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  )
}
