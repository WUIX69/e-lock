"use client"

import * as React from "react"
import { Search, ListFilter, BadgeCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function AuditFilters() {
  const [activeRange, setActiveRange] = React.useState("Today")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Filter Panel */}
      <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Search personnel, machine IDs, or isolation types..."
              className="h-14 w-full rounded-2xl border-border bg-muted pl-12 text-sm focus-visible:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted w-full md:w-auto">
            {["Today", "Last 7 Days", "Isolation Type"].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={cn(
                  "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeRange === range
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                {range === "Isolation Type" ? (
                  <div className="flex items-center justify-center gap-2">
                    <ListFilter className="size-3" />
                    {range}
                  </div>
                ) : range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Lockouts Status Card */}
      <div className="lg:col-span-1 rounded-3xl bg-primary p-8 text-primary-foreground shadow-lg shadow-primary/20 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Active Lockouts
            </h4>
            <BadgeCheck className="size-5 text-primary-foreground/40" />
          </div>
          
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tighter">24</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 pb-1">
              Valid Logs
            </span>
          </div>
        </div>
        
        {/* Subtle Watermark Decoration */}
        <BadgeCheck className="absolute -bottom-6 -right-6 size-32 text-white/10 -rotate-12 transition-transform group-hover:scale-110 duration-700" />
      </div>
    </div>
  )
}
