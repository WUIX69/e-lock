"use client"

import * as React from "react"
import { ShieldCheck } from "lucide-react"
import { MOCK_SYSTEM_DIAGNOSTICS } from "@/data/mock/dashboard"

export const NodeDiagnostics = () => {
  const { integrity } = MOCK_SYSTEM_DIAGNOSTICS

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
        <ShieldCheck className="size-6" />
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-black tracking-widest text-foreground uppercase">
            Node Integrity
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            All peripheral locking modules reporting {integrity.status}.
          </p>
        </div>

        <button className="text-[10px] font-black tracking-[0.2em] text-primary uppercase hover:underline">
          Run Diagnostic
        </button>
      </div>
    </div>
  )
}
