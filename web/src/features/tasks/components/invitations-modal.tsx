"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { respondToInvitationAction } from "@/features/tasks/server/actions/tasks"
import { Check, X, Loader2 } from "lucide-react"

export interface Invitation {
  id: string
  taskId: string
  taskSubject: string
  taskType: string
  taskPriority: string
  taskDescription: string | null
  creatorName: string
  deviceName: string | null
  deviceLabel: string | null
  submittedAt: Date
}

interface InvitationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invitations: Invitation[]
  onRefresh: () => void
}

const taskTypeColors: Record<string, string> = {
  "Preventative Maintenance": "bg-primary/10 text-primary",
  "Emergency Repair":
    "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
  "General Record / Log": "bg-muted text-muted-foreground",
  "Safety Inspection":
    "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
}

export function InvitationsModal({
  open,
  onOpenChange,
  invitations,
  onRefresh,
}: InvitationsModalProps) {
  const [actingId, setActingId] = useState<string | null>(null)

  if (invitations.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="text-lg font-black tracking-tight">
            Pending Invitations
          </DialogTitle>
          <p className="py-8 text-center text-sm text-muted-foreground">
            You have no pending invitations.
          </p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogTitle className="text-lg font-black tracking-tight">
          Pending Invitations ({invitations.length})
        </DialogTitle>
        <div className="space-y-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="space-y-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <h4 className="truncate font-bold text-foreground">
                    {inv.taskSubject}
                  </h4>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      taskTypeColors[inv.taskType] ||
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {inv.taskType}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-black tracking-wider text-muted-foreground uppercase">
                  {inv.taskPriority}
                </span>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Creator: </span>
                  {inv.creatorName}
                </p>
                <p>
                  <span className="font-medium text-foreground">Device: </span>
                  {inv.deviceName || inv.deviceLabel || "N/A"}
                </p>
                {inv.taskDescription && (
                  <p className="line-clamp-2">{inv.taskDescription}</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    setActingId(inv.taskId)
                    await respondToInvitationAction(inv.taskId, true)
                    setActingId(null)
                    onRefresh()
                  }}
                  disabled={actingId === inv.taskId}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  {actingId === inv.taskId ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Check className="size-3" />
                  )}
                  Accept
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setActingId(inv.taskId)
                    await respondToInvitationAction(inv.taskId, false)
                    setActingId(null)
                    onRefresh()
                  }}
                  disabled={actingId === inv.taskId}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-50"
                >
                  <X className="size-3" />
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
