import { getAllDevices } from "@/features/devices/server/db/devices"
import { NodeDevice, NodeStatus } from "@/types/nodes"
import { NodesClient } from "@/features/nodes/components/nodes-client"

const STATUS_MAP: Record<string, NodeStatus> = {
  active: "operational",
  warning: "maintenance",
  offline: "offline",
}

const NodesPage = async () => {
  const dbDevices = await getAllDevices()

  const nodes: NodeDevice[] = dbDevices.map((d) => ({
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

  return <NodesClient nodes={nodes} />
}

export default NodesPage
