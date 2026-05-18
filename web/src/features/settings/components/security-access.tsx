"use client"

import * as React from "react"
import { Fingerprint, Download, Loader2, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_SETTINGS } from "@/data/mock/settings"

export const SecurityAccess = () => {
  const [retryCount, setRetryCount] = React.useState(
    MOCK_SETTINGS.biometricRetryLimit
  )
  const [pinTimeout, setPinTimeout] = React.useState(MOCK_SETTINGS.pinTimeout)
  const [isCheckingUpdate, setIsCheckingUpdate] = React.useState(false)
  const [updateStatus, setUpdateStatus] = React.useState<string | null>(null)

  const handleIncrementRetry = () => {
    setRetryCount((prevCount) => Math.min(10, prevCount + 1))
  }

  const handleDecrementRetry = () => {
    setRetryCount((prevCount) => Math.max(1, prevCount - 1))
  }

  const handleTimeoutChange = (value: string) => {
    setPinTimeout(value)
  }

  const handleCheckUpdates = () => {
    setIsCheckingUpdate(true)
    setUpdateStatus(null)
    // HACK: Simulate checking for e-lock firmware updates over secure channels
    setTimeout(() => {
      setIsCheckingUpdate(false)
      setUpdateStatus("Firmware is up to date")
    }, 1500)
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="shrink-0 rounded-lg bg-secondary/10 p-2">
          <Fingerprint className="size-5 text-secondary-foreground" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          Security & Access
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border/20 bg-muted/50 p-3">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Biometric Scan Retry Limit
            </span>
            <span className="text-xs text-muted-foreground">
              Current Default: {retryCount} attempts
            </span>
          </div>
          <div className="flex items-center overflow-hidden rounded-md border border-border/50 bg-background">
            <button
              onClick={handleDecrementRetry}
              className="flex h-8 items-center justify-center border-r border-border/50 px-3 py-1 font-bold text-foreground transition-colors hover:bg-muted"
              aria-label="Decrease biometric scan retry limit"
            >
              −
            </button>
            <span className="px-4 text-sm font-bold text-foreground">
              {retryCount}
            </span>
            <button
              onClick={handleIncrementRetry}
              className="flex h-8 items-center justify-center border-l border-border/50 px-3 py-1 font-bold text-foreground transition-colors hover:bg-muted"
              aria-label="Increase biometric scan retry limit"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/20 bg-muted/50 p-3">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Global PIN Fallback Timeout
            </span>
            <span className="text-xs text-muted-foreground">
              Minutes until reset
            </span>
          </div>
          <Select value={pinTimeout} onValueChange={handleTimeoutChange}>
            <SelectTrigger
              className="h-9 w-[110px] border-border/50 bg-background font-medium text-foreground"
              aria-label="Global PIN Fallback Timeout"
            >
              <SelectValue placeholder="Select timeout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5 min">5 min</SelectItem>
              <SelectItem value="15 min">15 min</SelectItem>
              <SelectItem value="60 min">60 min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">
              Firmware Update Management
            </p>
            <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold tracking-wider text-secondary-foreground uppercase">
              {MOCK_SETTINGS.firmwareVersion}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCheckUpdates}
              disabled={isCheckingUpdate}
              className="flex h-10 flex-grow items-center justify-center gap-2 bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90"
              aria-label="Check for firmware updates"
            >
              {isCheckingUpdate ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  CHECKING...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  CHECK FOR UPDATES
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex h-10 w-12 items-center justify-center border border-border/50 bg-background text-muted-foreground hover:bg-muted"
              aria-label="More options"
            >
              <MoreHorizontal className="size-5" />
            </Button>
          </div>
          {updateStatus && (
            <p className="animate-fade-in mt-2 text-center text-xs font-semibold text-primary">
              {updateStatus}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
