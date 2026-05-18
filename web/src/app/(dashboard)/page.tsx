"use client"

import * as React from "react"
import { useSession } from "@/context/session-context"
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard"
import { UserDashboard } from "@/features/dashboard/components/user-dashboard"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { currentUser, isLoading } = useSession()

  if (isLoading) {
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

  if (!currentUser) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-black text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">
            Please log in to access the safety management portal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      {currentUser.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </div>
  )
}
