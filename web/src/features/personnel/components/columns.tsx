"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
  Shield,
  ShieldAlert,
  Circle,
  MoreHorizontal,
  MapPin,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { PersonnelDialog } from "./personnel-dialog"

export type PersonnelRow = {
  id: string
  employeeId: string
  name: string
  email: string
  role: "admin" | "user"
  position: string
  securityLevel: string
  status: "active" | "inactive" | "off-site" | "on-leave"
  lastLocation: string | null
  lastActiveAt: Date | null
}

const getStatusColor = (status: PersonnelRow["status"]) => {
  switch (status) {
    case "active":
      return "text-green-500 bg-green-500/10"
    case "off-site":
      return "text-orange-500 bg-orange-500/10"
    case "on-leave":
      return "text-blue-500 bg-blue-500/10"
    case "inactive":
      return "text-muted-foreground bg-muted"
    default:
      return "text-muted-foreground bg-muted"
  }
}

export const columns: ColumnDef<PersonnelRow>[] = [
  {
    accessorKey: "name",
    header: "Personnel",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const employeeId = row.original.employeeId
      const position = row.original.position

      return (
        <div className="flex items-center gap-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <span className="font-bold text-primary">{name.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {employeeId} • {position}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "securityLevel",
    header: "Access Level",
    cell: ({ row }) => {
      const level = row.getValue("securityLevel") as string
      const role = row.original.role
      const isAdmin = role === "admin"

      return (
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <ShieldAlert className="size-4 text-primary" />
          ) : (
            <Shield className="size-4 text-muted-foreground" />
          )}
          <span
            className={cn("text-sm font-medium", isAdmin && "text-primary")}
          >
            {level}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as PersonnelRow["status"]
      const colors = getStatusColor(status)

      return (
        <div
          className={cn(
            "flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black tracking-widest uppercase",
            colors
          )}
        >
          <Circle className="size-2 fill-current" />
          {status.replace("-", " ")}
        </div>
      )
    },
  },
  {
    accessorKey: "lastActiveAt",
    header: "Last Active",
    cell: ({ row }) => {
      const date = row.getValue("lastActiveAt") as Date | null

      if (!date)
        return <span className="text-sm text-muted-foreground">Unknown</span>

      // Extremely simple relative time for demonstration
      const diffMs = Date.now() - new Date(date).getTime()
      const diffMins = Math.floor(diffMs / 60000)

      let relativeTime = ""
      if (diffMins < 1) relativeTime = "Just now"
      else if (diffMins < 60) relativeTime = `${diffMins}m ago`
      else if (diffMins < 1440)
        relativeTime = `${Math.floor(diffMins / 60)}h ago`
      else relativeTime = `${Math.floor(diffMins / 1440)}d ago`

      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          <span>{relativeTime}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "lastLocation",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("lastLocation") as string | null
      return (
        <div className="flex items-center gap-2 text-sm font-medium">
          {location !== "N/A" && (
            <MapPin className="size-4 text-muted-foreground" />
          )}
          <span>{location || "N/A"}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: function ActionsCell({ row }) {
      const personnel = row.original
      const [isEditDialogOpen, setIsEditDialogOpen] =
        React.useState<boolean>(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(personnel.employeeId)
                }
              >
                Copy Employee ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Edit access level
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Revoke access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <PersonnelDialog
            mode="edit"
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            personnel={personnel}
          />
        </>
      )
    },
  },
]
