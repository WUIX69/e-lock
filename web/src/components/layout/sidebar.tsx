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
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Energy Sources", href: "/energy", icon: Zap },
  { name: "Lockout Devices", href: "/devices", icon: Lock },
  { name: "Safety Logs", href: "/audit", icon: History },
  { name: "Team Access", href: "/personnel", icon: Users },
  { name: "System Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-72 flex-col bg-sidebar text-sidebar-foreground shadow-2xl">
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
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
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
      <div className="space-y-4 p-6">
        {/* Emergency Stop Button */}
        <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-destructive px-4 py-4 text-sm font-black uppercase tracking-widest text-destructive-foreground shadow-lg shadow-destructive/20 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <AlertTriangle className="size-5" />
          Emergency Stop
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-sidebar-accent/5 py-4 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
          >
            <Bell className="size-4" />
            Alerts
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-sidebar-accent/5 py-4 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
          >
            <HelpCircle className="size-4" />
            Support
          </Link>
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-3 rounded-xl border border-sidebar-border px-4 py-3 text-sm font-bold text-sidebar-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Sign Out
        </Link>
      </div>
    </div>
  )
}
