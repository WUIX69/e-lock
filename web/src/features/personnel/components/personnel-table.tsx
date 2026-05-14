"use client"

import * as React from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCircle,
  ShieldCheck,
  Clock,
} from "lucide-react"
import { MOCK_PERSONNEL } from "@/data/mock/personnel"

export const PersonnelTable = () => {
  return (
    <div className="space-y-6">
      {/* Table Controls */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search personnel by name or ID..."
            className="w-full rounded-2xl border border-border bg-card py-3 pr-4 pl-11 text-sm transition-shadow focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-bold transition-colors hover:bg-muted">
            <Filter className="size-4" />
            Filter
          </button>
          <span className="ml-2 text-xs font-bold text-muted-foreground">
            Showing {MOCK_PERSONNEL.length} of 142 personnel
          </span>
        </div>
      </div>

      {/* Table container with horizontal scroll for mobile */}
      <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
        <div className="min-w-[1000px]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-bottom border-border bg-muted/50">
                <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Personnel
                </th>
                <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Clearance
                </th>
                <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Status
                </th>
                <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Last Access
                </th>
                <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Location
                </th>
                <th className="px-6 py-5 text-right text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_PERSONNEL.map((person) => (
                <tr
                  key={person.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <UserCircle className="size-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">
                          {person.name}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          {person.id} • {person.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        className={`size-4 ${person.clearance.includes("Admin") ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className="text-xs font-bold text-foreground">
                        {person.clearance}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                        person.status === "Active"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${person.status === "Active" ? "animate-pulse bg-primary" : "bg-muted-foreground"}`}
                      />
                      {person.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Clock className="size-3" />
                      {person.lastAccess}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-foreground">
                      {person.node}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
