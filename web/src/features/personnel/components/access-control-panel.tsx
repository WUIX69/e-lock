"use client"

import * as React from "react"
import { Shield, Key, Fingerprint, Lock, ChevronRight } from "lucide-react"

export const AccessControlPanel = () => {
  return (
    <div className="rounded-3xl border border-border bg-sidebar p-8 text-sidebar-foreground shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <Shield className="size-6 text-sidebar-accent" />
        <h3 className="text-xl font-black tracking-tight text-white uppercase">
          Quick Access Protocols
        </h3>
      </div>

      <div className="space-y-4">
        {[
          {
            label: "Biometric Reset",
            icon: Fingerprint,
            desc: "Re-sync biometric tokens for all active nodes",
          },
          {
            label: "Mass Lockout",
            icon: Lock,
            desc: "Immediate isolation of all industrial zones",
            color: "text-destructive",
          },
          {
            label: "Keycard Enrollment",
            icon: Key,
            desc: "Assign new RFID tags to existing personnel",
          },
        ].map((action) => (
          <button
            key={action.label}
            className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:bg-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:bg-sidebar-accent group-hover:text-sidebar-accent-foreground">
                <action.icon className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p
                  className={`text-sm font-bold ${action.color || "text-white"}`}
                >
                  {action.label}
                </p>
                <p className="text-[10px] font-medium text-sidebar-foreground/40">
                  {action.desc}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-sidebar-foreground/20 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-sidebar-accent/20 bg-sidebar-accent/10 p-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="size-2 animate-pulse rounded-full bg-sidebar-accent" />
          <span className="text-[10px] font-black tracking-[0.2em] text-sidebar-accent uppercase">
            Live Security Feed
          </span>
        </div>
        <p className="text-xs leading-relaxed text-sidebar-foreground/60 italic">
          &quot;System integrity 100%. Node 04 reporting stable mesh
          connection.&quot;
        </p>
      </div>
    </div>
  )
}
