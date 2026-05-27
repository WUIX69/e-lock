"use client"

import { Inbox, ChevronDown } from "lucide-react"
import { NotificationCard } from "@/features/notifications/components/notification-card"
import type { NotificationItem } from "@/types/notifications"

interface NotificationListProps {
  notifications: NotificationItem[]
  isAdmin: boolean
  onDismiss: (id: string) => void
  onAction: (id: string) => void
}

export const NotificationList = ({
  notifications: notificationItems,
  isAdmin,
  onDismiss,
  onAction,
}: NotificationListProps) => {
  if (notificationItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <Inbox className="size-12" />
        <p className="text-sm font-medium">
          No notifications found in this category
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notificationItems.map((notificationItem) => (
        <NotificationCard
          key={notificationItem.id}
          notification={notificationItem}
          isAdmin={isAdmin}
          onDismiss={onDismiss}
          onAction={onAction}
        />
      ))}

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/20 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
        <ChevronDown className="size-4" />
        View Archive
      </button>
    </div>
  )
}
