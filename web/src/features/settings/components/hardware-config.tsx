"use client"

import * as React from "react"
import { Cpu, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MOCK_SETTINGS } from "../data/mock-settings"

export const HardwareConfig = () => {
  const [heartbeatInterval, setHeartbeatInterval] = React.useState(MOCK_SETTINGS.heartbeatInterval)

  const handleHeartbeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeartbeatInterval(Number(event.target.value))
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Cpu className="size-5 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">Hardware Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
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
              <CheckCircle className="absolute right-3 top-2 size-4 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
              ESP-NOW Channel Selection
            </label>
            <Select defaultValue={MOCK_SETTINGS.espNowChannel}>
              <SelectTrigger className="w-full bg-transparent border-input text-foreground h-8">
                <SelectValue placeholder="Select ESP-NOW Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Channel 01 (2412 MHz)">Channel 01 (2412 MHz)</SelectItem>
                <SelectItem value="Channel 06 (2437 MHz)">Channel 06 (2437 MHz)</SelectItem>
                <SelectItem value="Channel 11 (2462 MHz)">Channel 11 (2462 MHz)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 md:col-span-2">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Mesh Node Heartbeat Interval
                </span>
                <span className="text-primary font-bold">{heartbeatInterval}ms</span>
              </div>
              <input
                type="range"
                min="1000"
                max="30000"
                step="1000"
                value={heartbeatInterval}
                onChange={handleHeartbeatChange}
                className="w-full accent-primary bg-muted rounded-lg appearance-none h-2 cursor-pointer"
                aria-label="Mesh Node Heartbeat Interval"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>High Frequency</span>
                <span>Energy Saving</span>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between border-l-4 border-primary">
              <div>
                <p className="text-sm font-bold text-foreground">Gateway Status</p>
                <p className="text-xs text-muted-foreground">ESP32-S3 Optimized</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent px-3 py-1 font-bold">
                ACTIVE
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}