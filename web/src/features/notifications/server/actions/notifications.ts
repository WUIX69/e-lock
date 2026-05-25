"use server"

import { revalidatePath } from "next/cache"
import { getSessionAction } from "@/features/auth/server/actions/auth"
import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsReadForUser,
  deleteNotification,
} from "@/features/notifications/server/db/notifications"
import type { NotificationItem } from "@/types/notifications"

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function mapDbNotificationToItem(n: {
  id: string
  title: string
  description: string
  category: "safety_alert" | "task_update" | "system_health"
  severity: "critical" | "warning" | "info" | "default"
  isRead: boolean
  actionLabel: string | null
  actorName: string | null
  createdAt: Date
}): NotificationItem {
  return {
    id: n.id,
    title: n.title,
    description: n.description,
    category: n.category,
    severity: n.severity,
    isRead: n.isRead,
    actionLabel: n.actionLabel ?? undefined,
    actorName: n.actorName ?? undefined,
    timestamp: formatTimestamp(n.createdAt),
  }
}

export async function getNotificationsAction(): Promise<{
  success?: true
  notifications?: NotificationItem[]
  error?: string
}> {
  try {
    const session = await getSessionAction()
    if (!session) {
      return { error: "You must be logged in." }
    }

    const notifications = await getNotificationsForUser(session.sub)
    const items = notifications.map(mapDbNotificationToItem)

    return { success: true, notifications: items }
  } catch (error) {
    console.error("Get notifications error:", error)
    return { error: "Failed to load notifications." }
  }
}

export async function markNotificationReadAction(id: string): Promise<{
  success?: true
  error?: string
}> {
  try {
    const session = await getSessionAction()
    if (!session) {
      return { error: "You must be logged in." }
    }

    await markNotificationAsRead(id, session.sub)
    revalidatePath("/notifications")
    return { success: true }
  } catch (error) {
    console.error("Mark notification read error:", error)
    return { error: "Failed to mark notification as read." }
  }
}

export async function markAllNotificationsReadAction(): Promise<{
  success?: true
  error?: string
}> {
  try {
    const session = await getSessionAction()
    if (!session) {
      return { error: "You must be logged in." }
    }

    await markAllNotificationsAsReadForUser(session.sub)
    revalidatePath("/notifications")
    return { success: true }
  } catch (error) {
    console.error("Mark all notifications read error:", error)
    return { error: "Failed to mark all notifications as read." }
  }
}

export async function dismissNotificationAction(id: string): Promise<{
  success?: true
  error?: string
}> {
  try {
    const session = await getSessionAction()
    if (!session) {
      return { error: "You must be logged in." }
    }

    await deleteNotification(id, session.sub)
    revalidatePath("/notifications")
    return { success: true }
  } catch (error) {
    console.error("Dismiss notification error:", error)
    return { error: "Failed to dismiss notification." }
  }
}
