import { UserDevice } from "@/types/devices"

export interface Device {
  id: string
  deviceId: string
  type: "field_controller" | "shunt_trip" | "gateway"
  assignedMachine: string
  signalStrength: number
  lastHeartbeat: string
  status: "active" | "warning" | "offline"
}

export const MOCK_DEVICES: Device[] = [
  {
    id: "dev-001",
    deviceId: "DEV-42",
    type: "field_controller",
    assignedMachine: "Main Crusher #402",
    signalStrength: -48,
    lastHeartbeat: "2s ago",
    status: "active",
  },
  {
    id: "dev-002",
    deviceId: "DEV-89",
    type: "shunt_trip",
    assignedMachine: "Secondary Conveyor",
    signalStrength: -92,
    lastHeartbeat: "45s ago",
    status: "warning",
  },
  {
    id: "dev-003",
    deviceId: "GTWY-01",
    type: "gateway",
    assignedMachine: "Central Hub A",
    signalStrength: 0,
    lastHeartbeat: "Just now",
    status: "active",
  },
  {
    id: "dev-004",
    deviceId: "DEV-114",
    type: "field_controller",
    assignedMachine: "Ventilation System 02",
    signalStrength: -72,
    lastHeartbeat: "8s ago",
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
    message: "DEV-42 Re-synchronized",
    type: "success",
  },
  {
    id: "evt-002",
    timestamp: "14:15:33",
    message: "DEV-89 Low Signal Warning - Signal dropped below -90dBm",
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
    message: "New Hardware Paired - DEV-114 assigned to Ventilation 02",
    type: "success",
  },
]

export const DEVICE_STATS = {
  activeNodes: 42,
  avgMeshStrength: -64,
  warnings: 3,
  gateways: 5,
}

export const MOCK_USER_DEVICES: UserDevice[] = [
  {
    id: "dev-001",
    name: "Milling Station Alpha",
    deviceId: "#ELK-9902-MS",
    sector: "Sector 7-G",
    status: "operational",
    lastTechnician: "Jared Vance",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=JaredVance",
    uptime: "99.98%",
  },
  {
    id: "dev-002",
    name: "Hydraulic Press 02",
    deviceId: "#ELK-1145-HP",
    sector: "Sector 4-B",
    status: "offline",
    lastTechnician: "Sarah Chen",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen",
    alert: "PRESSURE DROP",
  },
  {
    id: "dev-003",
    name: "Conveyor Main",
    deviceId: "#ELK-4421-CH",
    sector: "Logistics Hub",
    status: "operational",
    lastTechnician: "Mark Wilson",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=MarkWilson",
    loadStatus: "NORMAL (42%)",
  },
  {
    id: "dev-004",
    name: "HV Transformer-A",
    deviceId: "#ELK-8812-HV",
    sector: "Power Core",
    status: "operational",
    lastTechnician: "Alex Wong",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexWong",
    loadStatus: "42°C (STABLE)",
  },
  {
    id: "dev-005",
    name: "Sprayer Unit 04",
    deviceId: "#ELK-3029-SU",
    sector: "Paint Shop",
    status: "maintenance",
    lastTechnician: "Elena Rodriguez",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRodriguez",
    loadStatus: "NOW",
  },
]
