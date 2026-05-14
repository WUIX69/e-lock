"use client"

import * as React from "react"
import { BadgeCheck, Fingerprint, Scale } from "lucide-react"

export const ComplianceSummary = () => {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-sidebar p-8 text-sidebar-foreground shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />

      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black tracking-[0.2em] text-sidebar-accent-foreground uppercase">
            Compliance Summary
          </h4>
          <div className="rounded-full bg-primary px-3 py-1 text-[10px] font-black tracking-widest text-primary-foreground uppercase shadow-lg shadow-primary/20">
            ISO-45001 Ready
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors hover:bg-white/10">
            <div className="rounded-xl bg-white/10 p-3">
              <Fingerprint className="size-6 text-sidebar-accent-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">
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
              <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                LOTO Audit Score
              </p>
              <p className="text-2xl font-black text-white">98 / 100</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Scale className="mt-1 size-5 shrink-0 text-sidebar-accent-foreground" />
          <p className="text-xs leading-relaxed text-sidebar-foreground/60 italic">
            &quot;Administrative protocols observed are consistent with
            high-risk industrial isolation standards and biometric-enforced
            safety policies.&quot;
          </p>
        </div>
      </div>

      <Scale className="absolute -right-10 -bottom-10 size-48 -rotate-12 text-white/5 transition-transform duration-700 group-hover:rotate-0" />
    </div>
  )
}
