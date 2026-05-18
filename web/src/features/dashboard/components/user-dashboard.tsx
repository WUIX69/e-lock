"use client"

import * as React from "react"
import { MachineStatusCard } from "./user/machine-status-card"
import { LotoControlPanel } from "./user/loto-control-panel"
import { UserTelemetryChart } from "./user/user-telemetry-chart"
import { MaintenanceChecklist } from "./user/maintenance-checklist"
import { EmergencyFab } from "./user/emergency-fab"
import { useSession } from "@/context/session-context"
import { MOCK_USER_DASHBOARD_DATA } from "@/data/mock/user-dashboard"

export function UserDashboard() {
  const { currentUser } = useSession()

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
