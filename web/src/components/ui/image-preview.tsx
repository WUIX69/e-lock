"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImagePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  fileName: string
}

export const ImagePreview = ({
  open,
  onOpenChange,
  src,
  fileName,
}: ImagePreviewProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl border-border bg-background p-0 overflow-hidden">
        <DialogTitle className="sr-only">{fileName}</DialogTitle>
        {src && (
          <div className="flex items-center justify-center p-2 bg-black/5">
            <Image
              src={src}
              alt={fileName}
              width={1280}
              height={800}
              unoptimized
              className="max-h-[80vh] max-w-full rounded object-contain h-auto w-auto"
            />
          </div>
        )}
        <p className="px-4 pb-3 pt-1 text-center text-xs text-muted-foreground truncate">
          {fileName}
        </p>
      </DialogContent>
    </Dialog>
  )
}
