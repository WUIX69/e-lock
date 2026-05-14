"use client"

import * as React from "react"
import { TrendingUp, AlertCircle } from "lucide-react"
import { MOCK_VOLTAGE_BARS } from "@/data/mock/dashboard"

export const VoltageChart = () => {
  return (
    <div className="col-span-1 rounded-3xl border border-border bg-card p-8 shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black tracking-widest text-muted-foreground uppercase">
              ZMPT101B Voltage
            </h4>
            <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
              <AlertCircle className="size-3" />
              0.2V RMS
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">Live Monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <TrendingUp className="size-5" />
          <span className="text-sm font-bold">+2.4%</span>
        </div>
      </div>

      <div className="mt-8 flex h-48 items-end gap-3">
        {MOCK_VOLTAGE_BARS.map((height, i) => (
          <div key={i} className="group relative flex-1">
            <div
              className="w-full rounded-t-lg bg-primary transition-all duration-500 group-hover:bg-primary/80"
              style={{ height: `${height}%` }}
            />
            {/* Tooltip placeholder */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded bg-foreground px-2 py-1 text-[10px] font-bold text-background">
                {height}V
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-[10px] font-bold tracking-widest text-muted-foreground/40 uppercase">
        <span>08:00 AM</span>
        <span>09:00 AM</span>
        <span>10:00 AM</span>
        <span>11:00 AM</span>
        <span>12:00 PM</span>
      </div>
    </div>
  )
}
