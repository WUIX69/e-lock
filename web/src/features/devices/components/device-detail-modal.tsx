"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Wifi,
  SignalHigh,
  Activity,
  Cpu,
  Fingerprint,
  Loader2,
  Pencil,
  Check,
  X,
  Router,
  Zap,
} from "lucide-react"
import { Device, DeviceType } from "@/types/devices"
import { cn } from "@/lib/utils"
import { updateDeviceAction } from "@/features/devices/server/actions/devices"

const DEVICE_TYPE_OPTIONS: {
  value: DeviceType
  label: string
  icon: React.ElementType
  desc: string
}[] = [
  {
    value: "field_controller",
    label: "Controller",
    icon: Router,
    desc: "Field I/O module",
  },
  {
    value: "gateway",
    label: "Gateway",
    icon: Wifi,
    desc: "Mesh coordinator",
  },
  {
    value: "shunt_trip",
    label: "Shunt Trip",
    icon: Zap,
    desc: "Breaker interface",
  },
]

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "warning", label: "Warning" },
  { value: "offline", label: "Offline" },
  { value: "maintenance", label: "Maintenance" },
]

const getSignalIcon = (strength: number) => {
  if (strength === 0) return "Uplink Stable"
  if (strength > -60) return "Good"
  if (strength > -80) return "Fair"
  return "Weak"
}

interface DeviceDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: Device
  mode: "view" | "edit"
  onModeChange: (mode: "view" | "edit") => void
  onDeviceUpdated?: () => void
}

export const DeviceDetailModal = ({
  open,
  onOpenChange,
  device,
  mode,
  onModeChange,
  onDeviceUpdated,
}: DeviceDetailModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await updateDeviceAction(device.id, formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    onDeviceUpdated?.()
    onOpenChange(false)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border border-green-500/20"
      case "warning":
        return "bg-orange-500/10 text-orange-500 border border-orange-500/20"
      case "offline":
        return "bg-muted text-muted-foreground border border-border"
      case "maintenance":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground border border-border"
    }
  }

  const signalQuality = getSignalIcon(device.signalStrength)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Cpu className="size-5" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">
                {mode === "view" ? "Device Details" : "Edit Device"}
              </DialogTitle>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase ${statusColor(device.status)}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {device.status}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-primary">
              {device.type === "field_controller"
                ? "Field Controller"
                : device.type === "shunt_trip"
                  ? "Shunt Trip"
                  : "Gateway"}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
              {device.deviceId}
            </span>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Cpu className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter text-foreground leading-tight">
                {device.deviceUniqueName}
              </h3>
              <p className="text-sm font-mono text-muted-foreground">
                {device.type.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {mode === "edit" ? (
            <form id="device-edit-form" onSubmit={handleSave} className="space-y-6">
              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                  {error}
                </div>
              )}

              {/* Device ID (read-only) */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                  Device ID
                </Label>
                <Input
                  value={device.deviceId}
                  readOnly
                  className="h-12 rounded-xl border-border bg-muted/50 font-mono text-sm opacity-70"
                />
              </div>

              {/* MAC Address (read-only) */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                  MAC Address
                </Label>
                <Input
                  value="24:6F:28:AE:D3:8C"
                  readOnly
                  className="h-12 rounded-xl border-border bg-muted/50 font-mono text-sm opacity-70"
                />
              </div>

              {/* Hardware Type */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                  Hardware Type
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {DEVICE_TYPE_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = device.type === opt.value
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-muted/50 hover:border-muted-foreground/30"
                        )}
                      >
                        <input
                          type="radio"
                          name="hardwareType"
                          value={opt.value}
                          defaultChecked={isSelected}
                          className="sr-only"
                        />
                        <Icon
                          className={cn(
                            "size-6",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs font-black tracking-wider",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {opt.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Device Name */}
              <div className="grid gap-2">
                <Label
                  htmlFor="deviceUniqueName"
                  className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
                >
                  Device Name
                </Label>
                <Input
                  id="deviceUniqueName"
                  name="deviceUniqueName"
                  defaultValue={device.deviceUniqueName}
                  className="h-12 rounded-xl border-border bg-muted font-mono text-sm focus-visible:ring-primary"
                  required
                />
              </div>

              {/* Status */}
              <div className="grid gap-2">
                <Label
                  htmlFor="status"
                  className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
                >
                  Status
                </Label>
                <Select name="status" defaultValue={device.status}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-border bg-muted px-4 font-mono text-sm focus:ring-primary">
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent className="p-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* High Priority */}
              <div className="flex items-center gap-4 rounded-2xl border border-secondary/30 bg-secondary/5 p-5">
                <Checkbox
                  id="isHighPriority"
                  name="isHighPriority"
                  value="true"
                  className="size-5 rounded-lg border-2 data-checked:border-secondary data-checked:bg-secondary"
                />
                <div>
                  <Label
                    htmlFor="isHighPriority"
                    className="cursor-pointer text-xs font-black tracking-wider text-foreground"
                  >
                    High-Priority Device
                  </Label>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Enables dedicated safety channel with reduced latency.
                  </p>
                </div>
              </div>
            </form>
          ) : (
            <>
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex gap-3 rounded-xl border border-border/30 bg-muted/30 p-4">
                  <Activity className="size-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      Signal Strength
                    </p>
                    <p className="text-lg font-bold text-foreground leading-tight mt-1">
                      {signalQuality}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {device.signalStrength === 0
                        ? "Uplink"
                        : `${device.signalStrength} dBm`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl border border-border/30 bg-muted/30 p-4">
                  <SignalHigh className="size-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      Last Heartbeat
                    </p>
                    <p className="text-lg font-bold text-foreground leading-tight mt-1">
                      {device.lastHeartbeat}
                    </p>
                  </div>
                </div>
              </div>

              {/* Biometrics Profile */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Fingerprint className="size-4 text-primary" />
                  <h4 className="text-base font-bold tracking-tight text-foreground">
                    Device Identity
                  </h4>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Hardware Type:
                    </span>
                    <span className="font-mono font-bold text-foreground capitalize">
                      {device.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border/30 pt-2">
                    <span className="text-muted-foreground font-medium">
                      Device Name:
                    </span>
                    <span className="font-bold text-primary">
                      {device.deviceUniqueName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact & Metadata */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Cpu className="size-4 text-primary" />
                  <h4 className="text-base font-bold tracking-tight text-foreground">
                    Network Information
                  </h4>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                    <Wifi className="size-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        Device Identifier
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5 font-mono">
                        {device.deviceId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                    <Activity className="size-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        Status
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5 capitalize">
                        {device.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-6 py-4">
          {mode === "view" ? (
            <>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-xs text-primary transition-all hover:bg-primary/20 active:scale-95"
                onClick={() => onModeChange("edit")}
                aria-label="Edit device"
              >
                <Pencil className="size-3.5" />
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Edit
                </span>
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onModeChange("view")}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs text-foreground transition-all hover:bg-muted active:scale-95"
              >
                <X className="size-3.5" />
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Cancel
                </span>
              </button>
              <button
                type="submit"
                form="device-edit-form"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  {isSubmitting ? "Saving..." : "Save"}
                </span>
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
