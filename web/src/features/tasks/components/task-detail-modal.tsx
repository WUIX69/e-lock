"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import {
  approveTaskAction,
  completeTaskAction,
} from "@/features/tasks/server/actions/tasks"
import { CompletionAttachmentsModal } from "./completion-attachments-modal"
import { ImagePreview } from "@/components/ui/image-preview"

interface TaskAttachment {
  id: string
  fileName: string
  filePath: string
  category: string
}

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
    userId?: string | null
    userName: string | null
    userPosition?: string | null
    deviceType?: string | null
    submittedAt: Date
    approvedByAdmin?: boolean
    coWorkers?: { id: string | null; name: string }[]
    submissionAttachments?: TaskAttachment[]
    completionAttachments?: TaskAttachment[]
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

const STRICT_TASK_TYPES = ["Preventative Maintenance", "Emergency Repair"]

function isStrictTask(taskType: string): boolean {
  return STRICT_TASK_TYPES.includes(taskType)
}

export const TaskDetailModal = ({
  open,
  onOpenChange,
  task,
}: TaskDetailModalProps) => {
  const { currentUser } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

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

  const strict = isStrictTask(task.taskType)
  const isAdmin = currentUser?.role === "admin"
  const isPending = task.status === "pending"
  const needsAdminApproval = strict && isPending && !task.approvedByAdmin

  const handleApprove = async () => {
    setError(null)
    const result = await approveTaskAction(task.id)
    if (result.error) {
      setError(result.error)
    } else {
      onOpenChange(false)
    }
  }

  const handleCompleteRequest = () => {
    if (strict) {
      if (!task.approvedByAdmin) return
      setShowCompletionModal(true)
    } else {
      handleComplete([])
    }
  }

  const handleComplete = async (files: File[]) => {
    setError(null)
    setIsCompleting(true)

    const formData = new FormData()
    formData.set("taskId", task.id)
    formData.set("fileNames", JSON.stringify(files.map((f) => f.name)))
    for (const file of files) {
      formData.append("files", file)
    }

    const result = await completeTaskAction(formData)
    setIsCompleting(false)
    if (result.error) {
      setError(result.error)
    } else {
      setShowCompletionModal(false)
      onOpenChange(false)
    }
  }

  const submissionAttachments = task.submissionAttachments || []
  const completionAttachments = task.completionAttachments || []

  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [previewFileName, setPreviewFileName] = useState<string>("")

  const attachmentUrl = (filePath: string) => {
    const clean = filePath.replace(/^\/?(uploads\/)?/, "")
    return `/api/uploads/${clean}`
  }

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(name)

  const openPreview = (filePath: string, fileName: string) => {
    if (isImage(fileName)) {
      setPreviewSrc(attachmentUrl(filePath))
      setPreviewFileName(fileName)
    } else {
      window.open(attachmentUrl(filePath), "_blank")
    }
  }

  return (
    <>
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

          {/* Admin Approval Alert */}
          {strict && isPending && (
            <div
              className={`mx-6 mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${
                task.approvedByAdmin
                  ? "border-green-400/30 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                  : "border-yellow-400/30 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400"
              }`}
            >
              {task.approvedByAdmin
                ? "This task has been approved by an administrator."
                : "Awaiting admin approval. Task cannot be marked complete until approved."}
            </div>
          )}

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

            {/* Submission Attachments */}
            {submissionAttachments.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <span className="text-sm text-primary">📎</span>
                  <h4 className="text-xl font-black tracking-tighter text-foreground">
                    Submission Proof
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {submissionAttachments.map((att) => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => openPreview(att.filePath, att.fileName)}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-2 text-xs transition-colors hover:bg-muted"
                    >
                      {isImage(att.fileName) ? (
                        <img
                          src={attachmentUrl(att.filePath)}
                          alt={att.fileName}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-muted-foreground text-lg">
                          📄
                        </div>
                      )}
                      <span className="text-foreground hover:text-primary">
                        {att.fileName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Attachments */}
            {completionAttachments.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <span className="text-sm text-primary">✅</span>
                  <h4 className="text-xl font-black tracking-tighter text-foreground">
                    Completion Proof
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {completionAttachments.map((att) => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => openPreview(att.filePath, att.fileName)}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-2 text-xs transition-colors hover:bg-muted"
                    >
                      {isImage(att.fileName) ? (
                        <img
                          src={attachmentUrl(att.filePath)}
                          alt={att.fileName}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-muted-foreground text-lg">
                          📄
                        </div>
                      )}
                      <span className="text-foreground hover:text-primary">
                        {att.fileName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row">
            {error && (
              <p className="text-xs font-medium text-destructive">{error}</p>
            )}
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
            <div className="flex items-center gap-2">
              {isAdmin && strict && isPending && !task.approvedByAdmin && (
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
                >
                  Approve Task
                </button>
              )}
              {!isAdmin && isPending && (
                <button
                  type="button"
                  onClick={handleCompleteRequest}
                  disabled={needsAdminApproval}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                  title={
                    needsAdminApproval
                      ? "Awaiting admin approval"
                      : "Mark as complete"
                  }
                >
                  {needsAdminApproval
                    ? "Awaiting Approval"
                    : "Mark as Complete"}
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground transition-all hover:bg-muted active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CompletionAttachmentsModal
        open={showCompletionModal}
        onOpenChange={setShowCompletionModal}
        onConfirm={handleComplete}
        isSubmitting={isCompleting}
      />

      <ImagePreview
        open={!!previewSrc}
        onOpenChange={(open) => { if (!open) setPreviewSrc(null) }}
        src={previewSrc || ""}
        fileName={previewFileName}
      />
    </>
  )
}
