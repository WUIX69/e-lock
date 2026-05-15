"use client"

import * as React from "react"
import { Fingerprint, Power, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

import { FailSafeHardwareRow } from "@/types/user-dashboard"

export function LotoControlPanel({ loto }: { loto: FailSafeHardwareRow[] }) {
  return (
    <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
      {/* Biometric Card */}
      <div className="group relative flex flex-col items-center justify-center rounded-3xl border-2 border-secondary bg-secondary/10 p-10 text-center shadow-xl transition-all hover:bg-secondary/20">
        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
        
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-secondary text-white shadow-lg ring-8 ring-secondary/20">
          <Fingerprint className="size-10" />
        </div>

        <h3 className="text-2xl font-black tracking-tight text-foreground">
          Initiate LOTO
        </h3>
        <p className="mt-2 text-xs font-medium text-muted-foreground max-w-[200px]">
          Requires AS608 Biometric Verification to Isolate Power
        </p>

        <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-secondary py-5 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-secondary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Power className="size-5" />
          Begin Sequence
        </button>

        <div className="mt-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase opacity-60">
          <Lock className="size-3" />
          Failsafe Protocol Active
        </div>
      </div>

      {/* Hardware Status List */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
          Fail-Safe Hardware
        </h4>
        
        <div className="space-y-4">
          {loto.map((hw) => (
            <div key={hw.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
                  <hw.icon className={cn("size-5", hw.statusVariant === "ready" ? "text-primary" : "text-secondary")} />
                </div>
                <span className="text-sm font-bold text-foreground">{hw.label}</span>
              </div>
              <span className={cn(
                "rounded px-2 py-1 text-[10px] font-black tracking-widest uppercase",
                hw.statusVariant === "ready" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
              )}>
                {hw.statusLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
