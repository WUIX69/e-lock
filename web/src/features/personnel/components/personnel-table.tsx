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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, Key } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const personnelData = [
  {
    id: "EMP-001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    department: "IT Security",
    status: "active",
    accessLevel: "Level 5 (All Areas)",
    initials: "JD",
  },
  {
    id: "EMP-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    department: "Operations",
    status: "active",
    accessLevel: "Level 3 (Building A & B)",
    initials: "JS",
  },
  {
    id: "EMP-003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Staff",
    department: "Warehouse",
    status: "suspended",
    accessLevel: "Level 1 (Warehouse Only)",
    initials: "MJ",
  },
  {
    id: "EMP-004",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Contractor",
    department: "Maintenance",
    status: "active",
    accessLevel: "Level 2 (Maintenance Areas)",
    initials: "SW",
  },
]

export function PersonnelTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Access Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnelData.map((person) => (
            <TableRow key={person.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{person.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {person.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{person.role}</TableCell>
              <TableCell>{person.department}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {person.accessLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    person.status === "active" ? "default" : "destructive"
                  }
                >
                  {person.status.charAt(0).toUpperCase() +
                    person.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Key className="mr-2 h-4 w-4" /> Manage Access
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash className="mr-2 h-4 w-4" /> Suspend User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
