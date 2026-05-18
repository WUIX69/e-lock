"use client"

import * as React from "react"
import { Activity, Signal, AlertTriangle, Router } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DEVICE_STATS } from "@/data/mock/devices"

export const DeviceStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <Card className="rounded-[2rem] border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300 h-40">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <Activity className="size-10 text-primary animate-pulse" />
          <div>
            <p className="text-3xl font-black text-foreground leading-none">
              {DEVICE_STATS.activeNodes}
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Active Nodes</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-border/50 hover:shadow-md hover:border-secondary/20 transition-all duration-300 h-40">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <Signal className="size-10 text-secondary" />
          <div>
            <p className="text-3xl font-black text-foreground leading-none">
              {DEVICE_STATS.avgMeshStrength}
              <span className="text-sm font-normal text-muted-foreground ml-1">dBm</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Avg. Mesh Strength</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-border/50 hover:shadow-md hover:border-destructive/20 transition-all duration-300 h-40">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <AlertTriangle className="size-10 text-destructive" />
          <div>
            <p className="text-3xl font-black text-destructive leading-none">
              {DEVICE_STATS.warnings}
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Warnings</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-border/50 hover:shadow-md hover:border-muted-foreground/20 transition-all duration-300 h-40">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <Router className="size-10 text-muted-foreground" />
          <div>
            <p className="text-3xl font-black text-foreground leading-none">
              {DEVICE_STATS.gateways}
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Gateways</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}