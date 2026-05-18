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
  const [retryCount, setRetryCount] = React.useState(MOCK_SETTINGS.biometricRetryLimit)
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
        <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
          <Fingerprint className="size-5 text-secondary-foreground" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">Security & Access</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/20">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Biometric Scan Retry Limit
            </span>
            <span className="text-xs text-muted-foreground">
              Current Default: {retryCount} attempts
            </span>
          </div>
          <div className="flex items-center bg-background rounded-md border border-border/50 overflow-hidden">
            <button
              onClick={handleDecrementRetry}
              className="px-3 py-1 hover:bg-muted text-foreground transition-colors font-bold h-8 flex items-center justify-center border-r border-border/50"
              aria-label="Decrease biometric scan retry limit"
            >
              −
            </button>
            <span className="px-4 font-bold text-sm text-foreground">{retryCount}</span>
            <button
              onClick={handleIncrementRetry}
              className="px-3 py-1 hover:bg-muted text-foreground transition-colors font-bold h-8 flex items-center justify-center border-l border-border/50"
              aria-label="Increase biometric scan retry limit"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/20">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Global PIN Fallback Timeout
            </span>
            <span className="text-xs text-muted-foreground">Minutes until reset</span>
          </div>
          <Select value={pinTimeout} onValueChange={handleTimeoutChange}>
            <SelectTrigger className="w-[110px] bg-background border-border/50 text-foreground h-9 font-medium" aria-label="Global PIN Fallback Timeout">
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
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-foreground">
              Firmware Update Management
            </p>
            <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {MOCK_SETTINGS.firmwareVersion}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCheckUpdates}
              disabled={isCheckingUpdate}
              className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 flex items-center justify-center gap-2 text-sm"
              aria-label="Check for firmware updates"
            >
              {isCheckingUpdate ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
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
              className="w-12 h-10 border border-border/50 flex items-center justify-center text-muted-foreground bg-background hover:bg-muted"
              aria-label="More options"
            >
              <MoreHorizontal className="size-5" />
            </Button>
          </div>
          {updateStatus && (
            <p className="text-xs font-semibold text-primary mt-2 animate-fade-in text-center">
              {updateStatus}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}