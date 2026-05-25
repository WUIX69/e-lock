export type NotificationCategory = "all" | "safety_alert" | "task_update" | "system_health"

export type NotificationSeverity = "critical" | "warning" | "info" | "default"

export interface NotificationItem {
  id: string
  title: string
  description: string
  category: NotificationCategory
  severity: NotificationSeverity
  timestamp: string
  isRead: boolean
  actionLabel?: string
  actorName?: string
}

export interface CategoryCountSummary {
  category: NotificationCategory
  label: string
  count: number
  description: string
}
