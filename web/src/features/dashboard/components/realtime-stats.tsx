"use client"

import * as React from "react"
import { AlertTriangle, Clock, ShieldCheck, Cpu } from "lucide-react"
import { MOCK_DASHBOARD_HERO } from "@/data/mock/dashboard"

export function RealtimeStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hero Status Card */}
      <div className="lg:col-span-2 rounded-[2rem] border border-border bg-muted p-10 shadow-sm relative overflow-hidden group">
        {/* Background Subtle Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Current Status
              </h4>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
                {MOCK_DASHBOARD_HERO.unitName} <span className="text-primary">{MOCK_DASHBOARD_HERO.unitId}</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
                {MOCK_DASHBOARD_HERO.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-accent px-6 py-4 text-accent-foreground shadow-sm">
              <ShieldCheck className="size-6" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  Safety State
                </span>
                <span className="text-lg font-black uppercase">{MOCK_DASHBOARD_HERO.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-card px-6 py-4 text-foreground shadow-sm border border-border">
              <Clock className="size-6 text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Time in State
                </span>
                <span className="text-lg font-black tracking-tight">{MOCK_DASHBOARD_HERO.timeInState}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <ShieldCheck className="absolute -bottom-10 -right-10 size-64 text-primary/5 -rotate-12 transition-transform group-hover:scale-110 duration-700" />
      </div>

      {/* Critical Action Card */}
      <div className="lg:col-span-1 rounded-[2rem] border border-border bg-sidebar p-10 shadow-xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full justify-between text-sidebar-foreground">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 flex items-center justify-center rounded-xl bg-white/10 text-sidebar-accent-foreground">
                <Cpu className="size-5" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/40">
                System Controls
              </h4>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tight text-white">
                Manual Shunt Trip
              </h3>
              <p className="text-sm text-sidebar-foreground/40 leading-relaxed">
                Emergency administrative override for primary facility power grid.
              </p>
            </div>
          </div>

          <button className="group relative w-full rounded-2xl bg-sidebar-accent-foreground py-6 text-sm font-black uppercase tracking-widest text-sidebar-accent shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span className="relative z-10 flex items-center justify-center gap-3">
              Trigger Override
              <AlertTriangle className="size-5 transition-transform group-hover:rotate-12" />
            </span>
          </button>
        </div>

        {/* Decorative Watermark */}
        <Cpu className="absolute -top-10 -left-10 size-48 text-white/5 rotate-45" />
      </div>
    </div>
  )
}
