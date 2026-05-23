"use client"

import { useState } from "react"
import { XCircle } from "lucide-react"
import { cancelTaskAction } from "@/features/tasks/server/actions/tasks"

interface TaskCardProps {
  task: {
    id: string
    deviceName: string | null
    deviceLabel: string | null
    taskType: string
    subject: string
    priority: string
    status: string
    submittedAt: Date
    coWorkerName: string | null
  }
}

const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Routine: "bg-blue-100 text-blue-700 border-blue-200",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancel = async () => {
    setIsCancelling(true)
    setError(null)

    const formData = new FormData()
    formData.set("id", task.id)

    const result = await cancelTaskAction(formData)
    if (result.error) {
      setError(result.error)
      setIsCancelling(false)
    }
  }

  const dateStr = new Date(task.submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                priorityColors[task.priority] || "bg-gray-100 text-gray-700"
              }`}
            >
              {task.priority}
            </span>
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                statusColors[task.status] || "bg-gray-100 text-gray-500"
              }`}
            >
              {task.status}
            </span>
            <span className="text-[10px] text-muted-foreground">{dateStr}</span>
          </div>

          <h4 className="text-sm font-bold text-foreground">{task.subject}</h4>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Device: {task.deviceName || task.deviceLabel || "N/A"}</span>
            <span>Type: {task.taskType}</span>
            {task.coWorkerName && <span>Co-worker: {task.coWorkerName}</span>}
          </div>
        </div>

        {task.status === "pending" && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="flex shrink-0 items-center gap-1 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive transition-all hover:bg-destructive/10 disabled:opacity-50"
          >
            <XCircle className="size-3.5" />
            {isCancelling ? "..." : "Cancel"}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
