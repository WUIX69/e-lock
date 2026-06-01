"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Circle, Loader2, ClipboardList, ArrowRight } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"

export interface TaskItem {
  id: string
  deviceName: string | null
  deviceLabel: string | null
  taskType: string
  subject: string
  status: string
  submittedAt: Date
}

interface TasksRecordsProps {
  tasks: TaskItem[]
  isLoading: boolean
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
    case "denied":
      return "text-red-500 bg-red-500/10"
    default:
      return "text-muted-foreground bg-muted"
  }
}

function getStatusLabel(status: string, taskType: string): string {
  if (status === "completed") return "Verified"
  if (status === "cancelled") return "Cancelled"
  if (status === "denied") return "Denied"
  if (["Preventative Maintenance", "Emergency Repair"].includes(taskType))
    return "Awaiting Approval"
  return "Awaiting Completion"
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

const columns: ColumnDef<TaskItem>[] = [
  {
    accessorKey: "deviceLabel",
    header: "Device",
    cell: ({ row }) => {
      const task = row.original
      const code = (task.deviceLabel || "XX").substring(0, 8).toUpperCase()
      return (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${getCodeColor(task.deviceLabel)}`}
          >
            {code}
          </div>
          <div>
            <p className="text-sm leading-tight font-bold text-foreground">
              {task.deviceName || "Unknown Device"}
            </p>
            <p className="text-[11px] text-muted-foreground">
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
    cell: ({ row }) => (
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] tracking-wide ${
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
    cell: ({ row }) => {
      const task = row.original
      const label = getStatusLabel(task.status, task.taskType)
      return (
        <div
          className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-black tracking-widest uppercase ${getStatusColor(task.status)}`}
        >
          <Circle className="size-1.5 fill-current" />
          {label}
        </div>
      )
    },
  },
]

export const TasksRecords = ({ tasks, isLoading }: TasksRecordsProps) => {
  return (
    <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black tracking-tighter text-foreground">
          Tasks Records
        </h3>
        <Link
          href="/tasks"
          className="text-xs font-bold text-primary hover:underline"
        >
          View All &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center pb-25 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
            <ClipboardList className="size-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">No Tasks Recorded</p>
          <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
            Submit your first maintenance or inspection task from a device card.
          </p>
          <Link
            href="/tasks/submit"
            className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black tracking-widest text-primary-foreground uppercase shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Submit a Task
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <DataTable columns={columns} data={tasks} pageSize={3} />
      )}
    </div>
  )
}
