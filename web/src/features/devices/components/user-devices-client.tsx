"use client"

import { useState, useMemo } from "react"
import { UserDevice } from "@/types/devices"
import { UserDevicesHeader } from "@/features/devices/components/user-devices-header"
import { UserDeviceFilters } from "@/features/devices/components/user-device-filters"
import { UserDeviceGrid } from "@/features/devices/components/user-device-grid"

interface UserDevicesClientProps {
  devices: UserDevice[]
}

export const UserDevicesClient = ({ devices }: UserDevicesClientProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "nearby">("all")

  const filteredDevices = useMemo(
    () =>
      devices.filter((device) => {
        const matchesSearch =
          device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.sector.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
      }),
    [devices, searchQuery]
  )

  return (
    <div className="space-y-8 pb-12">
      <UserDevicesHeader />

      <UserDeviceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <UserDeviceGrid devices={filteredDevices} />
    </div>
  )
}
