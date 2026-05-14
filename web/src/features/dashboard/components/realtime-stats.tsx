"use client"

import * as React from "react"
import { AlertTriangle, Clock, ShieldCheck, Cpu } from "lucide-react"
import { MOCK_DASHBOARD_HERO } from "@/data/mock/dashboard"

export function RealtimeStats() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Hero Status Card */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-muted p-10 shadow-sm lg:col-span-2">
        {/* Background Subtle Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

        <div className="relative z-10 flex h-full flex-col justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <h4 className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
                Current Status
              </h4>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl leading-none font-black tracking-tighter text-foreground md:text-6xl">
                {MOCK_DASHBOARD_HERO.unitName}{" "}
                <span className="text-primary">
                  {MOCK_DASHBOARD_HERO.unitId}
                </span>
              </h2>
              <p className="max-w-xl text-base leading-relaxed font-medium text-muted-foreground md:text-lg">
                {MOCK_DASHBOARD_HERO.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-accent px-6 py-4 text-accent-foreground shadow-sm">
              <ShieldCheck className="size-6" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-60">
                  Safety State
                </span>
                <span className="text-lg font-black uppercase">
                  {MOCK_DASHBOARD_HERO.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-4 text-foreground shadow-sm">
              <Clock className="size-6 text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                  Time in State
                </span>
                <span className="text-lg font-black tracking-tight">
                  {MOCK_DASHBOARD_HERO.timeInState}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <ShieldCheck className="absolute -right-10 -bottom-10 size-64 -rotate-12 text-primary/5 transition-transform duration-700 group-hover:scale-110" />
      </div>

      {/* Critical Action Card */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-sidebar p-10 shadow-xl lg:col-span-1">
        <div className="relative z-10 flex h-full flex-col justify-between text-sidebar-foreground">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-sidebar-accent-foreground">
                <Cpu className="size-5" />
              </div>
              <h4 className="text-[10px] font-black tracking-[0.2em] text-sidebar-foreground/40 uppercase">
                System Controls
              </h4>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tight text-white">
                Manual Shunt Trip
              </h3>
              <p className="text-sm leading-relaxed text-sidebar-foreground/40">
                Emergency administrative override for primary facility power
                grid.
              </p>
            </div>
          </div>

          <button className="group relative w-full rounded-2xl bg-sidebar-accent-foreground py-6 text-sm font-black tracking-widest text-sidebar-accent uppercase shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span className="relative z-10 flex items-center justify-center gap-3">
              Trigger Override
              <AlertTriangle className="size-5 transition-transform group-hover:rotate-12" />
            </span>
          </button>
        </div>

        {/* Decorative Watermark */}
        <Cpu className="absolute -top-10 -left-10 size-48 rotate-45 text-white/5" />
      </div>
    </div>
  )
}
