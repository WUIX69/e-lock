"use client"

import { MOCK_TASK_TYPES } from "@/data/mock/tasks"
import { Device } from "@/types/devices"

interface ResourceSelectionProps {
  deviceId: string
  taskType: string
  devices: Device[]
  defaultDeviceId?: string
  onDeviceIdChange: (value: string) => void
  onTaskTypeChange: (value: string) => void
}

export const ResourceSelection = ({
  deviceId,
  taskType,
  devices,
  defaultDeviceId = "",
  onDeviceIdChange,
  onTaskTypeChange,
}: ResourceSelectionProps) => {
  const isPreselected = !!defaultDeviceId
  const selectedDevice = isPreselected
    ? devices.find((d) => d.id === defaultDeviceId)
    : null

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Machine / Device ID
        </label>
        {isPreselected && selectedDevice ? (
          <div className="w-full rounded-lg border border-border bg-muted/50 p-3 font-body-md text-foreground">
            {selectedDevice.assignedMachine} ({selectedDevice.deviceId})
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
          {MOCK_TASK_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
