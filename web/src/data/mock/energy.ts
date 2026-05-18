export interface EnergySource {
  id: string
  name: string
  type: "electrical" | "pneumatic" | "hydraulic" | "chemical"
  location: string
  gridZone: string
  hardwareNode: string
  status: "connected" | "isolated" | "warning"
}

export const MOCK_ENERGY_SOURCES: EnergySource[] = [
  {
    id: "SRC-EL-001",
    name: "Main Transformer Alpha",
    type: "electrical",
    location: "Substation 1",
    gridZone: "Grid Zone A",
    hardwareNode: "F.C. Node 12",
    status: "connected",
  },
  {
    id: "SRC-PN-045",
    name: "Compressor Pump Beta",
    type: "pneumatic",
    location: "Assembly Hall 4",
    gridZone: "North Bay",
    hardwareNode: "F.C. Node 08",
    status: "isolated",
  },
  {
    id: "SRC-HY-112",
    name: "Hydraulic Lift Sys",
    type: "hydraulic",
    location: "Cargo Dock 2",
    gridZone: "Maintenance Deck",
    hardwareNode: "F.C. Node 31",
    status: "connected",
  },
  {
    id: "SRC-CH-882",
    name: "Main Gas Valve 02",
    type: "chemical",
    location: "Utility Corridor",
    gridZone: "Restricted Access",
    hardwareNode: "F.C. Node 02",
    status: "connected",
  },
]

export interface HardwareNode {
  id: string
  signalStrength: number
  status: "online" | "warning" | "offline"
}

export const MOCK_HARDWARE_NODES: HardwareNode[] = [
  { id: "Node 12", signalStrength: 98, status: "online" },
  { id: "Node 08", signalStrength: 94, status: "online" },
  { id: "Node 31", signalStrength: 42, status: "warning" },
  { id: "Node 02", signalStrength: 87, status: "online" },
]

export const ENERGY_STATS = {
  activePoints: 142,
  activePointsTrend: "+3 this month",
  isolatedNow: 12,
  isolatedNote: "Maintenance in progress",
  healthAlerts: 2,
  healthAlertNote: "Check Node 12",
  compliance: 100,
  complianceNote: "OSHA Standard Certified",
}
