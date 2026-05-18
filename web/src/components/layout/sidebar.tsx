"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Zap,
  Lock,
  History,
  Users,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/context/sidebar-context"
import { useSession } from "@/context/session-context"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { logoutAction } from "@/features/auth/server/actions"
import { useRouter } from "next/navigation"

const getNavigation = (role: string | undefined) => {
  if (role === "admin") {
    return [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Energy Sources", href: "/admin/energy", icon: Zap },
      { name: "Lockout Devices", href: "/admin/devices", icon: Lock },
      { name: "Safety Logs", href: "/admin/audit", icon: History },
      { name: "Team Access", href: "/admin/personnel", icon: Users },
      { name: "System Settings", href: "/admin/settings", icon: Settings },
    ]
  }

  return [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "My Activity", href: "/user/my-activity", icon: Activity },
  ]
}

function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { setIsOpen } = useSidebar()
  const { currentUser } = useSession()

  const navigation = getNavigation(currentUser?.role)

  const handleLogout = async () => {
    await logoutAction()
    router.push("/login")
  }

  return (
    <>
      {/* Brand Header */}
      <div className="flex h-24 shrink-0 flex-col justify-center px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/20">
            <Lock className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-sidebar-accent-foreground">
              E-LOCK
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-sidebar-foreground/40 uppercase">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-black/10"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    isActive
                      ? "text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground"
                  )}
                />
                {item.name}
              </div>
              {isActive && <ChevronRight className="size-4 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="shrink-0 space-y-4 p-6">
        {/* Emergency Stop Button */}
        <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-destructive px-4 py-4 text-sm font-black tracking-widest text-destructive-foreground uppercase shadow-lg shadow-destructive/20 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <AlertTriangle className="size-5" />
          Emergency Stop
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-sidebar-accent/5 py-4 text-[10px] font-bold tracking-wider text-sidebar-foreground/40 uppercase transition-colors hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
          >
            <Bell className="size-4" />
            Alerts
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-sidebar-accent/5 py-4 text-[10px] font-bold tracking-wider text-sidebar-foreground/40 uppercase transition-colors hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
          >
            <HelpCircle className="size-4" />
            Support
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-sidebar-border px-4 py-3 text-sm font-bold text-sidebar-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </>
  )
}

export function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="z-20 hidden h-screen w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground shadow-2xl lg:flex">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="flex h-full w-[85vw] max-w-sm flex-col border-r-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <div className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </div>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
