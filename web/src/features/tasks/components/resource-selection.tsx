"use client"

import { AlertTriangle } from "lucide-react"
import { MOCK_TASK_TYPES } from "@/data/mock/tasks"
import { Device } from "@/types/devices"

interface ResourceSelectionProps {
  deviceId: string
  taskType: string
  devices: Device[]
  defaultDeviceId?: string
  userSecurityLevel?: number
  onDeviceIdChange: (value: string) => void
  onTaskTypeChange: (value: string) => void
}

const RESTRICTED_STATUSES = ["offline", "maintenance"]

export const ResourceSelection = ({
  deviceId,
  taskType,
  devices,
  defaultDeviceId = "",
  userSecurityLevel,
  onDeviceIdChange,
  onTaskTypeChange,
}: ResourceSelectionProps) => {
  const isPreselected = !!defaultDeviceId
  const selectedDevice = isPreselected
    ? devices.find((d) => d.id === defaultDeviceId)
    : null

  const isRestricted =
    selectedDevice &&
    RESTRICTED_STATUSES.includes(selectedDevice.status)

  const securityLevel = userSecurityLevel ?? 0
  const availableTaskTypes =
    securityLevel < 4
      ? MOCK_TASK_TYPES.filter(
          (t) =>
            t.value === "General Record / Log" ||
            t.value === "Safety Inspection"
        )
      : MOCK_TASK_TYPES

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Machine / Device ID
        </label>
        {isPreselected && selectedDevice ? (
          <div>
            <div className="w-full rounded-lg border border-border bg-muted/50 p-3 font-body-md text-foreground">
              {selectedDevice.assignedMachine} ({selectedDevice.deviceId})
            </div>
            {isRestricted && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  This device is currently &quot;{selectedDevice.status}&quot;.
                  Only Senior Engineers and Admins can submit tasks on
                  restricted devices.
                </span>
              </div>
            )}
          </div>
        ) : (
          <select
            value={deviceId}
            onChange={(e) => onDeviceIdChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted p-3 font-body-md text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="">Select a Device...</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.assignedMachine} ({device.deviceId})
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="space-y-2">
        <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Task Type
        </label>
        <select
          value={taskType}
          onChange={(e) => onTaskTypeChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted p-3 font-body-md text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="">Select Category...</option>
          {availableTaskTypes.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
