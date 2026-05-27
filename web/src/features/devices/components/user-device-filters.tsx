"use client"

import { Search } from "lucide-react"

interface UserDeviceFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  activeFilter: "all" | "nearby"
  onFilterChange: (value: "all" | "nearby") => void
}

export const UserDeviceFilters = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: UserDeviceFiltersProps) => {
  return (
    <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl flex-1">
        <label className="mb-2 block text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Global Discovery
        </label>
        <div className="group relative">
          <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-4 pr-4 pl-12 text-foreground shadow-md transition-all placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="Search facilities or industrial devices..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center rounded-xl bg-muted p-1 shadow-inner">
        <button
          onClick={() => onFilterChange("all")}
          className={`rounded-lg px-6 py-3 text-sm font-bold tracking-wide transition-all ${
            activeFilter === "all"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Devices
        </button>
        <button
          onClick={() => onFilterChange("nearby")}
          className={`rounded-lg px-6 py-3 text-sm font-bold tracking-wide transition-all ${
            activeFilter === "nearby"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Nearby Devices
        </button>
      </div>
    </section>
  )
}
