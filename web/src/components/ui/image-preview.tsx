"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

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
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden border-border bg-background p-0">
        <DialogTitle className="sr-only">{fileName}</DialogTitle>
        {src && (
          <div className="flex items-center justify-center bg-black/5 p-2">
            <Image
              src={src}
              alt={fileName}
              width={1280}
              height={800}
              unoptimized
              className="h-auto max-h-[80vh] w-auto max-w-full rounded object-contain"
            />
          </div>
        )}
        <p className="truncate px-4 pt-1 pb-3 text-center text-xs text-muted-foreground">
          {fileName}
        </p>
      </DialogContent>
    </Dialog>
  )
}
