"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditPersonnelForm } from "./edit-personnel-form"
import { PersonnelRow } from "./columns"

interface EditPersonnelDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  personnel: PersonnelRow
}

export const EditPersonnelDialog = ({
  isOpen,
  onOpenChange,
  personnel,
}: EditPersonnelDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-border bg-background p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Edit Personnel Details
          </DialogTitle>
        </DialogHeader>

        <EditPersonnelForm
          personnel={personnel}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
