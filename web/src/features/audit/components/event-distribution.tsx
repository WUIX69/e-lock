"use client"

import * as React from "react"
import { TrendingUp, Activity } from "lucide-react"

export const EventDistribution = () => {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="size-5 text-primary" />
          <h4 className="text-xs font-black tracking-widest text-foreground uppercase">
            Event Distribution
          </h4>
        </div>
      </div>

      <div className="group relative mt-8 flex aspect-video items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border">
        <div className="absolute inset-0 bg-muted/30 opacity-50 transition-opacity group-hover:opacity-100" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
            <Activity className="size-6 animate-pulse text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">
              Generating Real-time Analysis...
            </p>
            <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
              Compiling node signal density
            </p>
          </div>

          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-border">
            <div className="h-full w-[65%] animate-[shimmer_2s_infinite] bg-primary" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
