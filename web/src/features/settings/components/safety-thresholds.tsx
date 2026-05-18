"use client"

import * as React from "react"
import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MOCK_SETTINGS } from "@/data/mock/settings"

export const SafetyThresholds = () => {
  const [voltageSensitivity, setVoltageSensitivity] = React.useState(
    MOCK_SETTINGS.voltageSensitivity
  )
  const [tdrGracePeriod, setTdrGracePeriod] = React.useState(
    MOCK_SETTINGS.tdrGracePeriod
  )
  const [shuntTripDelay, setShuntTripDelay] = React.useState(
    MOCK_SETTINGS.shuntTripDelay
  )
  const [isEditingShunt, setIsEditingShunt] = React.useState(false)

  const handleVoltageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoltageSensitivity(Number(event.target.value))
  }

  const handleGracePeriodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTdrGracePeriod(Number(event.target.value))
  }

  const handleShuntDelayChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShuntTripDelay(Number(event.target.value))
  }

  const handleToggleShuntEdit = () => {
    setIsEditingShunt((prevEditState) => !prevEditState)
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="shrink-0 rounded-lg bg-destructive/10 p-2">
          <Shield className="size-5 text-destructive" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          Safety Thresholds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            ZMPT101B Voltage Sensitivity
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={voltageSensitivity}
              onChange={handleVoltageChange}
              className="h-2 flex-grow cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
              aria-label="ZMPT101B Voltage Sensitivity"
            />
            <span className="w-12 text-right text-sm font-bold">
              {voltageSensitivity.toFixed(2)}v
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            TDR Grace Period (ms)
          </label>
          <Input
            type="number"
            value={tdrGracePeriod}
            onChange={handleGracePeriodChange}
            className="h-8 w-full border-input bg-transparent text-foreground"
            aria-label="TDR Grace Period (ms)"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            Shunt Trip Delay
          </label>
          <div className="flex items-center gap-2">
            {isEditingShunt ? (
              <Input
                type="number"
                value={shuntTripDelay}
                onChange={handleShuntDelayChange}
                className="h-8 w-full border-input bg-transparent text-foreground"
                aria-label="Shunt Trip Delay (ms)"
              />
            ) : (
              <div className="flex h-8 w-full items-center rounded-lg border border-border/50 bg-muted/50 px-3">
                <span className="text-sm font-medium text-foreground">
                  {shuntTripDelay}ms
                </span>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleShuntEdit}
              className="h-8 font-bold"
              aria-label={
                isEditingShunt
                  ? "Save Shunt Trip Delay"
                  : "Edit Shunt Trip Delay"
              }
            >
              {isEditingShunt ? "SAVE" : "EDIT"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="size-4 text-destructive" />
            <p className="text-xs font-bold tracking-wider text-destructive uppercase">
              Warning
            </p>
          </div>
          <p className="text-xs leading-normal text-muted-foreground">
            Lowering delays below 20ms may cause phantom trips in inductive
            loads.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
