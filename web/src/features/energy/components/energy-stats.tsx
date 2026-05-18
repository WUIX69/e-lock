"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Lock, AlertTriangle, Shield, ArrowUpRight } from "lucide-react"
import { ENERGY_STATS } from "@/data/mock/energy"

export const EnergyStats = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Active Points Card */}
      <Card className="group relative overflow-hidden border border-border/50 bg-card text-card-foreground transition-all duration-300 hover:border-primary/30 hover:shadow-md">
        <CardContent className="flex h-full min-h-[140px] flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Active Points
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl leading-none font-black tracking-tight text-foreground">
              {ENERGY_STATS.activePoints}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-500">
              <ArrowUpRight className="h-3 w-3 shrink-0" />
              <span>{ENERGY_STATS.activePointsTrend}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Isolated Now Card */}
      <Card className="group relative overflow-hidden border border-border/50 bg-card text-card-foreground transition-all duration-300 hover:border-primary/30 hover:shadow-md">
        <CardContent className="flex h-full min-h-[140px] flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
              <Lock className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Isolated Now
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl leading-none font-black tracking-tight text-foreground">
              {ENERGY_STATS.isolatedNow}
            </div>
            <div className="mt-2 text-[11px] font-medium text-muted-foreground/80">
              {ENERGY_STATS.isolatedNote}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts Card */}
      <Card className="group relative overflow-hidden border border-border/50 bg-card text-card-foreground transition-all duration-300 hover:border-destructive/30 hover:shadow-md">
        <CardContent className="flex h-full min-h-[140px] flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive transition-transform group-hover:scale-110">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Health Alerts
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl leading-none font-black tracking-tight text-destructive">
              {ENERGY_STATS.healthAlerts}
            </div>
            <div className="mt-2 text-[11px] font-medium text-destructive/80">
              {ENERGY_STATS.healthAlertNote}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Card */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        <CardContent className="flex h-full min-h-[140px] flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-primary-foreground transition-transform group-hover:scale-110">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-primary-foreground/75 uppercase">
              Compliance
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl leading-none font-black tracking-tight">
              {ENERGY_STATS.compliance}%
            </div>
            <div className="mt-2 text-[11px] font-medium text-primary-foreground/80">
              {ENERGY_STATS.complianceNote}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
