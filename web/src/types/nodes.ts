export type NodeStatus = "operational" | "offline" | "maintenance"

export interface NodeDevice {
  id: string
  name: string
  deviceId: string
  sector: string
  status: NodeStatus
  lastTechnician: string
  lastTechnicianAvatar: string
  uptime?: string
  loadStatus?: string
  alert?: string
}

export interface NodeTaskSubmission {
  nodeId: string
  taskType: string
  subject: string
  priority: "Routine" | "High" | "Critical"
  description: string
  attachments: string[]
  coWorkerId?: string
  coWorkerName?: string
}
