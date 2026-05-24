"use client"

import { useState } from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { ExternalLink, Pencil, XCircle, Circle } from "lucide-react"
import { cancelTaskAction } from "@/features/tasks/server/actions/tasks"
import { TaskDetailModal } from "@/features/tasks/components/task-detail-modal"
import { DataTable } from "@/components/ui/data-table"
import { ToolbarRow } from "@/components/primitives/toolbar-row"
import { FilterInput } from "@/components/primitives/filter-input"
import { FilterSelect } from "@/components/primitives/filter-select"

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500 bg-green-500/10"
    case "pending":
      return "text-yellow-500 bg-yellow-500/10"
    case "cancelled":
      return "text-muted-foreground bg-muted"
    default:
      return "text-muted-foreground bg-muted"
  }
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
      header: "Device",
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
        const label = status === "completed" ? "Verified" : status === "pending" ? "Awaiting Supervisor" : "Cancelled"
        return (
          <div
            className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black tracking-widest uppercase ${getStatusColor(status)}`}
          >
            <Circle className="size-2 fill-current" />
            {label}
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
      <div className="space-y-4">
        <ToolbarRow
          title="My Recent Submissions"
          filters={
            <>
              <FilterInput
                placeholder="Search device or task..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "pending", label: "Pending" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
              <FilterSelect
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "Preventative Maintenance", label: "Preventative Maintenance" },
                  { value: "Emergency Repair", label: "Emergency Repair" },
                  { value: "General Record / Log", label: "General Record / Log" },
                  { value: "Safety Inspection", label: "Safety Inspection" },
                ]}
              />
            </>
          }
        />
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No tasks match your filters.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} pageSize={10} />
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
