"use client"

import * as React from "react"
import { Wifi } from "lucide-react"
import { MOCK_SYSTEM_DIAGNOSTICS } from "@/data/mock/dashboard"

export const MeshStatus = () => {
  const { mesh } = MOCK_SYSTEM_DIAGNOSTICS

  return (
    <div className="rounded-3xl border border-border bg-muted p-8 shadow-sm">
      <div className="space-y-1">
        <h4 className="text-xs font-black tracking-widest text-muted-foreground uppercase">
          Mesh Status
        </h4>
        <p className="text-xl font-black text-foreground">ESP-NOW Protocol</p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase">
            <span className="text-muted-foreground">Central Gateway</span>
            <span className="text-primary">{mesh.signal}% Signal</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
            <div
              className="h-full bg-primary"
              style={{ width: `${mesh.signal}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              Nodes
            </p>
            <p className="text-xl font-black text-foreground">{mesh.nodes}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              Latency
            </p>
            <div className="flex items-center gap-2">
              <Wifi className="size-4 text-primary" />
              <p className="text-xl font-black text-foreground">
                {mesh.latency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
