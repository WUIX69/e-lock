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

const auditLogs = [
  {
    id: "LOG-1029",
    timestamp: "2024-05-14T08:45:00Z",
    user: "John Doe",
    action: "ACCESS_GRANTED",
    resource: "Main Server Room",
    status: "success",
    ip: "192.168.1.105",
  },
  {
    id: "LOG-1028",
    timestamp: "2024-05-14T08:32:00Z",
    user: "Jane Smith",
    action: "ACCESS_DENIED",
    resource: "Executive Office",
    status: "failure",
    ip: "192.168.1.202",
  },
  {
    id: "LOG-1027",
    timestamp: "2024-05-14T07:15:00Z",
    user: "System",
    action: "FIRMWARE_UPDATE",
    resource: "Warehouse Entry B",
    status: "success",
    ip: "10.0.0.1",
  },
  {
    id: "LOG-1026",
    timestamp: "2024-05-14T06:50:00Z",
    user: "Mike Johnson",
    action: "LOCK_RESTART",
    resource: "Warehouse Entry B",
    status: "success",
    ip: "192.168.1.118",
  },
  {
    id: "LOG-1025",
    timestamp: "2024-05-13T18:30:00Z",
    user: "Sarah Williams",
    action: "ACCESS_GRANTED",
    resource: "Server Room B",
    status: "success",
    ip: "192.168.1.109",
  },
]

export function AuditTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Log ID</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.id}</TableCell>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell>{log.resource}</TableCell>
              <TableCell>
                <Badge
                  variant={log.status === "success" ? "default" : "destructive"}
                >
                  {log.status === "success" ? "Success" : "Failure"}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-muted-foreground">
                {log.ip}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
