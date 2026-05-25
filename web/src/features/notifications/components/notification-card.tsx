"use client"

import {
  ShieldAlert,
  CheckCircle2,
  HeartPulse,
  Bell,
  AlertTriangle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NotificationItem } from "@/types/notifications"

interface NotificationCardProps {
  notification: NotificationItem
  isAdmin: boolean
  onDismiss: (id: string) => void
  onAction: (id: string) => void
}

const severityBorderMap: Record<string, string> = {
  critical: "border-l-destructive",
  warning: "border-l-secondary",
  info: "border-l-primary",
  default: "border-l-border",
}

const severityIconMap: Record<string, typeof Bell> = {
  critical: ShieldAlert,
  warning: AlertTriangle,
  info: CheckCircle2,
  default: HeartPulse,
}

const severityBgMap: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  warning: "bg-secondary/10 text-secondary",
  info: "bg-primary/10 text-primary",
  default: "bg-muted text-muted-foreground",
}

const unreadDotMap: Record<string, string> = {
  critical: "bg-destructive",
  warning: "bg-secondary",
  info: "bg-primary",
  default: "bg-muted-foreground",
}

export const NotificationCard = ({
  notification: notificationItem,
  isAdmin,
  onDismiss,
  onAction,
}: NotificationCardProps) => {
  const IconComponent = severityIconMap[notificationItem.severity] || Bell

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/50 bg-background/50 p-4 transition-all hover:bg-muted/50",
        "border-l-4",
        severityBorderMap[notificationItem.severity] || "border-l-border",
        notificationItem.isRead ? "opacity-70 shadow-sm" : "shadow-md"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl",
            severityBgMap[notificationItem.severity]
          )}
        >
          <IconComponent className="size-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-foreground">
                {notificationItem.title}
              </p>
              {notificationItem.actorName && (
                <p className="text-xs font-medium text-muted-foreground">
                  by {notificationItem.actorName}
                </p>
              )}
            </div>
            <span className="shrink-0 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {notificationItem.timestamp}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {notificationItem.description}
          </p>

          {isAdmin && (
            <div className="flex items-center gap-2 pt-2">
              {notificationItem.severity === "critical" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onAction(notificationItem.id)}
                  aria-label="Execute emergency protocol"
                >
                  <AlertTriangle className="size-3.5" />
                  Emergency Protocol
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDismiss(notificationItem.id)}
                aria-label="Dismiss notification"
              >
                <X className="size-3.5" />
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>

      {!notificationItem.isRead && (
        <span
          className={cn(
            "absolute top-5 right-5 h-2 w-2 rounded-full",
            unreadDotMap[notificationItem.severity]
          )}
        />
      )}
    </div>
  )
}
