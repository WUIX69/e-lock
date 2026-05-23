export type DeviceType = "field_controller" | "shunt_trip" | "gateway"
export type DeviceStatus = "active" | "warning" | "offline"

export interface Device {
  id: string
  deviceId: string
  type: DeviceType
  assignedMachine: string
  signalStrength: number
  lastHeartbeat: string
  status: DeviceStatus
}

export type UserDeviceStatus = "operational" | "offline" | "maintenance"

export interface UserDevice {
  id: string
  name: string
  deviceId: string
  sector: string
  status: UserDeviceStatus
  lastTechnician: string
  lastTechnicianAvatar: string
  uptime?: string
  loadStatus?: string
  alert?: string
}

export interface TaskSubmission {
  deviceId: string
  taskType: string
  subject: string
  priority: "Routine" | "High" | "Critical"
  description: string
  attachments: string[]
  coWorkerId?: string
  coWorkerName?: string
}

export type AddDeviceResult = { error?: string; success?: boolean }
