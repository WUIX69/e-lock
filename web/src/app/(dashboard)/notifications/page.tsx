"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"
import { AdminNotificationsView } from "@/features/notifications/components/admin-notifications-view"
import { UserNotificationsView } from "@/features/notifications/components/user-notifications-view"

export default function NotificationsPage() {
  const { currentUser, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (isLoading) return
    if (!currentUser) router.replace("/login")
  }, [currentUser, isLoading, router])

  if (isLoading || !currentUser) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
            Initializing Session...
          </p>
        </div>
      </div>
    )
  }

  if (currentUser.role === "admin" || currentUser.role === "senior_engineer") {
    return (
      <div className="container mx-auto px-4 py-8 md:px-8">
        <AdminNotificationsView />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <UserNotificationsView />
    </div>
  )
}
