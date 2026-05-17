"use client"

import * as React from "react"
import { UserPlus, Download } from "lucide-react"
import { AddPersonnelDialog } from "./add-personnel-dialog"
import { AddPersonnelFab } from "./add-personnel-fab"

export const PersonnelPageActions = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <>
      <div className="ml-4 flex items-center gap-3 md:ml-0">
        <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold transition-colors hover:bg-muted">
          <Download className="size-4" />
          Export List
        </button>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-sidebar px-6 py-3 text-sm font-black tracking-widest text-sidebar-foreground uppercase shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <UserPlus className="size-4 text-sidebar-accent" />
          Enroll New Personnel
        </button>
      </div>

      <AddPersonnelDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <AddPersonnelFab onClick={() => setIsDialogOpen(true)} />
    </>
  )
}
