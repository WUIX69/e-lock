"use client"

import * as React from "react"
import { TrendingUp, AlertCircle } from "lucide-react"
import { Area, AreaChart, XAxis } from "recharts"
import { MOCK_VOLTAGE_BARS } from "@/data/mock/dashboard"
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

export const VoltageChart = () => {
  // Transform flat mock data into chart-ready format
  const chartData = React.useMemo(() => {
    return MOCK_VOLTAGE_BARS.map((value, index) => ({
      time: index,
      voltage: value,
    }))
  }, [])

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

      <div className="mt-8">
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <AreaChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id="fillVoltage" x1="0" y1="0" x2="0" y2="1">
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
            <XAxis
              dataKey="time"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value}s`}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="voltage"
              type="monotone"
              fill="url(#fillVoltage)"
              stroke="var(--color-voltage)"
              strokeWidth={4}
              animationDuration={1500}
            />
          </AreaChart>
        </ChartContainer>
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
