"use client"

import { useState, useMemo } from "react"

interface UsePaginationOptions {
  totalItems: number
  pageSize?: number
  initialPage?: number
}

export function usePagination({
  totalItems,
  pageSize = 6,
  initialPage = 0,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const safePage = Math.min(currentPage, totalPages - 1)
  const page = safePage < 0 ? 0 : safePage

  const startIndex = page * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    for (let i = 0; i < totalPages; i++) {
      pages.push(i)
    }
    return pages
  }, [totalPages])

  const goToPage = (index: number) => {
    setCurrentPage(Math.max(0, Math.min(index, totalPages - 1)))
  }

  const nextPage = () => goToPage(page + 1)
  const prevPage = () => goToPage(page - 1)

  const hasNext = page < totalPages - 1
  const hasPrev = page > 0

  const visiblePages = useMemo(() => {
    const maxVisible = 5
    if (totalPages <= maxVisible) return pageNumbers

    const half = Math.floor(maxVisible / 2)
    let start = page - half
    let end = page + half

    if (start < 0) {
      start = 0
      end = maxVisible - 1
    }
    if (end >= totalPages) {
      end = totalPages - 1
      start = end - maxVisible + 1
    }

    return pageNumbers.slice(start, end + 1)
  }, [page, totalPages, pageNumbers])

  return {
    page,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
    pageNumbers: visiblePages,
    setCurrentPage: goToPage,
  }
}
