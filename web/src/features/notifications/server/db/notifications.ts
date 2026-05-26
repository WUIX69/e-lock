import { db } from "@/drizzle/db"
import { NotificationTable } from "@/drizzle/schema"
import { eq, and, desc, count } from "drizzle-orm"

export interface CreateNotificationInput {
  recipientId: string
  title: string
  description: string
  category: "safety_alert" | "task_update" | "system_health"
  severity: "critical" | "warning" | "info" | "default"
  actionLabel?: string
  actorName?: string
}

export async function createNotification(data: CreateNotificationInput) {
  const [notification] = await db
    .insert(NotificationTable)
    .values({
      recipientId: data.recipientId,
      title: data.title,
      description: data.description,
      category: data.category,
      severity: data.severity,
      actionLabel: data.actionLabel ?? null,
      actorName: data.actorName ?? null,
    })
    .returning()

  return notification
}

export async function getNotificationsForUser(userId: string) {
  const notifications = await db
    .select()
    .from(NotificationTable)
    .where(eq(NotificationTable.recipientId, userId))
    .orderBy(desc(NotificationTable.createdAt))

  return notifications
}

export async function markNotificationAsRead(id: string, userId: string) {
  const [updated] = await db
    .update(NotificationTable)
    .set({ isRead: true })
    .where(
      and(
        eq(NotificationTable.id, id),
        eq(NotificationTable.recipientId, userId)
      )
    )
    .returning()

  return updated
}

export async function markAllNotificationsAsReadForUser(userId: string) {
  await db
    .update(NotificationTable)
    .set({ isRead: true })
    .where(eq(NotificationTable.recipientId, userId))
}

export async function getUnreadNotificationsCountForUser(userId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(NotificationTable)
    .where(
      and(
        eq(NotificationTable.recipientId, userId),
        eq(NotificationTable.isRead, false)
      )
    )

  return result?.count ?? 0
}

export async function deleteNotification(id: string, userId: string) {
  await db
    .delete(NotificationTable)
    .where(
      and(
        eq(NotificationTable.id, id),
        eq(NotificationTable.recipientId, userId)
      )
    )
}
