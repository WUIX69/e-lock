"use client"

import * as React from "react"
import { Plus } from "lucide-react"

interface AddPersonnelFabProps {
  onClick: () => void
}

export const AddPersonnelFab = ({ onClick }: AddPersonnelFabProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 flex size-14 items-center justify-center rounded-full bg-sidebar shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="Enroll New Personnel"
    >
      <Plus className="size-6 text-sidebar-foreground transition-transform duration-300 group-hover:rotate-90" />
    </button>
  )
}
