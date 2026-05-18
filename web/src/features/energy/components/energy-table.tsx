"use client"

import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Wind, Droplets, Flame, Sliders } from "lucide-react"
import { MOCK_ENERGY_SOURCES } from "@/data/mock/energy"
import { cn } from "@/lib/utils"

const typeIcons = {
  electrical: Zap,
  pneumatic: Wind,
  hydraulic: Droplets,
  chemical: Flame,
}

const statusStyles = {
  connected:
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  isolated:
    "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  warning:
    "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
}

export const EnergyTable = () => {
  return (
    <Card className="border border-border/50 bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Source Registry
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            List of primary isolation checkpoints
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Sliders className="h-4 w-4" />
          <span className="sr-only">Table Settings</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4 pl-6 text-xs font-semibold tracking-wider uppercase">
                  Source Name
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold tracking-wider uppercase">
                  Type
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold tracking-wider uppercase">
                  Location
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold tracking-wider uppercase">
                  Hardware
                </TableHead>
                <TableHead className="py-4 pr-6 text-right text-xs font-semibold tracking-wider uppercase">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ENERGY_SOURCES.map((source) => {
                const Icon = typeIcons[source.type]
                return (
                  <TableRow
                    key={source.id}
                    className="group cursor-pointer transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {source.name}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground/80">
                        ID: {source.id}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground capitalize">
                          {source.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-foreground">
                        {source.location}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground/80">
                        {source.gridZone}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="secondary"
                        className="border border-border/30 text-xs font-medium"
                      >
                        {source.hardwareNode}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-bold tracking-wide uppercase",
                          statusStyles[source.status]
                        )}
                      >
                        {source.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
