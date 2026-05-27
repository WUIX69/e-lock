"use client"

import { EyeOff, Check, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ActiveLockout } from "@/types/user-dashboard"
import { useState } from "react"

interface ActiveLockoutsPanelProps {
  lockouts: ActiveLockout[]
}

const statusConfig = {
  maintenance_in_progress: {
    label: "MAINTENANCE IN PROGRESS",
    pillClass: "bg-primary/10 text-primary",
  },
  awaiting_verification: {
    label: "AWAITING VERIFICATION",
    pillClass: "bg-muted text-muted-foreground",
  },
}

export const ActiveLockoutsPanel = ({ lockouts }: ActiveLockoutsPanelProps) => {
  const [items, setItems] = useState(lockouts)

  const toggleVisibility = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    )
  }

  return (
    <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tight text-foreground">
          My Active Lockouts
        </h3>
        <Link
          href="/user/my-activity"
          className="flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary/80"
        >
          View All
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="space-y-6">
        {items.map((lockout) => {
          const status = statusConfig[lockout.status]

          return (
            <div key={lockout.id} className="flex items-center gap-4">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-lg font-black text-secondary">
                {lockout.zoneId}
                <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full bg-primary ring-2 ring-card">
                  <Check className="size-2.5 text-primary-foreground" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-foreground">
                  {lockout.assetName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Isolated: {lockout.isolatedAt} &bull; Duration:{" "}
                  {lockout.duration}
                </p>
              </div>

              <span
                className={cn(
                  "shrink-0 rounded px-3 py-1.5 text-[10px] font-black tracking-widest whitespace-nowrap uppercase",
                  status.pillClass
                )}
              >
                {status.label}
              </span>

              <button
                onClick={() => toggleVisibility(lockout.id)}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                  lockout.isVisible
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <EyeOff className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
