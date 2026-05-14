"use client"

import * as React from "react"
import { Wifi } from "lucide-react"

export const MeshStatus = () => {
  return (
    <div className="rounded-3xl border border-border bg-muted p-8 shadow-sm">
      <div className="space-y-1">
        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Mesh Status
        </h4>
        <p className="text-xl font-black text-foreground">ESP-NOW Protocol</p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-muted-foreground">Central Gateway</span>
            <span className="text-primary">94% Signal</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-border/50 overflow-hidden">
            <div className="h-full w-[94%] bg-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Nodes</p>
            <p className="text-xl font-black text-foreground">12</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Latency</p>
            <div className="flex items-center gap-2">
              <Wifi className="size-4 text-primary" />
              <p className="text-xl font-black text-foreground">12ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
