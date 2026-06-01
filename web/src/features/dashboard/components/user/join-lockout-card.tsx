"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Shield,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import { Invitation } from "@/features/tasks/components/invitations-modal"
import { respondToInvitationAction } from "@/features/tasks/server/actions/tasks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface JoinLockoutCardProps {
  invitations: Invitation[]
  onRefresh?: () => void
}

const taskTypeColors: Record<string, string> = {
  "Preventative Maintenance": "bg-primary/10 text-primary",
  "Emergency Repair":
    "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
  "General Record / Log": "bg-muted text-muted-foreground",
  "Safety Inspection":
    "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
}

export const JoinLockoutCard = ({
  invitations,
  onRefresh,
}: JoinLockoutCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isResponding, setIsResponding] = useState(false)

  if (invitations.length === 0) {
    return (
      <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-sidebar-border bg-sidebar p-8 text-center shadow-lg">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-sidebar-accent/10">
          <Shield className="size-7 text-sidebar-accent-foreground" />
        </div>
        <h3 className="text-xl font-black tracking-tight text-sidebar-foreground">
          Join Lockout
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-sidebar-foreground/60">
          No Active Safety Invitations
        </p>
        <p className="mt-1 max-w-[220px] text-xs text-sidebar-foreground/40">
          Collaborative lockout requests from coworkers will appear here.
        </p>
        <Link
          href="/tasks"
          className="mt-6 flex items-center gap-2 rounded-2xl bg-sidebar-accent/10 px-5 py-3 text-xs font-black tracking-widest text-sidebar-accent-foreground uppercase transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Go to Tasks Ledger
          <ArrowRight className="size-4" />
        </Link>
      </div>
    )
  }

  const currentInvite = invitations[currentIndex]
  const hasMultiple = invitations.length > 1

  const handleRespond = async (accept: boolean) => {
    setIsResponding(true)
    await respondToInvitationAction(currentInvite.taskId, accept)
    setIsResponding(false)
    onRefresh?.()
  }

  return (
    <div className="relative mr-4 mb-4">
      {/* Stack effect layers */}
      {hasMultiple && (
        <>
          <div className="absolute inset-0 -z-20 translate-x-4 translate-y-4 rounded-3xl border border-sidebar-border bg-sidebar/30 shadow-sm" />
          <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl border border-sidebar-border bg-sidebar/50 shadow-md" />
        </>
      )}

      {/* Main card */}
      <div className="relative flex flex-col overflow-hidden rounded-3xl border border-sidebar-border bg-sidebar p-8 shadow-lg">
        <div className="pointer-events-none absolute top-4 right-6 text-6xl leading-none font-black text-sidebar-foreground/5 select-none">
          {currentInvite.deviceLabel || "LS"}
        </div>

        <h3 className="text-2xl font-black tracking-tight text-sidebar-foreground">
          Join Lockout
        </h3>

        <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-sidebar-foreground/60">
          Collaborative safety handshake requested.
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 rounded-full border-2 border-sidebar-border">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentInvite.creatorName}`}
                alt={currentInvite.creatorName}
              />
              <AvatarFallback className="text-xs font-bold">
                {currentInvite.creatorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold text-sidebar-foreground/80">
                {currentInvite.creatorName}
              </p>
              <p className="text-[10px] text-sidebar-foreground/40">
                {currentInvite.deviceName || currentInvite.deviceLabel || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-sidebar-foreground leading-snug">
              {currentInvite.taskSubject}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                taskTypeColors[currentInvite.taskType] ||
                "bg-muted text-muted-foreground"
              }`}
            >
              {currentInvite.taskType}
            </span>
          </div>
        </div>

        {/* Pagination */}
        {hasMultiple && (
          <div className="mt-5 flex items-center justify-between border-t border-sidebar-border/50 pt-4">
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
              Prev
            </button>
            <span className="text-[11px] font-bold text-sidebar-foreground/40">
              {currentIndex + 1} of {invitations.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((i) => Math.min(invitations.length - 1, i + 1))
              }
              disabled={currentIndex === invitations.length - 1}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground disabled:opacity-30"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => handleRespond(false)}
            disabled={isResponding}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-sidebar-border py-3 text-xs font-black tracking-widest text-sidebar-foreground/60 uppercase transition-all hover:bg-destructive/10 hover:text-destructive active:scale-[0.98] disabled:opacity-50"
          >
            {isResponding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleRespond(true)}
            disabled={isResponding}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-secondary py-3 text-xs font-black tracking-widest text-secondary-foreground uppercase shadow-lg shadow-secondary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {isResponding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
