"use client"

import * as React from "react"
import { Cpu, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MOCK_SETTINGS } from "@/data/mock/settings"

export const HardwareConfig = () => {
  const [heartbeatInterval, setHeartbeatInterval] = React.useState(
    MOCK_SETTINGS.heartbeatInterval
  )

  const handleHeartbeatChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHeartbeatInterval(Number(event.target.value))
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="shrink-0 rounded-lg bg-primary/10 p-2">
          <Cpu className="size-5 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          Hardware Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-wider text-muted-foreground uppercase">
              MQTT Broker URL
            </label>
            <div className="relative">
              <Input
                type="text"
                defaultValue={MOCK_SETTINGS.mqttBrokerUrl}
                className="w-full pr-10"
                readOnly
                aria-label="MQTT Broker URL"
              />
              <CheckCircle className="absolute top-2 right-3 size-4 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-wider text-muted-foreground uppercase">
              ESP-NOW Channel Selection
            </label>
            <Select defaultValue={MOCK_SETTINGS.espNowChannel}>
              <SelectTrigger className="h-8 w-full border-input bg-transparent text-foreground">
                <SelectValue placeholder="Select ESP-NOW Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Channel 01 (2412 MHz)">
                  Channel 01 (2412 MHz)
                </SelectItem>
                <SelectItem value="Channel 06 (2437 MHz)">
                  Channel 06 (2437 MHz)
                </SelectItem>
                <SelectItem value="Channel 11 (2462 MHz)">
                  Channel 11 (2462 MHz)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 md:col-span-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Mesh Node Heartbeat Interval
                </span>
                <span className="font-bold text-primary">
                  {heartbeatInterval}ms
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="30000"
                step="1000"
                value={heartbeatInterval}
                onChange={handleHeartbeatChange}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                aria-label="Mesh Node Heartbeat Interval"
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>High Frequency</span>
                <span>Energy Saving</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border-l-4 border-primary bg-muted/50 p-4">
              <div>
                <p className="text-sm font-bold text-foreground">
                  Gateway Status
                </p>
                <p className="text-xs text-muted-foreground">
                  ESP32-S3 Optimized
                </p>
              </div>
              <Badge
                variant="secondary"
                className="border-transparent bg-primary/10 px-3 py-1 font-bold text-primary"
              >
                ACTIVE
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
