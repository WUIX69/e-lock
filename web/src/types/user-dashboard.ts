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

export interface LockoutInvitation {
  zoneId: string
  equipmentName: string
  inviterName: string
  participantCount: number
}

export type LockoutStatus = "maintenance_in_progress" | "awaiting_verification"

export interface ActiveLockout {
  id: string
  zoneId: string
  assetName: string
  isolatedAt: string
  duration: string
  status: LockoutStatus
  isVisible: boolean
}
