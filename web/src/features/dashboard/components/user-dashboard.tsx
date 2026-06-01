"use client"

import * as React from "react"
import { MachineStatusCard } from "@/features/dashboard/components/user/machine-status-card"
import { MaintenanceChecklist } from "@/features/dashboard/components/user/maintenance-checklist"
import { EmergencyFab } from "@/features/dashboard/components/user/emergency-fab"
import { JoinLockoutCard } from "@/features/dashboard/components/user/join-lockout-card"
import { HardwareStatusList } from "@/features/dashboard/components/user/hardware-status-list"
import { TasksRecords } from "@/features/dashboard/components/user/tasks-records"
import { useAuth } from "@/context/auth-context"
import { MOCK_USER_DASHBOARD_DATA } from "@/data/mock/user-dashboard"
import {
  getMyTasksAction,
  getPendingInvitationsAction,
} from "@/features/tasks/server/actions/tasks"

export function UserDashboard() {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = React.useState<any[]>([])
  const [invitations, setInvitations] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    const [tasksRes, invRes] = await Promise.all([
      getMyTasksAction(),
      getPendingInvitationsAction(),
    ])
    if (tasksRes.tasks) setTasks(tasksRes.tasks)
    if (invRes.invitations) setInvitations(invRes.invitations)
    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!currentUser) return null

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
        <div className="space-y-6 lg:col-span-4">
          <JoinLockoutCard
            invitations={invitations}
            onRefresh={fetchData}
          />
          <HardwareStatusList loto={data.lotoStatus} />
        </div>

        {/* Bottom Row */}
        <div className="lg:col-span-7">
          <TasksRecords tasks={tasks} isLoading={isLoading} />
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
