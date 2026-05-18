"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Lock, AlertTriangle, Shield, ArrowUpRight } from "lucide-react"
import { ENERGY_STATS } from "../data/mock-energy"

export const EnergyStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Points Card */}
      <Card className="relative overflow-hidden border border-border/50 bg-card text-card-foreground hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-110">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Active Points</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-foreground tracking-tight leading-none">
              {ENERGY_STATS.activePoints}
            </div>
            <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-3 w-3 shrink-0" />
              <span>{ENERGY_STATS.activePointsTrend}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Isolated Now Card */}
      <Card className="relative overflow-hidden border border-border/50 bg-card text-card-foreground hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 transition-transform group-hover:scale-110">
              <Lock className="h-5 w-5" />
            </div>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Isolated Now</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-foreground tracking-tight leading-none">
              {ENERGY_STATS.isolatedNow}
            </div>
            <div className="text-[11px] text-muted-foreground/80 font-medium mt-2">
              {ENERGY_STATS.isolatedNote}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts Card */}
      <Card className="relative overflow-hidden border border-border/50 bg-card text-card-foreground hover:border-destructive/30 transition-all duration-300 hover:shadow-md group">
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 transition-transform group-hover:scale-110">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Health Alerts</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-destructive tracking-tight leading-none">
              {ENERGY_STATS.healthAlerts}
            </div>
            <div className="text-[11px] text-destructive/80 font-medium mt-2">
              {ENERGY_STATS.healthAlertNote}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group">
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-primary-foreground border border-white/20 transition-transform group-hover:scale-110">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-primary-foreground/75 text-xs font-semibold tracking-wider uppercase">Compliance</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight leading-none">
              {ENERGY_STATS.compliance}%
            </div>
            <div className="text-[11px] text-primary-foreground/80 font-medium mt-2">
              {ENERGY_STATS.complianceNote}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}