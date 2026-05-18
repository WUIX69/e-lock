"use client"

import * as React from "react"
import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MOCK_SETTINGS } from "@/data/mock/settings"

export const SafetyThresholds = () => {
  const [voltageSensitivity, setVoltageSensitivity] = React.useState(MOCK_SETTINGS.voltageSensitivity)
  const [tdrGracePeriod, setTdrGracePeriod] = React.useState(MOCK_SETTINGS.tdrGracePeriod)
  const [shuntTripDelay, setShuntTripDelay] = React.useState(MOCK_SETTINGS.shuntTripDelay)
  const [isEditingShunt, setIsEditingShunt] = React.useState(false)

  const handleVoltageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoltageSensitivity(Number(event.target.value))
  }

  const handleGracePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTdrGracePeriod(Number(event.target.value))
  }

  const handleShuntDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShuntTripDelay(Number(event.target.value))
  }

  const handleToggleShuntEdit = () => {
    setIsEditingShunt((prevEditState) => !prevEditState)
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 bg-destructive/10 rounded-lg shrink-0">
          <Shield className="size-5 text-destructive" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">Safety Thresholds</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
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
              className="flex-grow accent-primary bg-muted rounded-lg appearance-none h-2 cursor-pointer"
              aria-label="ZMPT101B Voltage Sensitivity"
            />
            <span className="text-sm font-bold w-12 text-right">
              {voltageSensitivity.toFixed(2)}v
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            TDR Grace Period (ms)
          </label>
          <Input
            type="number"
            value={tdrGracePeriod}
            onChange={handleGracePeriodChange}
            className="w-full bg-transparent border-input text-foreground h-8"
            aria-label="TDR Grace Period (ms)"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Shunt Trip Delay
          </label>
          <div className="flex items-center gap-2">
            {isEditingShunt ? (
              <Input
                type="number"
                value={shuntTripDelay}
                onChange={handleShuntDelayChange}
                className="w-full bg-transparent border-input text-foreground h-8"
                aria-label="Shunt Trip Delay (ms)"
              />
            ) : (
              <div className="h-8 w-full bg-muted/50 border border-border/50 rounded-lg flex items-center px-3">
                <span className="text-sm font-medium text-foreground">{shuntTripDelay}ms</span>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleShuntEdit}
              className="h-8 font-bold"
              aria-label={isEditingShunt ? "Save Shunt Trip Delay" : "Edit Shunt Trip Delay"}
            >
              {isEditingShunt ? "SAVE" : "EDIT"}
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="size-4 text-destructive" />
            <p className="text-xs font-bold text-destructive uppercase tracking-wider">
              Warning
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-normal">
            Lowering delays below 20ms may cause phantom trips in inductive
            loads.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}