"use client"

import * as React from "react"
import { Shield, AlertTriangle } from "lucide-react"
import { MOCK_SETTINGS } from "../data/mock-settings"

export function SafetyThresholds() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-md border border-border/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-destructive/10 rounded-lg">
          <Shield className="size-5 text-destructive" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Safety Thresholds</h3>
      </div>

      <div className="space-y-6">
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
              defaultValue={MOCK_SETTINGS.voltageSensitivity}
              className="flex-grow"
            />
            <span className="text-sm font-bold w-12 text-right">
              {MOCK_SETTINGS.voltageSensitivity}v
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            TDR Grace Period (ms)
          </label>
          <input
            type="number"
            defaultValue={MOCK_SETTINGS.tdrGracePeriod}
            className="w-full bg-muted border-transparent focus:border-primary focus:ring-primary/20 rounded-lg py-2 px-4 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Shunt Trip Delay
          </label>
          <div className="flex items-center gap-2">
            <div className="h-10 w-full bg-muted rounded-lg flex items-center px-4">
              <span className="text-sm">{MOCK_SETTINGS.shuntTripDelay}ms</span>
            </div>
            <button className="h-10 px-4 bg-secondary text-secondary-foreground rounded-lg font-bold hover:brightness-95 transition-all text-sm">
              EDIT
            </button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="size-4 text-destructive" />
            <p className="text-xs font-bold text-destructive uppercase tracking-wider">
              Warning
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Lowering delays below 20ms may cause phantom trips in inductive
            loads.
          </p>
        </div>
      </div>
    </div>
  )
}