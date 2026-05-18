"use client"

import * as React from "react"
import { Activity } from "lucide-react"
import { Area, AreaChart, XAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  voltage: {
    label: "Voltage",
    color: "var(--primary)",
  },
} satisfies ChartConfig

import { TelemetrySample } from "@/types/user-dashboard"

export function UserTelemetryChart({ data }: { data: TelemetrySample[] }) {
  return (
    <section className="col-span-12 rounded-3xl border border-border bg-card p-8 shadow-sm lg:col-span-7">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground">
            <Activity className="size-5 text-primary" />
            Live Telemetry
          </h3>
          <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            ZMPT101B Voltage Reading - Phase 1
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white shadow-lg shadow-primary/20">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          <span className="text-sm font-black tracking-widest uppercase">
            224.8V
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="fillVoltageUser"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-voltage)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-voltage)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Area
                dataKey="voltage"
                type="monotone"
                fill="url(#fillVoltageUser)"
                stroke="var(--color-voltage)"
                strokeWidth={4}
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase">
        <span>-30s</span>
        <span className="text-primary/60">Real-time Frequency: 60.02Hz</span>
        <span>Now</span>
      </div>
    </section>
  )
}
