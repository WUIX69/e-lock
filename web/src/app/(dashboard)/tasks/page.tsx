"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2, FileText } from "lucide-react"
import { AdminTasksTable, AdminTask } from "@/features/tasks/components/admin-tasks-table"
import { getAllTasksAction } from "@/features/tasks/server/actions/tasks"

export default function TasksPage() {
  const { currentUser, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = React.useState<AdminTask[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isLoading) return
    if (!currentUser) {
      router.replace("/login")
      return
    }
    if (currentUser.role !== "admin") {
      router.replace("/user/my-activity")
      return
    }
    getAllTasksAction().then((res) => {
      if (res.error) setError(res.error)
      else setTasks(res.tasks ?? null)
    })
  }, [currentUser, isLoading, router])

  if (isLoading || !tasks) {
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
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground">
            Task Records
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all maintenance task records across devices.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3">
        <FileText className="size-5 text-muted-foreground" />
        <span className="text-sm font-bold text-muted-foreground">
          {tasks.length} total task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <AdminTasksTable tasks={tasks} />
    </div>
  )
}
