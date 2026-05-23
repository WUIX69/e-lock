"use client"

import { FileText, Calendar, User, Users, Wrench } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TaskDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: {
    id: string
    subject: string
    taskType: string
    priority: string
    description: string | null
    status: string
    deviceName: string | null
    deviceLabel: string | null
    userName: string | null
    submittedAt: Date
    coWorkers?: { id: string | null; name: string }[]
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

export const TaskDetailModal = ({
  open,
  onOpenChange,
  task,
}: TaskDetailModalProps) => {
  const dateStr = new Date(task.submittedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
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
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground">
              {task.subject}
            </h3>
            <p className="text-sm text-muted-foreground">{task.taskType}</p>
          </div>

          {task.description && (
            <div className="rounded-xl border border-border/30 bg-muted/30 p-4">
              <p className="text-sm text-foreground">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {task.deviceName || task.deviceLabel || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              <span>{task.userName || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{dateStr}</span>
            </div>
          </div>

          {task.coWorkers && task.coWorkers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Co-workers ({task.coWorkers.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.coWorkers.map((cw, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-full border border-border/20 bg-muted px-3 py-1.5"
                  >
                    <Avatar className="h-5 w-5 rounded-full">
                      <AvatarFallback className="text-[8px] font-bold">
                        {cw.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground">
                      {cw.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
