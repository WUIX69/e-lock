"use client"

import * as React from "react"
import { Loader2, Router, Wifi, Zap, Gauge } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { addDeviceAction } from "@/features/devices/server/actions/devices"
import { MOCK_DEVICES } from "@/data/mock/devices"

type HardwareType = "controller" | "gateway" | "shunt_trip"

const HARDWARE_OPTIONS: {
  value: HardwareType
  label: string
  icon: React.ElementType
  desc: string
}[] = [
  {
    value: "controller",
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

const machineOptions = Array.from(
  new Set(MOCK_DEVICES.map((d) => d.assignedMachine))
)

interface RegisterHardwareFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export const RegisterHardwareForm = ({
  onSuccess,
  onCancel,
}: RegisterHardwareFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [hardwareType, setHardwareType] =
    React.useState<HardwareType>("controller")

  const [deviceId, setDeviceId] = React.useState("")

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeviceId(`NODE-${Math.floor(100 + Math.random() * 900)}`)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(event.currentTarget)
      formData.set("hardwareType", hardwareType)
      const result = await addDeviceAction(formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      onSuccess()
    } catch {
      setError("An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <Label
          htmlFor="deviceId"
          className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
        >
          Device ID
        </Label>
        <Input
          id="deviceId"
          name="deviceId"
          value={deviceId}
          readOnly
          className="h-14 rounded-2xl border-border bg-muted/50 font-mono text-sm opacity-70"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Hardware Type
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {HARDWARE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isSelected = hardwareType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setHardwareType(opt.value)}
                disabled={isLoading}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-muted/50 hover:border-muted-foreground/30"
                )}
              >
                <Icon
                  className={cn(
                    "size-7",
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
                <span className="text-[9px] tracking-widest text-muted-foreground/60 uppercase">
                  {opt.desc}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="assignedMachine"
          className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
        >
          Assigned Machine
        </Label>
        <Select name="assignedMachine" disabled={isLoading}>
          <SelectTrigger className="h-14 w-full rounded-2xl border-border bg-muted px-4 py-6 font-mono text-sm focus:ring-primary">
            <SelectValue placeholder="Select machine..." />
          </SelectTrigger>
          <SelectContent className="p-2">
            {machineOptions.map((machine) => (
              <SelectItem key={machine} value={machine}>
                {machine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="macAddress"
          className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
        >
          MAC Address
        </Label>
        <div className="group relative">
          <Gauge className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="macAddress"
            name="macAddress"
            placeholder="A1:B2:C3:D4:E5:F6"
            className="h-14 w-full rounded-2xl border-border bg-muted pl-12 font-mono text-sm tracking-wider focus-visible:ring-primary"
            pattern="^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$"
            title="Format: A1:B2:C3:D4:E5:F6"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-secondary/30 bg-secondary/5 p-5">
        <Checkbox
          id="espNowPriority"
          name="espNowPriority"
          value="high"
          disabled={isLoading}
          className="size-5 rounded-lg border-2 data-checked:border-secondary data-checked:bg-secondary"
        />
        <div>
          <Label
            htmlFor="espNowPriority"
            className="cursor-pointer text-xs font-black tracking-wider text-foreground"
          >
            ESP-NOW High-Priority Routing
          </Label>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Enables dedicated safety channel with reduced latency for critical
            lockout commands.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex h-12 items-center justify-center rounded-xl bg-muted px-6 text-xs font-black tracking-widest text-muted-foreground uppercase transition-colors hover:bg-muted/80 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-black tracking-widest text-primary-foreground uppercase shadow-lg transition-transform",
            isLoading
              ? "cursor-not-allowed opacity-70"
              : "hover:scale-105 active:scale-95"
          )}
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          Provision Device
        </button>
      </div>
    </form>
  )
}
