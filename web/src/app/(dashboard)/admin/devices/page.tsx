import { Metadata } from "next"
import { DevicesHeader } from "@/features/devices/components/devices-header"
import { DeviceStats } from "@/features/devices/components/device-stats"
import { DeviceTable } from "@/features/devices/components/device-table"
import { TopologyMap } from "@/features/devices/components/topology-map"
import { RecentEvents } from "@/features/devices/components/recent-events"

export const metadata: Metadata = {
  title: "Lockout Devices | E-LOCK Management",
  description: "Manage hardware nodes and ESP-NOW mesh network status",
}

const DevicesPage = () => {
  return (
    <div className="space-y-8 pb-12">
      <DevicesHeader />

      <DeviceStats />

      <DeviceTable />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopologyMap />
        </div>
        <div>
          <RecentEvents />
        </div>
      </div>
    </div>
  )
}

export default DevicesPage
