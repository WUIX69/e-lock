export type TaskPriority = "Routine" | "High" | "Critical"

export type TaskCategory =
  | "Preventative Maintenance"
  | "Emergency Repair"
  | "General Record / Log"
  | "Safety Inspection"

export interface CoWorker {
  id: string
  name: string
  role: string
}

export interface TaskFormData {
  deviceId: string
  taskType: TaskCategory
  subject: string
  priority: TaskPriority
  description: string
  attachments: File[]
  coWorker: CoWorker | null
}

export interface TaskRecord {
  id: string
  deviceId: string
  nodeName: string
  taskType: TaskCategory
  subject: string
  priority: TaskPriority
  description: string
  submittedBy: string
  coWorker: CoWorker | null
  submittedAt: string
  status: "completed" | "pending"
}
