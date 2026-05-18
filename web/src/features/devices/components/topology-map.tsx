"use client"

import * as React from "react"
import { Lock, Router, AlertTriangle } from "lucide-react"

export function TopologyMap() {
  return (
    <div className="bg-card rounded-[2rem] shadow-lg p-8 border border-border/20">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Topology Map</h3>
          <p className="text-sm text-muted-foreground">
            Real-time ESP-NOW node relationship visualization
          </p>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
          LIVE SCAN
        </span>
      </div>

      <div className="aspect-video bg-muted rounded-3xl overflow-hidden relative border border-border/20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#006b2c 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl z-10">
          <Router className="size-8" />
        </div>

        <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-secondary rounded-full border-4 border-white flex items-center justify-center text-secondary-foreground shadow-md">
          <Lock className="size-5" style={{ fill: "currentColor" }} />
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-secondary rounded-full border-4 border-white flex items-center justify-center text-secondary-foreground shadow-md">
          <Lock className="size-5" style={{ fill: "currentColor" }} />
        </div>
        <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-destructive rounded-full border-4 border-white flex items-center justify-center text-destructive-foreground shadow-md">
          <AlertTriangle className="size-5" />
        </div>

        <div className="absolute bottom-4 left-4 p-4 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-border/20 max-w-xs">
          <p className="text-xs font-bold text-muted-foreground mb-2">LEGEND</p>
          <div className="flex items-center gap-4 text-xs text-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Gateway
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Active Node
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              Warning
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}