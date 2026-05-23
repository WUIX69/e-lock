"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationBarProps {
  page: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  pageNumbers: number[]
  hasNext: boolean
  hasPrev: boolean
  onNext: () => void
  onPrev: () => void
  onGoToPage: (page: number) => void
}

export const PaginationBar = ({
  page,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  pageNumbers,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  onGoToPage,
}: PaginationBarProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 p-6">
      <p className="text-sm font-medium text-muted-foreground">
        Showing {startIndex + 1}–{endIndex} of {totalItems}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onGoToPage(pageNum)}
            className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors ${
              pageNum === page
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            aria-label={`Page ${pageNum + 1}`}
            aria-current={pageNum === page ? "page" : undefined}
          >
            {pageNum + 1}
          </button>
        ))}

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
