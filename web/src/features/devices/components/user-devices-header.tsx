"use client"

import { Activity } from "lucide-react"

export const UserDevicesHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
          <h2 className="text-3xl font-black tracking-tighter text-foreground">
            Hardware Devices
          </h2>
        </div>
        <p className="ml-4 text-sm text-muted-foreground">
          Monitor and manage industrial devices across all sectors.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-accent-foreground shadow-sm">
        <Activity className="size-4" />
        <span className="text-[10px] font-black tracking-widest uppercase">
          3 Devices Online
        </span>
      </div>
    </div>
  )
}
