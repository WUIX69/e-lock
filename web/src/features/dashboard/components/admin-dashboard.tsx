"use client"

import * as React from "react"
import { RealtimeStats } from "@/features/dashboard/components/realtime-stats"
import { ActivePersonnelList } from "@/features/dashboard/components/active-personnel-list"
import { LatestAlert } from "@/features/dashboard/components/latest-alert"
import { OnboardingCta } from "@/features/dashboard/components/onboarding-cta"
import { RecentLogs } from "@/features/dashboard/components/recent-logs"
import { DeviceDiagnostics } from "@/features/dashboard/components/device-diagnostics"
import { getAdminDashboardStatsAction } from "@/features/dashboard/server/actions/dashboard"

import { ArrowRight, History, LayoutGrid, Layers } from "lucide-react"
import Link from "next/link"
import { MOCK_COMPLIANCE_STATS } from "@/data/mock/dashboard"

interface DashboardStats {
  devices: {
    total: number
    active: number
    warning: number
    offline: number
    maintenance: number
  }
  tasks: {
    total: number
    pending: number
    completed: number
    denied: number
    cancelled: number
    relayFaults: number
  }
  personnel: {
    total: number
    admins: number
    users: number
    active: number
  }
}

export const AdminDashboard = () => {
  const [deviceDiagnosticsPosition, setDeviceDiagnosticsPosition] =
    React.useState<"top" | "bottom">("bottom")
  const [stats, setStats] = React.useState<DashboardStats | null>(null)

  React.useEffect(() => {
    getAdminDashboardStatsAction().then((res) => {
      if (!res.error) setStats(res as unknown as DashboardStats)
    })
  }, [])

  return (
    <div className="space-y-12 pb-12">
      {/* Page Header (Subtle & Dynamic) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-primary" />
          <h2 className="text-sm font-black tracking-[0.3em] text-muted-foreground uppercase">
            System Overview
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Bento Grid Layout Order Switcher */}
          <div
            className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm"
            role="radiogroup"
            aria-label="Device diagnostics layout position switcher"
          >
            <span className="hidden pr-1.5 pl-2.5 text-[9px] font-black tracking-widest text-muted-foreground uppercase lg:inline">
              Layout:
            </span>
            <button
              onClick={() => setDeviceDiagnosticsPosition("top")}
              role="radio"
              aria-checked={deviceDiagnosticsPosition === "top"}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all duration-200 ${
                deviceDiagnosticsPosition === "top"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3" />
              Integrity Top
            </button>
            <button
              onClick={() => setDeviceDiagnosticsPosition("bottom")}
              role="radio"
              aria-checked={deviceDiagnosticsPosition === "bottom"}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all duration-200 ${
                deviceDiagnosticsPosition === "bottom"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Layers className="size-3" />
              Integrity Bottom
            </button>
          </div>

          <Link
            href="/admin/audit"
            className="group flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-primary shadow-sm transition-colors hover:bg-muted"
          >
            <History className="size-4" />
            View Safety History
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <RealtimeStats
        activeLockouts={stats?.devices.maintenance}
        totalLockouts={stats?.devices.total}
        anomaliesDetected={stats?.tasks.relayFaults}
        deviceOnlineCount={stats?.devices.active}
        deviceTotal={stats?.devices.total}
      />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {deviceDiagnosticsPosition === "top" ? (
          <React.Fragment>
            <DeviceDiagnostics
              integrityStatus={
                stats?.devices
                  ? `${stats.devices.active}/${stats.devices.total} devices online`
                  : undefined
              }
            />
            <LatestAlert />
            <OnboardingCta />
            <ActivePersonnelList />
            <RecentLogs />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ActivePersonnelList />
            <RecentLogs />
            <DeviceDiagnostics
              integrityStatus={
                stats?.devices
                  ? `${stats.devices.active}/${stats.devices.total} devices online`
                  : undefined
              }
            />
            <LatestAlert />
            <OnboardingCta />
          </React.Fragment>
        )}
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
