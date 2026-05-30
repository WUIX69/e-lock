import { UserDevice } from "@/types/devices"

export interface Device {
  id: string
  deviceId: string
  type: "field_controller" | "shunt_trip" | "gateway"
  deviceUniqueName: string
  signalStrength: number
  lastHeartbeat: string
  status: "active" | "warning" | "offline"
}

export const MOCK_DEVICES: Device[] = [
  {
    id: "dev-001",
    deviceId: "DEV-FC01",
    type: "field_controller",
    deviceUniqueName: "Circuit Breaker Panel A",
    signalStrength: -48,
    lastHeartbeat: "2s ago",
    status: "active",
  },
  {
    id: "dev-002",
    deviceId: "DEV-FC02",
    type: "field_controller",
    deviceUniqueName: "Circuit Breaker Panel B",
    signalStrength: -55,
    lastHeartbeat: "5s ago",
    status: "active",
  },
  {
    id: "dev-003",
    deviceId: "GTWY-01",
    type: "gateway",
    deviceUniqueName: "Central Gateway",
    signalStrength: 0,
    lastHeartbeat: "Just now",
    status: "active",
  },
]

export interface DeviceEvent {
  id: string
  timestamp: string
  message: string
  type: "info" | "warning" | "success"
}

export const MOCK_DEVICE_EVENTS: DeviceEvent[] = [
  {
    id: "evt-001",
    timestamp: "14:22:10",
    message: "DEV-FC01 Re-synchronized",
    type: "success",
  },
  {
    id: "evt-002",
    timestamp: "14:15:33",
    message: "DEV-FC02 Low Signal Warning - Signal dropped below -90dBm",
    type: "warning",
  },
  {
    id: "evt-003",
    timestamp: "13:45:22",
    message: "GTWY-01 Firmware Updated - v2.4.1-stable deployed",
    type: "info",
  },
  {
    id: "evt-004",
    timestamp: "12:30:45",
    message: "New Hardware Paired - DEV-FC02 assigned to Circuit Breaker Panel B",
    type: "success",
  },
]

export const DEVICE_STATS = {
  activeNodes: 2,
  avgMeshStrength: -51,
  warnings: 0,
  gateways: 1,
}

export const MOCK_USER_DEVICES: UserDevice[] = [
  {
    id: "dev-001",
    name: "Circuit Breaker Panel A",
    deviceId: "DEV-FC01",
    sector: "Primary Distribution",
    status: "operational",
    lastTechnician: "Jared Vance",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=JaredVance",
    uptime: "99.98%",
  },
  {
    id: "dev-002",
    name: "Circuit Breaker Panel B",
    deviceId: "DEV-FC02",
    sector: "Secondary Distribution",
    status: "operational",
    lastTechnician: "Sarah Chen",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen",
    loadStatus: "NORMAL (42%)",
  },
  {
    id: "dev-003",
    name: "Central Gateway",
    deviceId: "GTWY-01",
    sector: "Network Core",
    status: "operational",
    lastTechnician: "Mark Wilson",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=MarkWilson",
    loadStatus: "STABLE",
  },
]
