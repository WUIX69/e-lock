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

const breadcrumbs = [
  { name: "Facility Alpha", href: "#" },
  { name: "Zone 4", href: "#" },
  { name: "Main Grid", href: "/" },
]

export function Header() {
  const { setIsOpen } = useSidebar()

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden flex items-center justify-center size-10 shrink-0 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
        >
          <Menu className="size-5 text-foreground" />
        </button>
        
        <div className="hidden sm:flex flex-col">
          <h1 className="text-xl font-black tracking-tight text-primary">
            E-LOCK Industrial
          </h1>
          <nav className="mt-1 flex items-center gap-4">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.name}>
                <Link
                  href={crumb.href}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-colors",
                    index === breadcrumbs.length - 1
                      ? "text-primary border-b-2 border-primary pb-0.5"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {crumb.name}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="text-[10px] text-muted-foreground/30">/</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* System Status Badge */}
        <div className="hidden lg:flex items-center gap-3 rounded-2xl bg-accent px-4 py-2 text-accent-foreground shadow-sm">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            System Isolated
          </span>
        </div>

        {/* Scan Badge Button */}
        <button className="hidden sm:flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-muted">
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
              <button className="flex items-center gap-3 outline-none group">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-bold text-foreground">
                    Admin User
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Administrator
                  </span>
                </div>
                <Avatar className="h-10 w-10 shrink-0 rounded-2xl border-2 border-border transition-transform group-hover:scale-105">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                  <AvatarFallback>AD</AvatarFallback>
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
              <DropdownMenuItem className="rounded-xl px-2 py-2 text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
