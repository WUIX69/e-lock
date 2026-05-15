import { LucideIcon } from "lucide-react"

export interface AssignedMachine {
  name: string
  id: string
  zone: string
  sector: string
  runtime: string
  isolationStatus: "ENERGIZED" | "ISOLATED" | "TRIPPED"
  signalLatency: string
  relayHealth: "NOMINAL" | "CRITICAL" | "WARNING"
  imageUrl: string
}

export interface FailSafeHardwareRow {
  label: string
  icon: LucideIcon
  statusLabel: string
  statusVariant: "ready" | "synced" | "error"
}

export interface TelemetrySample {
  time: number
  voltage: number
}

export interface MaintenanceTask {
  id: string
  label: string
  state: "done" | "next" | "pending"
  timestamp?: string
}

export interface MaintenanceTicket {
  ticketId: string
  tasks: MaintenanceTask[]
}
