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
    deviceId: "NODE-42",
    type: "field_controller",
    assignedMachine: "Main Crusher #402",
    signalStrength: -48,
    lastHeartbeat: "2s ago",
    status: "active",
  },
  {
    id: "dev-002",
    deviceId: "NODE-89",
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
    deviceId: "NODE-114",
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
    message: "NODE-42 Re-synchronized",
    type: "success",
  },
  {
    id: "evt-002",
    timestamp: "14:15:33",
    message: "NODE-89 Low Signal Warning - Signal dropped below -90dBm",
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
    message: "New Hardware Paired - NODE-114 assigned to Ventilation 02",
    type: "success",
  },
]

export const DEVICE_STATS = {
  activeNodes: 42,
  avgMeshStrength: -64,
  warnings: 3,
  gateways: 5,
}
