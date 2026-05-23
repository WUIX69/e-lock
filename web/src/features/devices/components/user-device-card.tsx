"use client"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserDevice } from "@/types/devices"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserDeviceCardProps {
  device: UserDevice
}

const statusConfig = {
  operational: {
    label: "OPERATIONAL",
    dotColor: "bg-primary",
    pulse: "animate-pulse",
    badgeBg: "bg-primary/10",
    textColor: "text-primary",
  },
  offline: {
    label: "OFFLINE",
    dotColor: "bg-muted-foreground",
    pulse: "",
    badgeBg: "bg-muted",
    textColor: "text-muted-foreground",
  },
  maintenance: {
    label: "MAINTENANCE",
    dotColor: "bg-secondary",
    pulse: "",
    badgeBg: "bg-secondary/10",
    textColor: "text-secondary",
  },
}

export const UserDeviceCard = ({ device }: UserDeviceCardProps) => {
  const router = useRouter()
  const status = statusConfig[device.status]
  const isOffline = device.status === "offline"
  const initials = device.lastTechnician
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div
      className={cn(
        "group rounded-2xl border border-border/50 bg-card/70 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
        isOffline && "border-l-4 border-l-destructive"
      )}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <span
            className={cn(
              "mb-2 inline-flex items-center rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter",
              device.status === "operational" || device.status === "maintenance"
                ? "bg-accent-green text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {device.sector}
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {device.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            ID: {device.deviceId}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black",
              status.badgeBg,
              status.textColor
            )}
          >
            <span
              className={cn("h-2 w-2 rounded-full", status.dotColor, status.pulse)}
            />
            {status.label}
          </span>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last Technician</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 rounded-full">
              <AvatarImage src={device.lastTechnicianAvatar} alt={device.lastTechnician} />
              <AvatarFallback className="text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">
              {device.lastTechnician}
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-border/50" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {device.status === "offline" ? "Status Alert" : device.uptime ? "Uptime" : "Details"}
          </span>
          <span
            className={cn(
              "font-mono text-xs font-bold",
              isOffline ? "text-destructive" : "text-foreground"
            )}
          >
            {device.uptime || device.loadStatus || device.alert}
          </span>
        </div>
      </div>

      <button
        onClick={() => router.push(`/tasks/submit?deviceId=${device.id}`)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-black tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 group/btn"
      >
        SUBMIT TASK
        <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </div>
  )
}
