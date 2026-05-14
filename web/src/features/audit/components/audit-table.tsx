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

const logs = [
  {
    id: "LOG-001",
    person: { name: "Alex Thompson", role: "Sr. Electrician", initials: "AT" },
    machineId: "MC-402",
    isolation: "Electrical",
    verification: "Biometric",
    time: "2024-05-14 08:41:22",
    status: "Secured",
  },
  {
    id: "LOG-002",
    person: { name: "Sarah Jenkins", role: "Safety Lead", initials: "SJ" },
    machineId: "CONV-12",
    isolation: "Mechanical",
    verification: "PIN + Tag",
    time: "2024-05-14 09:12:05",
    status: "Active",
  },
  {
    id: "LOG-003",
    person: { name: "Unrecognized", role: "Unauthorized", initials: "??", error: true },
    machineId: "PUMP-04",
    isolation: "Fluid",
    verification: "Failed Attempt",
    time: "2024-05-14 10:05:41",
    status: "Blocked",
  },
  {
    id: "LOG-004",
    person: { name: "Michael Zhao", role: "Maintenance", initials: "MZ" },
    machineId: "GEN-01",
    isolation: "Multiple",
    verification: "Biometric",
    time: "2024-05-14 10:45:18",
    status: "Secured",
  },
]

export function AuditTable() {
  return (
    <div className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-8">
              Personnel
            </TableHead>
            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Machine ID
            </TableHead>
            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Isolation Type
            </TableHead>
            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Verification
            </TableHead>
            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Timestamp
            </TableHead>
            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pr-8 text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className={cn(
                "group border-border transition-colors h-20",
                log.status === "Blocked"
                  ? "bg-destructive/5 hover:bg-destructive/10"
                  : "hover:bg-muted/30"
              )}
            >
              <TableCell className="pl-8">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-full text-xs font-black ring-4 ring-background shadow-sm",
                    log.person.error ? "bg-destructive text-destructive-foreground" : "bg-muted text-primary"
                  )}>
                    {log.person.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-sm font-bold",
                      log.person.error ? "text-destructive" : "text-foreground"
                    )}>
                      {log.person.name}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {log.person.role}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="rounded-lg bg-muted border-border text-[10px] font-black tracking-widest px-3 py-1">
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
              <TableCell className="text-xs font-mono font-medium text-muted-foreground">
                {log.time}
              </TableCell>
              <TableCell className="pr-8 text-right">
                <Badge
                  className={cn(
                    "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm",
                    log.status === "Secured" && "bg-accent text-accent-foreground",
                    log.status === "Active" && "bg-secondary text-secondary-foreground",
                    log.status === "Blocked" && "bg-destructive text-destructive-foreground"
                  )}
                >
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Row */}
      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-8 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Showing 1 - 24 of 1,234 Records
        </p>
        <div className="flex items-center gap-2">
          <button className="flex size-10 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-muted disabled:opacity-50" disabled>
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
