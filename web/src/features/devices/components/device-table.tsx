"use client"

import * as React from "react"
import {
  SignalLow,
  SignalMedium,
  SignalHigh,
  Wifi,
  MoreHorizontal,
} from "lucide-react"
import { MOCK_DEVICES } from "@/data/mock/devices"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SignalIconProps {
  strength: number
}

const SignalIcon = ({ strength }: SignalIconProps) => {
  if (strength === 0)
    return <Wifi className="size-4 animate-pulse text-primary" />
  if (strength > -60) return <SignalHigh className="size-4 text-primary" />
  if (strength > -80) return <SignalMedium className="size-4 text-secondary" />
  return <SignalLow className="size-4 text-destructive" />
}

export const DeviceTable = () => {
  return (
    <Card className="overflow-hidden rounded-[2rem] border border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-card p-8">
        <CardTitle className="text-2xl font-bold text-foreground">
          Hardware Fleet
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          aria-label="More fleet actions"
        >
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="border-b border-border/50 bg-muted/20 hover:bg-muted/20">
                <TableHead className="h-12 px-8 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Device ID
                </TableHead>
                <TableHead className="h-12 px-8 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Type
                </TableHead>
                <TableHead className="h-12 px-8 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Assigned Machine
                </TableHead>
                <TableHead className="h-12 px-8 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Signal Strength
                </TableHead>
                <TableHead className="h-12 px-8 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Last Heartbeat
                </TableHead>
                <TableHead className="h-12 px-8 py-4 text-right text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {MOCK_DEVICES.map((innerDevice) => (
                <TableRow
                  key={innerDevice.id}
                  className={`group border-b border-border/30 transition-colors hover:bg-muted/30 ${
                    innerDevice.status === "warning"
                      ? "bg-destructive/5 hover:bg-destructive/10"
                      : ""
                  }`}
                >
                  <TableCell className="h-16 px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          innerDevice.status === "active"
                            ? "animate-pulse bg-primary"
                            : innerDevice.status === "warning"
                              ? "bg-destructive"
                              : "bg-muted-foreground"
                        }`}
                      />
                      <span className="rounded-md border border-border/35 bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
                        {innerDevice.deviceId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-16 px-8 py-6 font-semibold text-foreground capitalize">
                    {innerDevice.type.replace("_", " ")}
                  </TableCell>
                  <TableCell className="h-16 px-8 py-6 text-muted-foreground">
                    {innerDevice.assignedMachine}
                  </TableCell>
                  <TableCell className="h-16 px-8 py-6">
                    <div className="flex items-center gap-2">
                      <SignalIcon strength={innerDevice.signalStrength} />
                      <span
                        className={`text-xs font-bold ${
                          innerDevice.status === "warning"
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        {innerDevice.signalStrength === 0
                          ? "Uplink Stable"
                          : `${innerDevice.signalStrength} dBm${
                              innerDevice.signalStrength < -80 ? " (LOW)" : ""
                            }`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-16 px-8 py-6 text-muted-foreground">
                    {innerDevice.lastHeartbeat}
                  </TableCell>
                  <TableCell className="h-16 px-8 py-6 text-right">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-8 p-0 text-sm font-bold text-primary hover:text-primary/80"
                      aria-label={`Configure ${innerDevice.deviceId}`}
                    >
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Showing 4 of 42 hardware devices
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-border/50 px-4 text-sm font-semibold hover:bg-muted"
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Button
              size="sm"
              className="h-9 px-4 text-sm font-semibold shadow-sm"
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
