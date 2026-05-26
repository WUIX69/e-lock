"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Camera, X } from "lucide-react"

interface CompletionAttachmentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (fileNames: string[]) => void
  isSubmitting: boolean
}

export const CompletionAttachmentsModal = ({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: CompletionAttachmentsModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files).map((f) => f.name)
    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== fileName))
  }

  const handleConfirm = () => {
    onConfirm(selectedFiles)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Completion Attachments</DialogTitle>
        <DialogDescription>
          Upload proof of completion for this task. At least one file is
          required.
        </DialogDescription>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
              Completion Proof Files
            </label>
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-6 transition-colors hover:bg-accent-green/10">
              <Camera className="mb-3 size-8 text-primary" />
              <label className="cursor-pointer">
                <span className="font-body-md text-muted-foreground">
                  Drag images here or{" "}
                  <span className="font-bold text-primary underline">
                    browse files
                  </span>
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="mt-1 text-xs text-muted-foreground/60">
                PNG, JPG, PDF up to 10MB each
              </p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground">
                Selected Files ({selectedFiles.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((fileName) => (
                  <div
                    key={fileName}
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs"
                  >
                    <span className="text-foreground">{fileName}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(fileName)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-full border border-border px-6 py-2.5 text-xs font-bold text-muted-foreground transition-all hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedFiles.length === 0 || isSubmitting}
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Proof"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
