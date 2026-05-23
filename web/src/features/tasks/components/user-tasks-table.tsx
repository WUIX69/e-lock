"use client"

import { useState } from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { ExternalLink, Pencil, XCircle } from "lucide-react"
import { cancelTaskAction } from "@/features/tasks/server/actions/tasks"
import { TaskDetailModal } from "@/features/tasks/components/task-detail-modal"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"

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

const getCodeColor = (label: string | null) => {
  const hash = (label || "").length
  return codeColors[hash % codeColors.length]
}

export const UserTasksTable = ({ tasks }: UserTasksTableProps) => {
  const [viewTask, setViewTask] = useState<TaskItem | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const handleCancel = async (id: string) => {
    setCancellingId(id)
    const formData = new FormData()
    formData.set("id", id)
    await cancelTaskAction(formData)
    setCancellingId(null)
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

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (typeFilter !== "all" && t.taskType !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !t.deviceName?.toLowerCase().includes(q) &&
        !t.deviceLabel?.toLowerCase().includes(q) &&
        !t.subject.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  const columns: ColumnDef<TaskItem>[] = [
    {
      accessorKey: "deviceLabel",
      header: "Node Name",
      enableSorting: true,
      cell: ({ row }) => {
        const task = row.original
        const code = (task.deviceLabel || "XX").substring(0, 8).toUpperCase()
        return (
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
        )
      },
    },
    {
      accessorKey: "taskType",
      header: "Task Category",
      enableSorting: true,
      cell: ({ row }) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-[11px] tracking-wide ${
            taskTypeColors[row.original.taskType] ||
            "bg-muted font-bold text-muted-foreground"
          }`}
        >
          {row.original.taskType}
        </span>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Date & Time",
      enableSorting: true,
      cell: ({ row }) => {
        const date = new Date(row.original.submittedAt)
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        const timeStr = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
        return (
          <div>
            <p className="text-sm font-medium text-foreground">{dateStr}</p>
            <p className="text-[11px] text-muted-foreground">{timeStr}</p>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.original.status
        const cfg = statusConfig[status] || {
          dot: "bg-gray-400",
          label: status,
        }
        const isPending = status === "pending"
        return (
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${cfg.dot} ${isPending ? "animate-pulse" : ""}`}
            />
            <span
              className={`text-sm font-bold ${isPending ? "text-yellow-700 dark:text-yellow-400" : "text-primary"}`}
            >
              {cfg.label}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const task = row.original
        const isPending = task.status === "pending"
        return (
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
        )
      },
    },
  ]

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

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No tasks match your filters.
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pageSize={10}
            toolbar={
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  placeholder="Search node or task..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-64 text-xs"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 w-36 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-9 w-44 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground"
                >
                  <option value="all">All Types</option>
                  <option value="Preventative Maintenance">
                    Preventative Maintenance
                  </option>
                  <option value="Emergency Repair">Emergency Repair</option>
                  <option value="General Record / Log">
                    General Record / Log
                  </option>
                  <option value="Safety Inspection">Safety Inspection</option>
                </select>
              </div>
            }
          />
        )}
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
