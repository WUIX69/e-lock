"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PersonnelForm } from "./personnel-form"
import { PersonnelRow } from "./columns"

interface PersonnelDialogAddProps {
  mode: "add"
  personnel?: never
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface PersonnelDialogEditProps {
  mode: "edit"
  personnel: PersonnelRow
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

type PersonnelDialogProps = PersonnelDialogAddProps | PersonnelDialogEditProps

const DIALOG_TITLES: Record<PersonnelDialogProps["mode"], string> = {
  add: "Register New Worker",
  edit: "Edit Personnel Details",
}

export const PersonnelDialog = ({
  mode,
  personnel,
  isOpen,
  onOpenChange,
}: PersonnelDialogProps) => {
  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-border bg-background p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {DIALOG_TITLES[mode]}
          </DialogTitle>
        </DialogHeader>

        {mode === "edit" ? (
          <PersonnelForm
            mode="edit"
            personnel={personnel}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        ) : (
          <PersonnelForm
            mode="add"
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
