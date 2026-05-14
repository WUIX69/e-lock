"use client"

import * as React from "react"
import { BadgeCheck, Fingerprint, Scale } from "lucide-react"

export const ComplianceSummary = () => {
  return (
    <div className="rounded-3xl bg-sidebar p-8 text-sidebar-foreground shadow-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-sidebar-accent-foreground">
            Compliance Summary
          </h4>
          <div className="rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20">
            ISO-45001 Ready
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors hover:bg-white/10">
            <div className="rounded-xl bg-white/10 p-3">
              <Fingerprint className="size-6 text-sidebar-accent-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Biometric Fidelity
              </p>
              <p className="text-2xl font-black text-white">99.8%</p>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors hover:bg-white/10">
            <div className="rounded-xl bg-white/10 p-3">
              <BadgeCheck className="size-6 text-sidebar-accent-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                LOTO Audit Score
              </p>
              <p className="text-2xl font-black text-white">98 / 100</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Scale className="size-5 text-sidebar-accent-foreground shrink-0 mt-1" />
          <p className="text-xs italic text-sidebar-foreground/60 leading-relaxed">
            &quot;Administrative protocols observed are consistent with high-risk 
            industrial isolation standards and biometric-enforced safety policies.&quot;
          </p>
        </div>
      </div>

      <Scale className="absolute -bottom-10 -right-10 size-48 text-white/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
    </div>
  )
}
