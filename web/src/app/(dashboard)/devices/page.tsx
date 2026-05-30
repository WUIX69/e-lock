import { requireAuth } from "@/features/auth/server/actions/jwt"
import { getAllDevices } from "@/features/devices/server/db/devices"
import { Device, UserDevice, UserDeviceStatus } from "@/types/devices"
import { DevicesHeader } from "@/features/devices/components/devices-header"
import { DeviceStats } from "@/features/devices/components/device-stats"
import { DeviceTable } from "@/features/devices/components/device-table"
import { TopologyMap } from "@/features/devices/components/topology-map"
import { RecentEvents } from "@/features/devices/components/recent-events"
import { UserDevicesClient } from "@/features/devices/components/user-devices-client"

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 10) return "Just now"
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const STATUS_MAP: Record<string, UserDeviceStatus> = {
  active: "operational",
  warning: "maintenance",
  offline: "offline",
}

const DevicesPage = async () => {
  const session = await requireAuth()
  const dbDevices = await getAllDevices()

  if (session.role === "admin") {
    const devices: Device[] = dbDevices.map((d) => ({
      id: d.id,
      deviceId: d.deviceId,
      type: d.type,
      deviceUniqueName: d.deviceUniqueName,
      signalStrength: d.signalStrength ?? 0,
      lastHeartbeat: d.lastHeartbeatAt
        ? formatTimeAgo(d.lastHeartbeatAt)
        : "Unknown",
      status: d.status,
    }))

    return (
      <div className="space-y-8 pb-12">
        <DevicesHeader />
        <DeviceStats />
        <DeviceTable devices={devices} />
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

  const devices: UserDevice[] = dbDevices.map((d) => ({
    id: d.id,
    name: d.deviceUniqueName,
    deviceId: d.deviceId,
    sector: "Production",
    status: STATUS_MAP[d.status] ?? "offline",
    lastTechnician: "System",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
    uptime: d.status === "active" ? "99.9%" : undefined,
  }))

  return <UserDevicesClient devices={devices} />
}

export default DevicesPage
