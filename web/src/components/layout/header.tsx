"use client"

import * as React from "react"
import { Bell, ShieldCheck, CreditCard, User, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useSidebar } from "@/context/sidebar-context"
import { useAuth } from "@/context/auth-context"

const breadcrumbs = [
  { name: "Facility Alpha", href: "#" },
  { name: "Zone 4", href: "#" },
  { name: "Main Grid", href: "/" },
]

export function Header() {
  const { setIsOpen } = useSidebar()
  const { currentUser } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4 md:gap-8">
        <button
          onClick={() => setIsOpen(true)}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted lg:hidden"
        >
          <Menu className="size-5 text-foreground" />
        </button>

        <div className="hidden flex-col sm:flex">
          <h1 className="text-xl font-black tracking-tight text-primary">
            E-LOCK Industrial
          </h1>
          <nav className="mt-1 flex items-center gap-4">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.name}>
                <Link
                  href={crumb.href}
                  className={cn(
                    "text-[10px] font-bold tracking-widest uppercase transition-colors",
                    index === breadcrumbs.length - 1
                      ? "border-b-2 border-primary pb-0.5 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {crumb.name}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="text-[10px] text-muted-foreground/30">
                    /
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* System Status Badge */}
        <div className="hidden items-center gap-3 rounded-2xl bg-accent px-4 py-2 text-accent-foreground shadow-sm lg:flex">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase">
            System Isolated
          </span>
        </div>

        {/* Scan Badge Button */}
        <button className="hidden items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-colors hover:bg-muted sm:flex">
          <CreditCard className="size-4" />
          <span className="hidden md:inline">Scan Badge</span>
        </button>

        <div className="flex items-center gap-2 md:gap-4 lg:border-l lg:border-border lg:pl-6">
          <ModeToggle />
          <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-muted">
            <Bell className="size-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive shadow-sm" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-3 outline-none">
                <div className="hidden flex-col items-end lg:flex">
                  <span className="text-xs font-bold text-foreground">
                    {currentUser?.name || "Loading..."}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground capitalize">
                    {currentUser?.role || "User"}
                  </span>
                </div>
                <Avatar className="h-10 w-10 shrink-0 rounded-2xl border-2 border-border transition-transform group-hover:scale-105">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email}`}
                    alt={currentUser?.name || "User"}
                  />
                  <AvatarFallback>
                    {currentUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground">
                Management Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl px-2 py-2 text-sm font-medium">
                <User className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-2 py-2 text-sm font-medium">
                <ShieldCheck className="mr-2 size-4" />
                Security
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  const { logoutAction } =
                    await import("@/features/auth/server/actions/auth")
                  await logoutAction()
                  window.location.href = "/login"
                }}
                className="cursor-pointer rounded-xl px-2 py-2 text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
