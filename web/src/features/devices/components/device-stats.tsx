"use client"

import * as React from "react"
import { Activity, Signal, AlertTriangle, Router } from "lucide-react"
import { DEVICE_STATS } from "../data/mock-devices"

export function DeviceStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col justify-between h-40">
        <Activity className="size-10 text-primary" />
        <div>
          <p className="text-3xl font-black text-foreground leading-none">
            {DEVICE_STATS.activeNodes}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Active Nodes</p>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col justify-between h-40">
        <Signal className="size-10 text-secondary" />
        <div>
          <p className="text-3xl font-black text-foreground leading-none">
            {DEVICE_STATS.avgMeshStrength}
            <span className="text-sm font-normal ml-1">dBm</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">Avg. Mesh Strength</p>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col justify-between h-40">
        <AlertTriangle className="size-10 text-destructive" />
        <div>
          <p className="text-3xl font-black text-destructive leading-none">
            {DEVICE_STATS.warnings}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Warnings</p>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col justify-between h-40">
        <Router className="size-10 text-muted-foreground" />
        <div>
          <p className="text-3xl font-black text-foreground leading-none">
            {DEVICE_STATS.gateways}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Gateways</p>
        </div>
      </div>
    </div>
  )
}