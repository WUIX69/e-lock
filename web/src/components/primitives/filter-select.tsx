"use client"

import * as React from "react"

interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

export function FilterSelect({ options, className, ...props }: FilterSelectProps) {
  return (
    <select
      className={`h-9 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground ${className || ""}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
