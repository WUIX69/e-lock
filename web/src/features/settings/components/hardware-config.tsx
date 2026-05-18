"use client"

import * as React from "react"
import { Cpu, CheckCircle } from "lucide-react"
import { MOCK_SETTINGS } from "../data/mock-settings"

export function HardwareConfig() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-md border border-border/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Cpu className="size-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Hardware Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
            MQTT Broker URL
          </label>
          <div className="relative">
            <input
              type="text"
              defaultValue={MOCK_SETTINGS.mqttBrokerUrl}
              className="w-full bg-muted border-transparent focus:border-primary focus:ring-primary/20 rounded-lg py-2 px-4 text-sm"
              readOnly
            />
            <CheckCircle className="absolute right-3 top-2.5 text-primary text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
            ESP-NOW Channel Selection
          </label>
          <select
            defaultValue={MOCK_SETTINGS.espNowChannel}
            className="w-full bg-muted border-transparent focus:border-primary focus:ring-primary/20 rounded-lg py-2 px-4 text-sm"
          >
            <option>Channel 01 (2412 MHz)</option>
            <option>Channel 06 (2437 MHz)</option>
            <option>Channel 11 (2462 MHz)</option>
          </select>
        </div>

        <div className="space-y-4 md:col-span-2">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Mesh Node Heartbeat Interval
              </span>
              <span className="text-primary font-bold">{MOCK_SETTINGS.heartbeatInterval}ms</span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="1000"
              defaultValue={MOCK_SETTINGS.heartbeatInterval}
              className="w-full"
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
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-bold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}