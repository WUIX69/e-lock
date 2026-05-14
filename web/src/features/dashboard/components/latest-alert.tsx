"use client"

import * as React from "react"
import { BellRing } from "lucide-react"

export const LatestAlert = () => {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BellRing className="size-5 text-primary" />
          <h4 className="text-xs font-black uppercase tracking-widest text-foreground">
            Latest Alert
          </h4>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
          Logs
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium italic text-muted-foreground leading-relaxed">
          &quot;RFID tag verification requested at Node 04. Access granted to Alex T.&quot;
        </p>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
          12m ago
        </p>
      </div>
    </div>
  )
}
