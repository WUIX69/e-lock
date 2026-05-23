import { getAllDevices } from "@/features/devices/server/db/devices"
import { UserDevice, UserDeviceStatus } from "@/types/devices"
import { UserDevicesClient } from "@/features/devices/components/user-devices-client"

const STATUS_MAP: Record<string, UserDeviceStatus> = {
  active: "operational",
  warning: "maintenance",
  offline: "offline",
}

const DevicesPage = async () => {
  const dbDevices = await getAllDevices()

  const devices: UserDevice[] = dbDevices.map((d) => ({
    id: d.id,
    name: d.assignedMachine,
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
