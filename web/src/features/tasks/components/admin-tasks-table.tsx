"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import {
  Trash2,
  Eye,
  Pencil,
  MoreVertical,
  Download,
  Printer,
  Search,
} from "lucide-react"
import { deleteTaskAction } from "@/features/tasks/server/actions/tasks"
import { TaskDetailModal } from "@/features/tasks/components/task-detail-modal"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface AdminTask {
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

interface AdminTasksTableProps {
  tasks: AdminTask[]
  stats: {
    totalSubmissions: number
    criticalRepairs: number
    pendingVerifications: number
    verificationRate: number
    growth: number
  }
}

const taskTypeStyles: Record<string, string> = {
  "Preventative Maintenance": "bg-primary/10 text-primary",
  "Emergency Repair":
    "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
  "General Record / Log": "bg-muted text-muted-foreground",
  "Safety Inspection":
    "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
}

const statusStyles: Record<string, { icon: string; color: string }> = {
  completed: { icon: "check_circle", color: "text-primary" },
  pending: { icon: "pending", color: "text-yellow-600 dark:text-yellow-400" },
  cancelled: { icon: "cancel", color: "text-gray-400 dark:text-gray-500" },
}

export const AdminTasksTable = ({ tasks, stats }: AdminTasksTableProps) => {
  const [workerFilter, setWorkerFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewTask, setViewTask] = useState<AdminTask | null>(null)

  const uniqueWorkers = useMemo(() => {
    const names = [...new Set(tasks.map((t) => t.userName).filter(Boolean))]
    return names as string[]
  }, [tasks])

  const uniqueTypes = useMemo(() => {
    return [...new Set(tasks.map((t) => t.taskType))]
  }, [tasks])

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (workerFilter && t.userName !== workerFilter) return false
      if (typeFilter !== "all" && t.taskType !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !t.subject.toLowerCase().includes(q) &&
          !t.deviceName?.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [tasks, workerFilter, typeFilter, search])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)
    const formData = new FormData()
    formData.set("id", id)
    const result = await deleteTaskAction(formData)
    if (result.error) setError(result.error)
    setDeletingId(null)
  }

  const columns: ColumnDef<AdminTask>[] = [
    {
      accessorKey: "submittedAt",
      header: "Timestamp",
      enableSorting: true,
      cell: ({ row }) => {
        const dateStr = new Date(row.original.submittedAt).toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric", year: "numeric" }
        )
        const timeStr = new Date(row.original.submittedAt).toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit" }
        )
        return (
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{dateStr}</span>
            <span className="text-xs text-muted-foreground">{timeStr}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "userName",
      header: "Worker",
      enableSorting: true,
      cell: ({ row }) => {
        const name = row.original.userName || "Unknown"
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {initials}
            </div>
            <span className="font-medium text-foreground">{name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "deviceLabel",
      header: "Node ID",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-primary">
          {row.original.deviceLabel || "N/A"}
        </code>
      ),
    },
    {
      accessorKey: "taskType",
      header: "Task Type",
      enableSorting: true,
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
            taskTypeStyles[row.original.taskType] ||
            "bg-muted text-muted-foreground"
          }`}
        >
          {row.original.taskType}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => {
        const st = statusStyles[row.original.status] || {
          icon: "help",
          color: "text-gray-400",
        }
        return (
          <span className={`flex items-center gap-2 font-bold ${st.color}`}>
            {row.original.status === "completed" && "✓"}
            {row.original.status === "pending" && "⏳"}
            {row.original.status === "cancelled" && "✕"}
            {row.original.status === "completed" && "Verified"}
            {row.original.status === "pending" && "Pending"}
            {row.original.status === "cancelled" && "Cancelled"}
          </span>
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
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-primary"
                >
                  <MoreVertical className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onSelect={() => setViewTask(task)}>
                  <Eye className="mr-2 size-4" />
                  View
                </DropdownMenuItem>
                {isPending && (
                  <DropdownMenuItem asChild>
                    <Link href={`/tasks/submit?taskId=${task.id}`}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onSelect={() => handleDelete(task.id)}
                  disabled={deletingId === task.id}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  {deletingId === task.id ? "..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const bentoCards = [
    {
      icon: "task",
      iconBg: "bg-primary/10 text-primary",
      label: "Total Submissions",
      value: stats.totalSubmissions.toLocaleString(),
      badge: `+${stats.growth}% vs last month`,
      badgeColor: "text-primary font-bold font-label-sm",
      decoration: "text-primary",
    },
    {
      icon: "construction",
      iconBg:
        "bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
      label: "Critical Repairs",
      value: String(stats.criticalRepairs),
      badge: "Requires Attention",
      badgeColor: "text-rose-700 dark:text-rose-400 font-bold font-label-sm",
      decoration: "text-rose-300 dark:text-rose-700",
      bg: "bg-rose-50 dark:bg-rose-950/20",
    },
    {
      icon: "verified_user",
      iconBg:
        "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
      label: "Pending Verifications",
      value: String(stats.pendingVerifications),
      badge: `${stats.verificationRate}% Verification Rate`,
      badgeColor:
        "text-yellow-700 dark:text-yellow-400 font-bold font-label-sm",
      decoration: "text-yellow-300 dark:text-yellow-700",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
    },
  ]

  return (
    <>
      {/* Stats Bento */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {bentoCards.map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-3xl p-6 shadow-sm ${
              card.bg || "bg-card"
            } border border-border/30`}
          >
            <div className="absolute -right-4 -top-4 opacity-5 transition-transform duration-700 group-hover:scale-110">
              <span className="text-[120px]">{card.icon}</span>
            </div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl p-2 ${card.iconBg}`}>
                  <span className="material-symbols-outlined">
                    {card.icon}
                  </span>
                </div>
                <span className={card.badgeColor}>{card.badge}</span>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  {card.label}
                </p>
                <p className="text-3xl font-black tracking-tighter text-foreground">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Task Ledger */}
      <div className="overflow-hidden rounded-3xl border border-border/20 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/30 p-6">
          <h3 className="text-2xl font-black tracking-tighter text-foreground">
            Task Ledger
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted"
            >
              <Download className="size-4" />
            </button>
            <button
              type="button"
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted"
            >
              <Printer className="size-4" />
            </button>
          </div>
        </div>

        <div className="p-0">
          <DataTable
            columns={columns}
            data={filtered}
            pageSize={10}
            toolbar={
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 w-56 rounded-xl border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <select
                  value={workerFilter}
                  onChange={(e) => setWorkerFilter(e.target.value)}
                  className="h-9 w-36 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground"
                >
                  <option value="">All Personnel</option>
                  {uniqueWorkers.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-9 w-44 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("")
                    setWorkerFilter("")
                    setTypeFilter("all")
                  }}
                  className="flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-1.5 text-xs font-bold text-foreground transition-all hover:bg-muted"
                >
                  <span className="text-sm">✕</span>
                  Reset
                </button>
              </div>
            }
          />
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
