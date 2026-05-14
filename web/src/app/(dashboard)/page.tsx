import { Metadata } from "next"
import { RealtimeStats } from "@/features/dashboard/components/realtime-stats"
import { VoltageChart } from "@/features/dashboard/components/voltage-chart"
import { ActivePersonnelList } from "@/features/dashboard/components/active-personnel-list"
import { MeshStatus } from "@/features/dashboard/components/mesh-status"
import { NodeDiagnostics } from "@/features/dashboard/components/node-diagnostics"
import { EnvironmentCard } from "@/features/dashboard/components/environment-card"
import { LatestAlert } from "@/features/dashboard/components/latest-alert"
import { ArrowRight, History } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard | E-LOCK Management",
  description: "E-LOCK Management Portal Dashboard overview",
}

export default function DashboardPage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Page Header (Subtle) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">
            System Overview
          </h2>
        </div>
        <Link 
          href="/audit" 
          className="flex items-center gap-2 text-xs font-bold text-primary hover:underline group"
        >
          <History className="size-4" />
          View Safety History
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Hero Section */}
      <RealtimeStats />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <VoltageChart />
        <ActivePersonnelList />
        <MeshStatus />
        <NodeDiagnostics />
        <EnvironmentCard />
        <LatestAlert />
      </div>

      {/* Footer Insight Section */}
      <div className="rounded-3xl bg-sidebar p-12 text-sidebar-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
           <div className="absolute top-0 right-0 size-96 rounded-full bg-sidebar-accent-foreground blur-[100px]" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl font-black tracking-tighter text-white">
              Compliance Reporting
            </h3>
            <p className="text-lg text-sidebar-foreground/60 leading-relaxed max-w-xl">
              Automatic generation of LOTO audit trails ready for ISO-45001 review.
              All biometric verification logs are immutable and timestamped via 
              ESP-NOW secure transmission.
            </p>
            <div className="flex gap-4">
              <button className="rounded-xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                Generate Report
              </button>
              <button className="rounded-xl border border-white/10 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors">
                Export Data
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Audit Score", value: "98/100" },
                { label: "Compliance", value: "100%" },
                { label: "Active Nodes", value: "12/12" },
                { label: "Last Sync", value: "Now" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <p className="text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-widest">
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
