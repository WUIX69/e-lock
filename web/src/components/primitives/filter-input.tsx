"use client"

import * as React from "react"
import { Search } from "lucide-react"

interface FilterInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
}

export function FilterInput({
  placeholder = "Search...",
  className,
  ...props
}: FilterInputProps) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        placeholder={placeholder}
        className={`h-9 w-56 rounded-xl border border-border bg-card pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary ${className || ""}`}
        {...props}
      />
    </div>
  )
}
