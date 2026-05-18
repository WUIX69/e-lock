"use client"

import * as React from "react"
import { Activity, Signal, AlertTriangle, Router } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DEVICE_STATS } from "@/data/mock/devices"

export const DeviceStats = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
      <Card className="h-40 rounded-[2rem] border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-md">
        <CardContent className="flex h-full flex-col justify-between p-6">
          <Activity className="size-10 animate-pulse text-primary" />
          <div>
            <p className="text-3xl leading-none font-black text-foreground">
              {DEVICE_STATS.activeNodes}
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Active Nodes
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="h-40 rounded-[2rem] border border-border/50 transition-all duration-300 hover:border-secondary/20 hover:shadow-md">
        <CardContent className="flex h-full flex-col justify-between p-6">
          <Signal className="size-10 text-secondary" />
          <div>
            <p className="text-3xl leading-none font-black text-foreground">
              {DEVICE_STATS.avgMeshStrength}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                dBm
              </span>
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Avg. Mesh Strength
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="h-40 rounded-[2rem] border border-border/50 transition-all duration-300 hover:border-destructive/20 hover:shadow-md">
        <CardContent className="flex h-full flex-col justify-between p-6">
          <AlertTriangle className="size-10 text-destructive" />
          <div>
            <p className="text-3xl leading-none font-black text-destructive">
              {DEVICE_STATS.warnings}
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Warnings
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="h-40 rounded-[2rem] border border-border/50 transition-all duration-300 hover:border-muted-foreground/20 hover:shadow-md">
        <CardContent className="flex h-full flex-col justify-between p-6">
          <Router className="size-10 text-muted-foreground" />
          <div>
            <p className="text-3xl leading-none font-black text-foreground">
              {DEVICE_STATS.gateways}
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Gateways
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
