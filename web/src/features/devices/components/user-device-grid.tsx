"use client"

import { UserDevice } from "@/types/devices"
import { UserDeviceCard } from "./user-device-card"
import { PaginationBar } from "@/components/ui/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"

interface UserDeviceGridProps {
  devices: UserDevice[]
}

export const UserDeviceGrid = ({ devices }: UserDeviceGridProps) => {
  const pagination = usePagination({ totalItems: devices.length, pageSize: 9 })
  const pageDevices = devices.slice(pagination.startIndex, pagination.endIndex)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pageDevices.map((device) => (
          <UserDeviceCard key={device.id} device={device} />
        ))}
      </div>

      <PaginationBar
        page={pagination.page}
        totalPages={pagination.totalPages}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={devices.length}
        pageNumbers={pagination.pageNumbers}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        onNext={pagination.nextPage}
        onPrev={pagination.prevPage}
        onGoToPage={pagination.goToPage}
      />
    </div>
  )
}
