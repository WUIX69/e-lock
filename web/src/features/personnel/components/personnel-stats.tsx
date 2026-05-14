"use client"

import * as React from "react"
import { Users, UserCheck, ShieldAlert, Activity } from "lucide-react"

const stats = [
  {
    label: "Total Personnel",
    value: "142",
    icon: Users,
    color: "bg-primary",
  },
  {
    label: "Active on Site",
    value: "24",
    icon: UserCheck,
    color: "bg-sidebar-accent",
  },
  {
    label: "High Clearance",
    value: "12",
    icon: Activity,
    color: "bg-foreground",
  },
  {
    label: "Access Denials",
    value: "3",
    icon: ShieldAlert,
    color: "bg-destructive",
  },
]

export const PersonnelStats = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex size-12 items-center justify-center rounded-2xl ${stat.color} text-white shadow-lg transition-transform group-hover:scale-110`}
            >
              <stat.icon className="size-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </p>
              <p className="text-2xl font-black tracking-tighter text-foreground">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
