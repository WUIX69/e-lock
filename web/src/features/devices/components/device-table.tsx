"use client"

import * as React from "react"
import {
  SignalLow,
  SignalMedium,
  SignalHigh,
  Wifi,
  MoreHorizontal,
} from "lucide-react"
import { MOCK_DEVICES } from "../data/mock-devices"

function SignalIcon({ strength }: { strength: number }) {
  if (strength === 0) return <Wifi className="size-4 text-primary" />
  if (strength > -60) return <SignalHigh className="size-4 text-primary" />
  if (strength > -80) return <SignalMedium className="size-4 text-secondary" />
  return <SignalLow className="size-4 text-destructive" />
}

export function DeviceTable() {
  return (
    <div className="bg-card rounded-[2rem] shadow-lg border border-border/20 overflow-hidden">
      <div className="p-8 border-b border-border/20 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Hardware Fleet</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Device ID
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Machine
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Signal Strength
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Last Heartbeat
              </th>
              <th className="px-8 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {MOCK_DEVICES.map((device) => (
              <tr
                key={device.id}
                className={`hover:bg-muted/30 transition-colors group ${
                  device.status === "warning" ? "bg-destructive/5" : ""
                }`}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        device.status === "active"
                          ? "bg-primary animate-pulse"
                          : device.status === "warning"
                          ? "bg-destructive"
                          : "bg-muted"
                      }`}
                    />
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {device.deviceId}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 font-medium text-foreground capitalize">
                  {device.type.replace("_", " ")}
                </td>
                <td className="px-8 py-6 text-muted-foreground">
                  {device.assignedMachine}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <SignalIcon strength={device.signalStrength} />
                    <span
                      className={`text-xs font-bold ${
                        device.status === "warning"
                          ? "text-destructive"
                          : "text-foreground"
                      }`}
                    >
                      {device.signalStrength === 0
                        ? "Uplink Stable"
                        : `${device.signalStrength} dBm${
                            device.signalStrength < -80 ? " (LOW)" : ""
                          }`}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-muted-foreground">
                  {device.lastHeartbeat}
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-primary hover:underline font-bold text-sm">
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-muted/30 flex justify-between items-center">
        <p className="text-sm text-muted-foreground font-medium">
          Showing 4 of 42 hardware devices
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border/30 rounded-lg hover:bg-muted transition-colors text-sm">
            Previous
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-colors text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}