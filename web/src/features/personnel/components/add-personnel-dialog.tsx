"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddPersonnelForm } from "./add-personnel-form"

interface AddPersonnelDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const AddPersonnelDialog = ({ isOpen, onOpenChange }: AddPersonnelDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-border bg-background p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Register New Worker
          </DialogTitle>
        </DialogHeader>
        
        <AddPersonnelForm 
          onSuccess={() => onOpenChange(false)} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}
