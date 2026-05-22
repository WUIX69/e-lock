"use client"

import * as React from "react"
import { MachineStatusCard } from "@/features/dashboard/components/user/machine-status-card"
import { LotoControlPanel } from "@/features/dashboard/components/user/loto-control-panel"
import { UserTelemetryChart } from "@/features/dashboard/components/user/user-telemetry-chart"
import { MaintenanceChecklist } from "@/features/dashboard/components/user/maintenance-checklist"
import { EmergencyFab } from "@/features/dashboard/components/user/emergency-fab"
import { JoinLockoutCard } from "@/features/dashboard/components/user/join-lockout-card"
import { ActiveLockoutsPanel } from "@/features/dashboard/components/user/active-lockouts-panel"
import { useAuth } from "@/context/auth-context"
import { MOCK_USER_DASHBOARD_DATA } from "@/data/mock/user-dashboard"

export function UserDashboard() {
  const { currentUser } = useAuth()

  if (!currentUser) return null

  // In a real app, we'd fetch data based on currentUser.id
  // For now we use the mock data
  const data = MOCK_USER_DASHBOARD_DATA

  return (
    <div className="relative space-y-8 pb-24">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Welcome back, {currentUser.name}
        </h1>
        <p className="text-muted-foreground">
          You are currently assigned to{" "}
          <span className="font-bold text-primary">
            {data.assignedMachine.name}
          </span>
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Top Row */}
        <div className="lg:col-span-8">
          <MachineStatusCard machine={data.assignedMachine} />
        </div>
        <div className="lg:col-span-4">
          <LotoControlPanel loto={data.lotoStatus} />
        </div>

        {/* Middle Row - New */}
        <div className="lg:col-span-8">
          <ActiveLockoutsPanel lockouts={data.myActiveLockouts} />
        </div>
        <div className="lg:col-span-4">
          <JoinLockoutCard invitation={data.lockoutInvitation} />
        </div>

        {/* Bottom Row */}
        <div className="lg:col-span-7">
          <UserTelemetryChart data={data.telemetry} />
        </div>
        <div className="lg:col-span-5">
          <MaintenanceChecklist ticket={data.checklist} />
        </div>
      </div>

      {/* Global Emergency Action */}
      <EmergencyFab />
    </div>
  )
}
