"use client"

import { useState } from "react"
import { Trash2, FileText } from "lucide-react"
import { deleteTaskAction } from "@/features/tasks/server/actions/tasks"

interface AdminTask {
  id: string
  deviceName: string | null
  deviceLabel: string | null
  userName: string | null
  taskType: string
  subject: string
  priority: string
  status: string
  submittedAt: Date
}

interface AdminTasksTableProps {
  tasks: AdminTask[]
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

export const AdminTasksTable = ({ tasks }: AdminTasksTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)

    const formData = new FormData()
    formData.set("id", id)

    const result = await deleteTaskAction(formData)
    if (result.error) {
      setError(result.error)
    }
    setDeletingId(null)
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-12 text-center">
        <FileText className="size-12 text-muted-foreground/40" />
        <div>
          <h3 className="text-lg font-bold">No Task Records</h3>
          <p className="text-sm text-muted-foreground">
            No task submissions have been recorded yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      {error && (
        <div className="border-b border-destructive/30 bg-destructive/10 px-6 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                Device
              </th>
              <th className="px-5 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                Submitter
              </th>
              <th className="px-5 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                Subject
              </th>
              <th className="px-5 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                Priority
              </th>
              <th className="px-5 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                Status
              </th>
              <th className="px-5 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                Date
              </th>
              <th className="px-5 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                Actions
              </th>
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

              return (
                <tr
                  key={task.id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/30"
                >
                  <td className="max-w-[160px] truncate px-5 py-4 font-medium text-foreground">
                    {task.deviceName || task.deviceLabel || "N/A"}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {task.userName || "Unknown"}
                  </td>
                  <td className="max-w-[200px] truncate px-5 py-4 text-foreground">
                    {task.subject}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        priorityColors[task.priority] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        statusColors[task.status] || "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {dateStr}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      className="flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1.5 text-[10px] font-bold text-destructive transition-all hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 className="size-3" />
                      {deletingId === task.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
