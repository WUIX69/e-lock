"use client"

import * as React from "react"
import { Thermometer } from "lucide-react"
import { MOCK_SYSTEM_DIAGNOSTICS } from "@/data/mock/dashboard"

export const EnvironmentCard = () => {
  const { environment } = MOCK_SYSTEM_DIAGNOSTICS

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="relative z-10 space-y-1">
        <h4 className="text-xs font-black tracking-widest text-muted-foreground uppercase">
          Internal Temp
        </h4>
        <p className="text-4xl font-black tracking-tighter text-foreground">
          {environment.temp}
        </p>
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          {environment.status}
        </span>
      </div>

      <Thermometer className="absolute -right-4 -bottom-4 size-24 -rotate-12 text-primary/5" />
    </div>
  )
}
