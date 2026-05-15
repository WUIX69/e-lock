"use client"

import * as React from "react"
import { useSession } from "@/context/session-context"
import { MOCK_ACCOUNTS } from "@/data/mock/accounts"
import { Shield, User, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export function RoleSwitcher() {
  const { currentUser, setCurrentUser } = useSession()

  const handleToggle = () => {
    if (!currentUser) return
    const nextIndex = (MOCK_ACCOUNTS.findIndex(acc => acc.id === currentUser.id) + 1) % MOCK_ACCOUNTS.length
    setCurrentUser(MOCK_ACCOUNTS[nextIndex])
  }

  return (
    <div className="px-4 py-2">
      <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/5 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-sidebar-foreground/40 uppercase">
              Current Session
            </span>
            <span className="text-xs font-black text-sidebar-accent-foreground">
              {currentUser?.name ?? "Guest"}
            </span>
          </div>
          <div className={cn(
            "flex size-8 items-center justify-center rounded-lg shadow-inner",
            currentUser?.role === "admin" ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-400"
          )}>
            {currentUser?.role === "admin" ? <Shield className="size-4" /> : <User className="size-4" />}
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sidebar-accent px-4 py-2 text-[10px] font-black tracking-widest text-sidebar-accent-foreground uppercase transition-all hover:bg-sidebar-accent/80 active:scale-[0.98]"
        >
          <RefreshCw className="size-3" />
          Switch Role
        </button>
      </div>
    </div>
  )
}
