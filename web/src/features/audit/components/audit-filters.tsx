"use client"

import * as React from "react"
import { Search, ListFilter, BadgeCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function AuditFilters() {
  const [activeRange, setActiveRange] = React.useState("Today")

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Main Filter Panel */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm lg:col-span-3">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative w-full flex-1">
            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search personnel, machine IDs, or isolation types..."
              className="h-14 w-full rounded-2xl border-border bg-muted pl-12 text-sm focus-visible:ring-primary"
            />
          </div>

          <div className="flex w-full items-center gap-2 rounded-2xl bg-muted p-1.5 md:w-auto">
            {["Today", "Last 7 Days", "Isolation Type"].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={cn(
                  "flex-1 rounded-xl px-6 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all md:flex-none",
                  activeRange === range
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                )}
              >
                {range === "Isolation Type" ? (
                  <div className="flex items-center justify-center gap-2">
                    <ListFilter className="size-3" />
                    {range}
                  </div>
                ) : (
                  range
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Lockouts Status Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-lg shadow-primary/20 lg:col-span-1">
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black tracking-widest uppercase opacity-60">
              Active Lockouts
            </h4>
            <BadgeCheck className="size-5 text-primary-foreground/40" />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tighter">24</span>
            <span className="pb-1 text-[10px] font-bold tracking-widest uppercase opacity-60">
              Valid Logs
            </span>
          </div>
        </div>

        {/* Subtle Watermark Decoration */}
        <BadgeCheck className="absolute -right-6 -bottom-6 size-32 -rotate-12 text-white/10 transition-transform duration-700 group-hover:scale-110" />
      </div>
    </div>
  )
}
