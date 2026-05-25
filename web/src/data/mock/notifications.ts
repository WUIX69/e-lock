import { NotificationItem } from "@/types/notifications"

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "CRITICAL: Zone 4 Humidity (High)",
    description:
      "Humidity levels in Zone 4 have exceeded safe thresholds. Immediate attention required to prevent equipment damage.",
    category: "safety_alert",
    severity: "critical",
    timestamp: "2m ago",
    isRead: false,
    actionLabel: "Emergency Protocol",
  },
  {
    id: "notif-2",
    title: "New Lockout by Alex Rivera",
    description:
      "Lockout/Tagout procedure initiated on Field Panel C. Biometric verification pending.",
    category: "task_update",
    severity: "warning",
    timestamp: "14m ago",
    isRead: false,
    actorName: "Alex Rivera",
  },
  {
    id: "notif-3",
    title: "Field-Ctrl-B Resync Complete",
    description:
      "Field controller B has successfully resynchronized with the central monitoring system after a brief network interruption.",
    category: "system_health",
    severity: "info",
    timestamp: "1h ago",
    isRead: false,
  },
  {
    id: "notif-4",
    title: "Generator Unit 4 Verified",
    description:
      "Routine verification of Generator Unit 4 completed. All safety protocols confirmed operational.",
    category: "task_update",
    severity: "info",
    timestamp: "4h ago",
    isRead: true,
    actorName: "System",
  },
  {
    id: "notif-5",
    title: "Automated DB Backup Successful",
    description:
      "Scheduled automated database backup completed successfully. All access logs and lockout records preserved.",
    category: "system_health",
    severity: "default",
    timestamp: "Yesterday",
    isRead: true,
  },
]
