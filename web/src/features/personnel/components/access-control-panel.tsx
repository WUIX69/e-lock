"use client"

import * as React from "react"
import { Shield, Key, Fingerprint, Lock, ChevronRight } from "lucide-react"

export const AccessControlPanel = () => {
  return (
    <div className="rounded-3xl border border-border bg-sidebar p-8 text-sidebar-foreground shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="size-6 text-sidebar-accent" />
        <h3 className="text-xl font-black tracking-tight text-white uppercase">
          Quick Access Protocols
        </h3>
      </div>

      <div className="space-y-4">
        {[
          { label: "Biometric Reset", icon: Fingerprint, desc: "Re-sync biometric tokens for all active nodes" },
          { label: "Mass Lockout", icon: Lock, desc: "Immediate isolation of all industrial zones", color: "text-destructive" },
          { label: "Keycard Enrollment", icon: Key, desc: "Assign new RFID tags to existing personnel" },
        ].map((action) => (
          <button
            key={action.label}
            className="group w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-sidebar-accent group-hover:text-sidebar-accent-foreground transition-colors">
                <action.icon className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className={`text-sm font-bold ${action.color || 'text-white'}`}>
                  {action.label}
                </p>
                <p className="text-[10px] text-sidebar-foreground/40 font-medium">
                  {action.desc}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-sidebar-foreground/20 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-sidebar-accent/10 border border-sidebar-accent/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-sidebar-accent animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-accent">
            Live Security Feed
          </span>
        </div>
        <p className="text-xs text-sidebar-foreground/60 leading-relaxed italic">
          &quot;System integrity 100%. Node 04 reporting stable mesh connection.&quot;
        </p>
      </div>
    </div>
  )
}
