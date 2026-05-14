"use client"

import * as React from "react"
import { BellRing } from "lucide-react"
import { MOCK_SYSTEM_DIAGNOSTICS } from "@/data/mock/dashboard"

export const LatestAlert = () => {
  const { latestAlert } = MOCK_SYSTEM_DIAGNOSTICS

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BellRing className="size-5 text-primary" />
          <h4 className="text-xs font-black tracking-widest text-foreground uppercase">
            Latest Alert
          </h4>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[8px] font-black tracking-widest text-muted-foreground uppercase">
          Logs
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs leading-relaxed font-medium text-muted-foreground italic">
          &quot;{latestAlert.message}&quot;
        </p>
        <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
          {latestAlert.time}
        </p>
      </div>
    </div>
  )
}
