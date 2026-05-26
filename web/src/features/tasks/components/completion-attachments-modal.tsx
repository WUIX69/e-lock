"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Camera, X } from "lucide-react"
import { ImagePreview } from "@/components/ui/image-preview"

interface CompletionAttachmentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (files: File[]) => void
  isSubmitting: boolean
  requireAttachments?: boolean
}

export const CompletionAttachmentsModal = ({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  requireAttachments = true,
}: CompletionAttachmentsModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files)
    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== file))
  }

  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [previewFileName, setPreviewFileName] = useState<string>("")

  const handleConfirm = () => {
    onConfirm(selectedFiles)
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Completion Attachments</DialogTitle>
        <DialogDescription>
          {requireAttachments
            ? "Upload proof of completion for this task. At least one file is required."
            : "Upload proof of completion for this task (optional)."}
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
                {selectedFiles.map((file) => {
                  const objectUrl = URL.createObjectURL(file)
                  const isImg = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name)
                  return (
                    <div
                      key={file.name}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-2 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (isImg) {
                            setPreviewSrc(objectUrl)
                            setPreviewFileName(file.name)
                          } else {
                            window.open(objectUrl, "_blank")
                          }
                        }}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      >
                        {isImg ? (
                          <Image
                            src={objectUrl}
                            alt={file.name}
                            width={48}
                            height={48}
                            unoptimized
                            className="shrink-0 rounded object-cover h-12 w-12"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground text-lg">
                            📄
                          </div>
                        )}
                        <span className="flex-1 truncate text-foreground">
                          {file.name}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(file)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )
                })}
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
            disabled={(selectedFiles.length === 0 && requireAttachments) || isSubmitting}
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : selectedFiles.length === 0 && !requireAttachments
                ? "Mark as Complete"
                : "Submit Proof"}
          </button>
        </div>
      </DialogContent>
    </Dialog>

    <ImagePreview
      open={!!previewSrc}
      onOpenChange={(open) => { if (!open) setPreviewSrc(null) }}
      src={previewSrc || ""}
      fileName={previewFileName}
    />
    </>
  )
}
