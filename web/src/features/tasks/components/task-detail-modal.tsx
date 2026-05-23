"use client"


import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
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
    userPosition?: string | null
    deviceType?: string | null
    submittedAt: Date
    coWorkers?: { id: string | null; name: string }[]
  }
}

const priorityStyles: Record<string, string> = {
  Critical: "bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
  High: "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
  Routine: "bg-primary text-primary-foreground",
}

const statusStyles: Record<string, string> = {
  pending: "bg-secondary text-secondary-foreground",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-muted text-muted-foreground",
}

export const TaskDetailModal = ({
  open,
  onOpenChange,
  task,
}: TaskDetailModalProps) => {
  const dateStr = new Date(task.submittedAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const timeStr = new Date(task.submittedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] sm:max-w-2xl flex-col gap-0 p-0">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <span className="text-lg font-bold">✓</span>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">
                Task Details
              </DialogTitle>
            </div>

          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                priorityStyles[task.priority] ||
                "bg-muted text-muted-foreground"
              }`}
            >
              {task.priority}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                statusStyles[task.status] || "bg-muted text-muted-foreground"
              }`}
            >
              {task.status}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 font-mono text-[10px] text-muted-foreground">
              #{task.deviceLabel || "NODE"}
            </span>
          </div>

          <div>
            <h3 className="text-2xl leading-tight font-black tracking-tighter text-foreground">
              {task.subject}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {task.taskType}
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Machine & Node Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex gap-4 rounded-xl border border-border/30 bg-muted/30 p-4">
              <div className="text-primary">
                <span className="text-lg">⬡</span>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Machine Node
                </p>
                <p className="text-2xl font-black tracking-tighter text-foreground">
                  {task.deviceLabel || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {task.deviceName || "Unknown Device"}
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl border border-border/30 bg-muted/30 p-4">
              <div className="text-primary">
                <span className="text-lg">⌂</span>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Site Location
                </p>
                <p className="text-2xl font-black tracking-tighter text-foreground">
                  {task.deviceName || "Main Facility"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {task.deviceType
                    ? `Type: ${task.deviceType.replace("_", " ")}`
                    : task.status === "completed"
                      ? "Operational"
                      : "Active"}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline & Personnel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="text-sm text-primary">🕐</span>
              <h4 className="text-xl font-black tracking-tighter text-foreground">
                Timeline & Personnel
              </h4>
            </div>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex flex-1 items-center gap-4 rounded-xl bg-muted/50 p-4">
                <div className="rounded-lg bg-muted p-3 text-muted-foreground">
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Timestamp
                  </p>
                  <p className="text-base font-bold text-foreground">
                    {dateStr}
                  </p>
                  <p className="text-sm text-muted-foreground">{timeStr}</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-4 rounded-xl bg-muted/50 p-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                    {task.userName ? initials(task.userName) : "UN"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Assigned Supervisor
                  </p>
                  <p className="text-base font-bold text-foreground">
                    {task.userName || "Unassigned"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.userPosition || "Technician"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Collaborative Context */}
          {task.coWorkers && task.coWorkers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="text-sm text-primary">👥</span>
                <h4 className="text-xl font-black tracking-tighter text-foreground">
                  Collaborative Context
                </h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {task.coWorkers.map((cw, i) => {
                  const isFirst = i === 0
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-full px-4 py-2 shadow-sm transition-all ${
                        isFirst
                          ? "bg-sidebar text-sidebar-foreground"
                          : "border border-border bg-card text-foreground"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                          isFirst
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {initials(cw.name)}
                      </div>
                      <span className="text-sm font-medium">{cw.name}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] ${
                          isFirst
                            ? "bg-white/10 text-white/70"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isFirst ? "Verifier" : "Witness"}
                      </span>
                    </div>
                  )
                })}
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-border text-muted-foreground transition-colors hover:bg-muted"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>
          )}

          {/* Task Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="text-sm text-primary">📄</span>
              <h4 className="text-xl font-black tracking-tighter text-foreground">
                Task Summary
              </h4>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <span className="text-6xl">🔒</span>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                {task.description || "No additional notes provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row">
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm text-foreground transition-all hover:bg-muted active:scale-95"
            >
              <span className="text-base">🖨</span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Print
              </span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm text-foreground transition-all hover:bg-muted active:scale-95"
            >
              <span className="text-base">📄</span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Export PDF
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-lg bg-primary px-8 py-3 font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95 sm:w-auto"
          >
            Close Task
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
