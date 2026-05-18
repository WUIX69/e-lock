"use client"

import * as React from "react"
import {
  SignalLow,
  SignalMedium,
  SignalHigh,
  Wifi,
  MoreHorizontal,
} from "lucide-react"
import { MOCK_DEVICES } from "../data/mock-devices"
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
  if (strength === 0) return <Wifi className="size-4 text-primary animate-pulse" />
  if (strength > -60) return <SignalHigh className="size-4 text-primary" />
  if (strength > -80) return <SignalMedium className="size-4 text-secondary" />
  return <SignalLow className="size-4 text-destructive" />
}

export const DeviceTable = () => {
  return (
    <Card className="rounded-[2rem] border border-border/50 overflow-hidden shadow-lg">
      <CardHeader className="p-8 border-b border-border/50 flex flex-row justify-between items-center bg-card">
        <CardTitle className="text-2xl font-bold text-foreground">Hardware Fleet</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg h-9 w-9"
          aria-label="More fleet actions"
        >
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/50">
                <TableHead className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider h-12">
                  Device ID
                </TableHead>
                <TableHead className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider h-12">
                  Type
                </TableHead>
                <TableHead className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider h-12">
                  Assigned Machine
                </TableHead>
                <TableHead className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider h-12">
                  Signal Strength
                </TableHead>
                <TableHead className="px-8 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider h-12">
                  Last Heartbeat
                </TableHead>
                <TableHead className="px-8 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider h-12">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {MOCK_DEVICES.map((innerDevice) => (
                <TableRow
                  key={innerDevice.id}
                  className={`hover:bg-muted/30 transition-colors border-b border-border/30 group ${
                    innerDevice.status === "warning" ? "bg-destructive/5 hover:bg-destructive/10" : ""
                  }`}
                >
                  <TableCell className="px-8 py-6 h-16">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          innerDevice.status === "active"
                            ? "bg-primary animate-pulse"
                            : innerDevice.status === "warning"
                            ? "bg-destructive"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-xs font-mono bg-muted text-muted-foreground px-2.5 py-1 rounded-md border border-border/35">
                        {innerDevice.deviceId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 font-semibold text-foreground capitalize h-16">
                    {innerDevice.type.replace("_", " ")}
                  </TableCell>
                  <TableCell className="px-8 py-6 text-muted-foreground h-16">
                    {innerDevice.assignedMachine}
                  </TableCell>
                  <TableCell className="px-8 py-6 h-16">
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
                  <TableCell className="px-8 py-6 text-muted-foreground h-16">
                    {innerDevice.lastHeartbeat}
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right h-16">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary hover:text-primary/80 font-bold text-sm h-8 p-0"
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

        <div className="p-6 bg-muted/20 border-t border-border/50 flex justify-between items-center">
          <p className="text-sm text-muted-foreground font-medium">
            Showing 4 of 42 hardware devices
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 text-sm font-semibold border-border/50 hover:bg-muted"
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