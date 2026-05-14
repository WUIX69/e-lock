"use client"

import * as React from "react"
import { TrendingUp, Activity } from "lucide-react"

export const EventDistribution = () => {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="size-5 text-primary" />
          <h4 className="text-xs font-black uppercase tracking-widest text-foreground">
            Event Distribution
          </h4>
        </div>
      </div>

      <div className="mt-8 relative aspect-video rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-muted/30 opacity-50 transition-opacity group-hover:opacity-100" />
        
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="size-12 rounded-full bg-background flex items-center justify-center shadow-sm">
            <Activity className="size-6 text-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">Generating Real-time Analysis...</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Compiling node signal density
            </p>
          </div>
          
          <div className="w-48 h-1.5 rounded-full bg-border overflow-hidden">
            <div className="h-full w-[65%] bg-primary animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
