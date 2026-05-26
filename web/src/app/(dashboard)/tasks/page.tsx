"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"
import { AdminTasksTable } from "@/features/tasks/components/admin-tasks-table"
import { UserTasksHeader } from "@/features/tasks/components/user-tasks-header"
import { UserTasksStats } from "@/features/tasks/components/user-tasks-stats"
import { UserTasksTable } from "@/features/tasks/components/user-tasks-table"
import { UserTasksBottom } from "@/features/tasks/components/user-tasks-bottom"
import {
  getAllTasksAction,
  getMyTasksAction,
  getAdminTaskStatsAction,
  getUserTaskStatsAction,
} from "@/features/tasks/server/actions/tasks"
import type { AdminTask } from "@/features/tasks/components/admin-tasks-table"

function AdminView() {
  const [tasks, setTasks] = React.useState<AdminTask[]>([])
  const [stats, setStats] = React.useState<{
    totalSubmissions: number
    criticalRepairs: number
    pendingVerifications: number
    verificationRate: number
    growth: number
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    Promise.all([getAllTasksAction(), getAdminTaskStatsAction()]).then(
      ([tasksRes, statsRes]) => {
        if (tasksRes.error) setError(tasksRes.error)
        else setTasks(tasksRes.tasks ?? [])
        if (statsRes.error) setError(statsRes.error)
        else setStats(statsRes as typeof stats)
        setLoaded(true)
      }
    )
  }, [])

  if (!loaded) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
            Loading Tasks...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      <AdminTasksTable tasks={tasks} stats={stats || { totalSubmissions: 0, criticalRepairs: 0, pendingVerifications: 0, verificationRate: 0, growth: 0 }} />
    </div>
  )
}

function UserView() {
  const [tasks, setTasks] = React.useState<unknown[]>([])
  const [stats, setStats] = React.useState<{
    completedThisMonth: number
    pendingCount: number
    avgVerificationTime: number
    accuracyScore: number
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    Promise.all([getMyTasksAction(), getUserTaskStatsAction()]).then(
      ([tasksRes, statsRes]) => {
        if (tasksRes.error) setError(tasksRes.error)
        else setTasks(tasksRes.tasks ?? [])
        if (statsRes.error) setError(statsRes.error)
        else setStats(statsRes as typeof stats)
        setLoaded(true)
      }
    )
  }, [])

  if (!loaded) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
            Loading Tasks...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      <UserTasksHeader />
      <UserTasksStats
        completedThisMonth={stats?.completedThisMonth ?? 0}
        pendingCount={stats?.pendingCount ?? 0}
        avgVerificationTime={stats?.avgVerificationTime ?? 0}
        accuracyScore={stats?.accuracyScore ?? 99.2}
      />
      <UserTasksTable tasks={tasks as AdminTask[]} />
      <UserTasksBottom />
    </div>
  )
}

export default function TasksPage() {
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

  if (currentUser.role === "admin") return <AdminView />
  return <UserView />
}
