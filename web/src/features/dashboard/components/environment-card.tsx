"use client"

import * as React from "react"
import { Thermometer } from "lucide-react"

export const EnvironmentCard = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="relative z-10 space-y-1">
        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Internal Temp
        </h4>
        <p className="text-4xl font-black text-foreground tracking-tighter">32.4°C</p>
      </div>
      
      <div className="mt-4 relative z-10 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Within Specs
        </span>
      </div>

      <Thermometer className="absolute -bottom-4 -right-4 size-24 text-primary/5 -rotate-12" />
    </div>
  )
}
