"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, Pencil, XCircle } from "lucide-react"
import { cancelTaskAction } from "@/features/tasks/server/actions/tasks"
import { TaskDetailModal } from "@/features/tasks/components/task-detail-modal"

type TaskItem = {
  id: string
  deviceName: string | null
  deviceLabel: string | null
  deviceType: string | null
  userName: string | null
  userPosition: string | null
  taskType: string
  subject: string
  priority: string
  description: string | null
  status: string
  submittedAt: Date
  coWorkers: { id: string | null; name: string }[]
}

interface UserTasksTableProps {
  tasks: TaskItem[]
}

const taskTypeColors: Record<string, string> = {
  "Preventative Maintenance": "bg-primary/10 text-primary font-bold",
  "Emergency Repair":
    "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold",
  "General Record / Log": "bg-muted text-muted-foreground font-bold",
  "Safety Inspection":
    "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 font-bold",
}

const statusConfig: Record<string, { dot: string; label: string }> = {
  completed: { dot: "bg-primary", label: "Verified" },
  pending: { dot: "bg-yellow-500", label: "Awaiting Supervisor" },
  cancelled: { dot: "bg-gray-400 dark:bg-gray-500", label: "Cancelled" },
}

const codeColors = [
  "bg-primary/10 text-primary",
  "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
  "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
  "bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400",
]

export const UserTasksTable = ({ tasks }: UserTasksTableProps) => {
  const [viewTask, setViewTask] = useState<TaskItem | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const handleCancel = async (id: string) => {
    setCancellingId(id)
    const formData = new FormData()
    formData.set("id", id)
    await cancelTaskAction(formData)
    setCancellingId(null)
  }

  const getCodeColor = (label: string | null) => {
    const hash = (label || "").length
    return codeColors[hash % codeColors.length]
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No task records yet. Submit your first task from a device card.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-3xl border border-border/20 bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tighter text-foreground">
            My Recent Submissions
          </h3>
          <div className="flex gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold text-muted-foreground">
              SORT: NEWEST
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold text-muted-foreground">
              VIEW: ALL
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                <th className="pb-2 pl-4">Node Name</th>
                <th className="pb-2">Task Category</th>
                <th className="pb-2">Date & Time</th>
                <th className="pb-2">Status</th>
                <th className="pr-4 pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const dateStr = new Date(task.submittedAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )
                const timeStr = new Date(task.submittedAt).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
                const status = statusConfig[task.status] || {
                  dot: "bg-gray-400",
                  label: task.status,
                }
                const code = (task.deviceLabel || "XX")
                  .substring(0, 8)
                  .toUpperCase()
                const isPending = task.status === "pending"

                return (
                  <tr key={task.id} className="relative">
                    <td className="rounded-l-2xl border-y border-l border-border/20 bg-muted/30 py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${getCodeColor(task.deviceLabel)}`}
                        >
                          {code}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {task.deviceName || "Unknown Device"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.deviceLabel || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="border-y border-border/20 bg-muted/30 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-[11px] tracking-wide ${
                          taskTypeColors[task.taskType] ||
                          "bg-muted font-bold text-muted-foreground"
                        }`}
                      >
                        {task.taskType}
                      </span>
                    </td>
                    <td className="border-y border-border/20 bg-muted/30 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {dateStr}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {timeStr}
                        </p>
                      </div>
                    </td>
                    <td className="border-y border-border/20 bg-muted/30 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${status.dot} ${isPending ? "animate-pulse" : ""}`}
                        />
                        <span
                          className={`text-sm font-bold ${isPending ? "text-yellow-700 dark:text-yellow-400" : "text-primary"}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="rounded-r-2xl border-y border-r border-border/20 bg-muted/30 py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewTask(task)}
                          className="rounded-full p-2 text-muted-foreground transition-all hover:bg-muted"
                        >
                          <ExternalLink className="size-4" />
                        </button>
                        {isPending && (
                          <>
                            <Link
                              href={`/tasks/submit?taskId=${task.id}`}
                              className="rounded-full p-2 text-muted-foreground transition-all hover:bg-muted"
                            >
                              <Pencil className="size-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleCancel(task.id)}
                              disabled={cancellingId === task.id}
                              className="rounded-full p-2 text-destructive/70 transition-all hover:bg-destructive/10 disabled:opacity-50"
                            >
                              <XCircle className="size-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="flex items-center gap-1 font-bold text-primary transition-all hover:underline active:scale-95"
          >
            Load More History
            <span className="text-lg">↓</span>
          </button>
        </div>
      </div>

      {viewTask && (
        <TaskDetailModal
          open={!!viewTask}
          onOpenChange={(open) => {
            if (!open) setViewTask(null)
          }}
          task={{
            id: viewTask.id,
            subject: viewTask.subject,
            taskType: viewTask.taskType,
            priority: viewTask.priority,
            description: viewTask.description,
            status: viewTask.status,
            deviceName: viewTask.deviceName,
            deviceLabel: viewTask.deviceLabel,
            deviceType: viewTask.deviceType,
            userName: viewTask.userName,
            userPosition: viewTask.userPosition,
            submittedAt: viewTask.submittedAt,
            coWorkers: viewTask.coWorkers,
          }}
        />
      )}
    </>
  )
}
