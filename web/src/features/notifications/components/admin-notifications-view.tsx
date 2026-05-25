"use client"

import * as React from "react"
import { NotificationPageHeader } from "@/features/notifications/components/notification-page-header"
import { NotificationCategoryFilter } from "@/features/notifications/components/notification-category-filter"
import { NotificationList } from "@/features/notifications/components/notification-list"
import { MOCK_NOTIFICATIONS } from "@/data/mock/notifications"
import type {
  NotificationCategory,
  NotificationItem,
} from "@/types/notifications"

export const AdminNotificationsView = () => {
  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const [activeCategory, setActiveCategory] =
    React.useState<NotificationCategory>("all")

  const filteredNotifications = React.useMemo(() => {
    if (activeCategory === "all") return notifications
    return notifications.filter(
      (notification) => notification.category === activeCategory
    )
  }, [notifications, activeCategory])

  const isAllRead = React.useMemo(
    () => notifications.every((notification) => notification.isRead),
    [notifications]
  )

  const counts = React.useMemo(() => {
    const countMap: Record<NotificationCategory, number> = {
      all: notifications.length,
      safety_alert: 0,
      task_update: 0,
      system_health: 0,
    }
    for (const notification of notifications) {
      if (notification.category !== "all") {
        countMap[notification.category]++
      }
    }
    return countMap
  }, [notifications])

  const handleSelectCategory = (category: NotificationCategory) => {
    setActiveCategory(category)
  }

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleEmergencyProtocol = (_id: string) => {
    console.log("Emergency protocol triggered for notification:", _id)
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <NotificationPageHeader
        onMarkAllRead={handleMarkAllRead}
        isAllRead={isAllRead}
      />
      <NotificationCategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        counts={counts}
      />
      <NotificationList
        notifications={filteredNotifications}
        isAdmin={true}
        onDismiss={handleDismissNotification}
        onAction={handleEmergencyProtocol}
      />
    </div>
  )
}
