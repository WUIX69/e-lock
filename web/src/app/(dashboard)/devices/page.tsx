import { Metadata } from "next"
import { DeviceStats } from "@/features/devices/components/device-stats"
import { DeviceTable } from "@/features/devices/components/device-table"
import { TopologyMap } from "@/features/devices/components/topology-map"
import { RecentEvents } from "@/features/devices/components/recent-events"
import { RefreshCcw, PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Lockout Devices | E-LOCK Management",
  description: "Manage hardware nodes and ESP-NOW mesh network status",
}

export default function DevicesPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              Lockout Devices
            </h2>
          </div>
          <p className="ml-4 text-sm text-muted-foreground">
            Manage hardware nodes and ESP-NOW mesh network status.
          </p>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors active:scale-95">
            <RefreshCcw className="size-5" />
            Sync Device
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95">
            <PlusCircle className="size-5" />
            Register New Hardware
          </button>
        </div>
      </div>

      <DeviceStats />

      <DeviceTable />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TopologyMap />
        </div>
        <div>
          <RecentEvents />
        </div>
      </div>
    </div>
  )
}