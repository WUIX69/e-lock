"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
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
import { usePagination } from "@/hooks/use-pagination"

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

const PAGE_SIZE = 10

const taskTypeStyles: Record<string, string> = {
  "Preventative Maintenance": "bg-primary/10 text-primary",
  "Emergency Repair": "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
  "General Record / Log": "bg-muted text-muted-foreground",
  "Safety Inspection": "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
}

const statusStyles: Record<string, { icon: string; color: string }> = {
  completed: { icon: "check_circle", color: "text-primary" },
  pending: { icon: "pending", color: "text-yellow-600 dark:text-yellow-400" },
  cancelled: { icon: "cancel", color: "text-gray-400 dark:text-gray-500" },
}

export const AdminTasksTable = ({ tasks, stats }: AdminTasksTableProps) => {
  const [workerFilter, setWorkerFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewTask, setViewTask] = useState<AdminTask | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

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
      return true
    })
  }, [tasks, workerFilter, typeFilter])

  const { page, startIndex, endIndex, goToPage, nextPage, prevPage, hasNext, hasPrev, pageNumbers } =
    usePagination({ totalItems: filtered.length, pageSize: PAGE_SIZE })

  const pageTasks = filtered.slice(startIndex, endIndex)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)
    const formData = new FormData()
    formData.set("id", id)
    const result = await deleteTaskAction(formData)
    if (result.error) setError(result.error)
    setDeletingId(null)
    setMenuOpenId(null)
  }

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
      iconBg: "bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
      label: "Critical Repairs",
      value: String(stats.criticalRepairs),
      badge: "Requires Attention",
      badgeColor: "text-rose-700 dark:text-rose-400 font-bold font-label-sm",
      decoration: "text-rose-300 dark:text-rose-700",
      bg: "bg-rose-50 dark:bg-rose-950/20",
    },
    {
      icon: "verified_user",
      iconBg: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
      label: "Pending Verifications",
      value: String(stats.pendingVerifications),
      badge: `${stats.verificationRate}% Verification Rate`,
      badgeColor: "text-yellow-700 dark:text-yellow-400 font-bold font-label-sm",
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
            className={`relative overflow-hidden rounded-3xl p-6 shadow-sm ${card.bg || "bg-card"} border border-border/30`}
          >
            <div className="absolute -right-4 -top-4 opacity-5 transition-transform duration-700 group-hover:scale-110">
              <span className="text-[120px]">{card.icon}</span>
            </div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl p-2 ${card.iconBg}`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
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

      {/* Filters */}
      <div className="mb-8 rounded-3xl border border-border/20 bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <label className="ml-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Worker
              </label>
              <select
                value={workerFilter}
                onChange={(e) => { setWorkerFilter(e.target.value); goToPage(0) }}
                className="w-44 rounded-xl border border-border bg-white dark:bg-card px-4 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">All Personnel</option>
                {uniqueWorkers.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="ml-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Task Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); goToPage(0) }}
                className="w-44 rounded-xl border border-border bg-white dark:bg-card px-4 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={() => { setWorkerFilter(""); setTypeFilter("all"); goToPage(0) }}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 font-bold text-foreground transition-all hover:bg-muted"
            >
              <span className="text-lg">✕</span>
              Reset
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95"
            >
              <Search className="size-4" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-border/20 bg-card shadow-sm">
        {error && (
          <div className="border-b border-destructive/30 bg-destructive/10 px-6 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-muted/50 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Worker</th>
                <th className="px-6 py-4 font-semibold">Node ID</th>
                <th className="px-6 py-4 font-semibold">Task Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {pageTasks.map((task) => {
                const dateStr = new Date(task.submittedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
                const timeStr = new Date(task.submittedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                const st = statusStyles[task.status] || { icon: "help", color: "text-gray-400" }
                const typeStyle = taskTypeStyles[task.taskType] || "bg-muted text-muted-foreground"
                const isPending = task.status === "pending"

                return (
                  <tr
                    key={task.id}
                    className="transition-all hover:bg-primary/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{dateStr}</span>
                        <span className="text-xs text-muted-foreground">{timeStr}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {(task.userName || "?")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </div>
                        <span className="font-medium text-foreground">
                          {task.userName || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-primary">
                        {task.deviceLabel || "N/A"}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${typeStyle}`}
                      >
                        {task.taskType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-2 font-bold ${st.color}`}>
                        {task.status === "completed" && "✓"}
                        {task.status === "pending" && "⏳"}
                        {task.status === "cancelled" && "✕"}
                        {task.status === "completed" && "Verified"}
                        {task.status === "pending" && "Pending"}
                        {task.status === "cancelled" && "Cancelled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setMenuOpenId(menuOpenId === task.id ? null : task.id)}
                          className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-primary"
                        >
                          <MoreVertical className="size-5" />
                        </button>
                        {menuOpenId === task.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setMenuOpenId(null)}
                            />
                            <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                              <button
                                type="button"
                                onClick={() => { setViewTask(task); setMenuOpenId(null) }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
                              >
                                <Eye className="size-4" />
                                View
                              </button>
                              {isPending && (
                                <Link
                                  href={`/tasks/submit?taskId=${task.id}`}
                                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                  <Pencil className="size-4" />
                                  Edit
                                </Link>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDelete(task.id)}
                                disabled={deletingId === task.id}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                              >
                                <Trash2 className="size-4" />
                                {deletingId === task.id ? "..." : "Delete"}
                              </button>
                            </div>
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

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/30 bg-muted/30 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold">{filtered.length > 0 ? startIndex + 1 : 0}</span>
            {" — "}
            <span className="font-bold">{endIndex}</span> of{" "}
            <span className="font-bold">{filtered.length}</span> entries
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prevPage}
              disabled={!hasPrev}
              className="rounded-xl border border-border bg-white dark:bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-muted disabled:opacity-40"
            >
              Previous
            </button>
            {pageNumbers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                  p === page
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-white dark:bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {p + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={nextPage}
              disabled={!hasNext}
              className="rounded-xl border border-border bg-white dark:bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-muted disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {viewTask && (
        <TaskDetailModal
          open={!!viewTask}
          onOpenChange={(open) => { if (!open) setViewTask(null) }}
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
