export type TaskPriority = "Routine" | "High" | "Critical"

export type TaskCategory =
  | "Preventative Maintenance"
  | "Emergency Repair"
  | "General Record / Log"
  | "Safety Inspection"

export type TaskStatus = "pending" | "completed" | "cancelled"

export interface CoWorker {
  id: string
  name: string
  role: string
  employeeId?: string
}

export interface TaskFormData {
  deviceId: string
  taskType: TaskCategory
  subject: string
  priority: TaskPriority
  description: string
  coWorkers: CoWorker[]
  attachments?: string[]
}

export interface AddTaskResult {
  error?: string
  success?: boolean
}

export interface TaskRecord {
  id: string
  deviceId: string
  userId: string
  taskType: string
  subject: string
  priority: TaskPriority
  description: string | null
  coWorkers: { id: string; name: string }[]
  status: TaskStatus
  submittedAt: string
  updatedAt: string
}
