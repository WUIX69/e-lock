"use client"

import * as React from "react"
import { AlertTriangle, ShieldCheck, Cpu, Lock } from "lucide-react"
import { MOCK_ADMIN_STATS } from "@/data/mock/dashboard"

export const RealtimeStats = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Safety & Diagnostics Overview Card */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-muted p-8 shadow-sm lg:col-span-2 md:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

        <div className="relative z-10 flex h-full flex-col justify-between gap-8 md:gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <h4 className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
                Live Overview
              </h4>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl leading-none font-black tracking-tight text-foreground md:text-4xl">
                Safety & Node Diagnostics
              </h2>
              <p className="max-w-xl text-xs leading-relaxed font-medium text-muted-foreground md:text-sm">
                Administrative monitoring of system lockouts, communication integrity, and safety anomalies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Active Lockouts */}
            <div className="group/stat relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5 flex flex-col justify-between gap-5">
              <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                Active Lockouts
              </span>
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {MOCK_ADMIN_STATS.activeLockouts.count}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    / {MOCK_ADMIN_STATS.activeLockouts.total} {MOCK_ADMIN_STATS.activeLockouts.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold tracking-wide text-lime-600 dark:text-lime-500">
                  {MOCK_ADMIN_STATS.activeLockouts.subtext}
                </p>
              </div>
              <div className="flex w-full items-center justify-center rounded-xl bg-muted/60 py-3 shadow-inner border border-border/20 group-hover/stat:bg-emerald-500/5 group-hover/stat:border-emerald-500/20 transition-all duration-300">
                <Lock className="size-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover/stat:scale-110" />
              </div>
            </div>

            {/* Anomalies Detected */}
            <div className="group/stat relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-rose-500/30 hover:shadow-md hover:shadow-rose-500/5 flex flex-col justify-between gap-5">
              <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                Anomalies Detected
              </span>
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-rose-600 dark:text-rose-500">
                    {MOCK_ADMIN_STATS.anomaliesDetected.count}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {MOCK_ADMIN_STATS.anomaliesDetected.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold tracking-wide text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  </span>
                  {MOCK_ADMIN_STATS.anomaliesDetected.subtext}
                </p>
              </div>
              <div className="flex w-full items-center justify-center rounded-xl bg-muted/60 py-3 shadow-inner border border-border/20 group-hover/stat:bg-rose-500/5 group-hover/stat:border-rose-500/20 transition-all duration-300">
                <AlertTriangle className="size-4 text-rose-600 dark:text-rose-500 transition-transform duration-300 group-hover/stat:-rotate-12" />
              </div>
            </div>

            {/* Node Diagnostics */}
            <div className="group/stat relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 flex flex-col justify-between gap-5">
              <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                Node Diagnostics
              </span>
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-primary">
                    {MOCK_ADMIN_STATS.nodeDiagnostics.count}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {MOCK_ADMIN_STATS.nodeDiagnostics.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold tracking-wide text-muted-foreground">
                  {MOCK_ADMIN_STATS.nodeDiagnostics.subtext}
                </p>
              </div>
              <div className="flex w-full items-center justify-center rounded-xl bg-muted/60 py-3 shadow-inner border border-border/20 group-hover/stat:bg-primary/5 group-hover/stat:border-primary/20 transition-all duration-300">
                <Cpu className="size-4 text-primary transition-transform duration-300 group-hover/stat:scale-110" />
              </div>
            </div>
          </div>
        </div>

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

        <Cpu className="absolute -top-10 -left-10 size-48 rotate-45 text-white/5" />
      </div>
    </div>
  )
}

