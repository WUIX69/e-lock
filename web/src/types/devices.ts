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

export type AddDeviceResult = { error?: string; success?: boolean }
