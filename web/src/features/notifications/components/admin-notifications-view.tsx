"use client"

import * as React from "react"
import { NotificationPageHeader } from "@/features/notifications/components/notification-page-header"
import { NotificationCategoryFilter } from "@/features/notifications/components/notification-category-filter"
import { NotificationList } from "@/features/notifications/components/notification-list"
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
  dismissNotificationAction,
} from "@/features/notifications/server/actions/notifications"
import type {
  NotificationCategory,
  NotificationItem,
} from "@/types/notifications"

export const AdminNotificationsView = () => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    []
  )
  const [activeCategory, setActiveCategory] =
    React.useState<NotificationCategory>("all")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchNotifications = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const result = await getNotificationsAction()
    if (result.error) {
      setError(result.error)
    } else if (result.notifications) {
      setNotifications(result.notifications)
    }
    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications()
  }, [fetchNotifications])

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

  const handleDismissNotification = async (id: string) => {
    const result = await dismissNotificationAction(id)
    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }
  }

  const handleEmergencyProtocol = (_id: string) => {
    console.log("Emergency protocol triggered for notification:", _id)
  }

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsReadAction()
    if (result.success) {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-sm font-medium text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <NotificationPageHeader
        onMarkAllRead={handleMarkAllRead}
        isAllRead={isAllRead}
        onRefresh={fetchNotifications}
        refreshing={isLoading}
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
