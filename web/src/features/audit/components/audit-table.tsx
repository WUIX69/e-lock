"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_AUDIT_LOGS } from "@/data/mock/audit-logs"

export function AuditTable() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="h-14 pl-8 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Personnel
                </TableHead>
                <TableHead className="h-14 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Machine ID
                </TableHead>
                <TableHead className="h-14 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Isolation Type
                </TableHead>
                <TableHead className="h-14 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Verification
                </TableHead>
                <TableHead className="h-14 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Timestamp
                </TableHead>
                <TableHead className="h-14 pr-8 text-right text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_AUDIT_LOGS.map((log) => (
                <TableRow
                  key={log.id}
                  className={cn(
                    "group h-20 border-border transition-colors",
                    log.status === "Blocked"
                      ? "bg-destructive/5 hover:bg-destructive/10"
                      : "hover:bg-muted/30"
                  )}
                >
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full text-xs font-black shadow-sm ring-4 ring-background",
                          log.person.error
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-muted text-primary"
                        )}
                      >
                        {log.person.initials}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            log.person.error
                              ? "text-destructive"
                              : "text-foreground"
                          )}
                        >
                          {log.person.name}
                        </span>
                        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                          {log.person.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-lg border-border bg-muted px-3 py-1 text-[10px] font-black tracking-widest"
                    >
                      {log.machineId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Zap className="size-3.5" />
                      {log.isolation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      {log.verification === "Biometric" ? (
                        <Fingerprint className="size-4 text-primary" />
                      ) : log.status === "Blocked" ? (
                        <ShieldAlert className="size-4 text-destructive" />
                      ) : (
                        <ShieldCheck className="size-4 text-muted-foreground" />
                      )}
                      {log.verification}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                    {log.time}
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <Badge
                      className={cn(
                        "rounded-full px-4 py-1 text-[10px] font-black tracking-widest uppercase shadow-sm",
                        log.status === "Secured" &&
                          "bg-accent text-accent-foreground",
                        log.status === "Active" &&
                          "bg-secondary text-secondary-foreground",
                        log.status === "Blocked" &&
                          "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Row */}
      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-8 py-4">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Showing 1 - {MOCK_AUDIT_LOGS.length} of 1,234 Records
        </p>
        <div className="flex items-center gap-2">
          <button
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-muted disabled:opacity-50"
            disabled
          >
            <ChevronLeft className="size-5" />
          </button>
          <button className="flex size-10 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-muted">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
