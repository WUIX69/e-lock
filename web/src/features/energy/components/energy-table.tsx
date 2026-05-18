"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  connected: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  isolated: "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
}

export const EnergyTable = () => {
  return (
    <Card className="border border-border/50 shadow-sm bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">Source Registry</CardTitle>
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
                <TableHead className="font-semibold text-xs tracking-wider uppercase py-4 pl-6">
                  Source Name
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase py-4">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase py-4">
                  Location
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase py-4">
                  Hardware
                </TableHead>
                <TableHead className="font-semibold text-xs tracking-wider uppercase py-4 pr-6 text-right">
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
                    className="hover:bg-muted/30 cursor-pointer group transition-colors"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {source.name}
                      </div>
                      <div className="text-xs text-muted-foreground/80 mt-0.5">
                        ID: {source.id}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize text-sm font-medium text-foreground">
                          {source.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-foreground font-medium">
                        {source.location}
                      </div>
                      <div className="text-xs text-muted-foreground/80 mt-0.5">
                        {source.gridZone}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className="font-medium text-xs border border-border/30">
                        {source.hardwareNode}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Badge
                        variant="outline"
                        className={cn("font-bold text-xs uppercase tracking-wide", statusStyles[source.status])}
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