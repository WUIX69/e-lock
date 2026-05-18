"use client"

import * as React from "react"
import { Zap, Lock, AlertTriangle, Shield } from "lucide-react"
import { ENERGY_STATS } from "../data/mock-energy"

export function EnergyStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-muted/30 rounded-xl p-6 border border-border/50 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-primary">
            <Zap className="size-6" />
          </span>
          <span className="text-muted-foreground text-xs">Active Points</span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black text-foreground">
            {ENERGY_STATS.activePoints}
          </div>
          <div className="text-xs text-primary flex items-center gap-1 mt-1">
            <span className="text-xs">↑</span>
            {ENERGY_STATS.activePointsTrend}
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-xl p-6 border border-border/50 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-secondary">
            <Lock className="size-6" />
          </span>
          <span className="text-muted-foreground text-xs">Isolated Now</span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black text-foreground">
            {ENERGY_STATS.isolatedNow}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {ENERGY_STATS.isolatedNote}
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-xl p-6 border border-border/50 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-destructive">
            <AlertTriangle className="size-6" />
          </span>
          <span className="text-muted-foreground text-xs">Health Alerts</span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black text-destructive">
            {ENERGY_STATS.healthAlerts}
          </div>
          <div className="text-xs text-destructive flex items-center gap-1 mt-1">
            <span className="text-xs">!</span>
            {ENERGY_STATS.healthAlertNote}
          </div>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground rounded-xl p-6 shadow-lg flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="">
            <Shield className="size-6" />
          </span>
          <span className="text-primary-foreground/60 text-xs">Compliance</span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-black">
            {ENERGY_STATS.compliance}%
          </div>
          <div className="text-xs text-primary-foreground/80 mt-1">
            {ENERGY_STATS.complianceNote}
          </div>
        </div>
      </div>
    </div>
  )
}