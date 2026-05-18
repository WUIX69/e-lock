"use client"

import * as React from "react"
import { History, ShieldAlert, ShieldCheck, Info } from "lucide-react"
import { MOCK_RECENT_ACTIVITY } from "@/data/mock/dashboard"

export const RecentLogs = () => {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm md:col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="size-5 text-primary" />
          <h4 className="text-xs font-black tracking-widest text-foreground uppercase">
            Recent Access Logs
          </h4>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[8px] font-black tracking-widest text-muted-foreground uppercase">
          Live
        </span>
      </div>

      <div className="space-y-4">
        {MOCK_RECENT_ACTIVITY.slice(0, 4).map((log) => {
          const isAlert = log.isAlert
          const isSystem = log.user === "System"
          
          return (
            <div
              key={log.id}
              className="flex items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 transition-colors hover:bg-muted/50"
            >
              <div
                className={`mt-1 rounded-full p-2 ${
                  isAlert
                    ? "bg-destructive/10 text-destructive"
                    : isSystem
                    ? "bg-primary/10 text-primary"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                {isAlert ? (
                  <ShieldAlert className="size-4" />
                ) : isSystem ? (
                  <Info className="size-4" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-foreground">
                  {log.action}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span>{log.user}</span>
                  <span>•</span>
                  <span>{log.target}</span>
                </div>
              </div>
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {log.time}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
