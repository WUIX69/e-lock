"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RegisterHardwareForm } from "@/features/devices/components/register-hardware-form"

interface RegisterHardwareDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const RegisterHardwareDialog = ({
  isOpen,
  onOpenChange,
}: RegisterHardwareDialogProps) => {
  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-background p-6 sm:max-w-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Register New Hardware
          </DialogTitle>
        </DialogHeader>

        <RegisterHardwareForm onSuccess={handleClose} onCancel={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
