"use client"

import * as React from "react"
import { RealtimeStats } from "@/features/dashboard/components/realtime-stats"
import { ActivePersonnelList } from "@/features/dashboard/components/active-personnel-list"
import { LatestAlert } from "@/features/dashboard/components/latest-alert"
import { OnboardingCta } from "@/features/dashboard/components/onboarding-cta"
import { RecentLogs } from "@/features/dashboard/components/recent-logs"
import { NodeDiagnostics } from "@/features/dashboard/components/node-diagnostics"

import { ArrowRight, History } from "lucide-react"
import Link from "next/link"
import { MOCK_COMPLIANCE_STATS } from "@/data/mock/dashboard"

export function AdminDashboard() {
  return (
    <div className="space-y-12 pb-12">
      {/* Page Header (Subtle) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-primary" />
          <h2 className="text-sm font-black tracking-[0.3em] text-muted-foreground uppercase">
            System Overview
          </h2>
        </div>
        <Link
          href="/audit"
          className="group flex items-center gap-2 text-xs font-bold text-primary hover:underline"
        >
          <History className="size-4" />
          View Safety History
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Hero Section */}
      <RealtimeStats />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ActivePersonnelList />
        <RecentLogs />
        <NodeDiagnostics />
        <LatestAlert />
        <OnboardingCta />
      </div>

      {/* Footer Insight Section */}
      <div className="relative overflow-hidden rounded-3xl bg-sidebar p-12 text-sidebar-foreground">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 size-96 rounded-full bg-sidebar-accent-foreground blur-[100px]" />
        </div>

        <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-4xl font-black tracking-tighter text-white">
              Compliance Reporting
            </h3>
            <p className="max-w-xl text-lg leading-relaxed text-sidebar-foreground/60">
              Automatic generation of LOTO audit trails ready for ISO-45001
              review. All biometric verification logs are immutable and
              timestamped via ESP-NOW secure transmission.
            </p>
            <div className="flex gap-4">
              <button className="rounded-xl bg-primary px-8 py-4 text-sm font-black tracking-widest text-primary-foreground uppercase shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Generate Report
              </button>
              <button className="rounded-xl border border-white/10 px-8 py-4 text-sm font-black tracking-widest text-white uppercase transition-colors hover:bg-white/5">
                Export Data
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {MOCK_COMPLIANCE_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-[10px] font-bold tracking-widest text-sidebar-foreground/40 uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
