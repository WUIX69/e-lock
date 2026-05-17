import { Metadata } from "next"
import { PersonnelStats } from "@/features/personnel/components/personnel-stats"
import { AccessControlPanel } from "@/features/personnel/components/access-control-panel"
import { PersonnelPageActions } from "@/features/personnel/components/personnel-page-actions"
import { DataTable } from "@/features/personnel/components/data-table"
import { columns } from "@/features/personnel/components/columns"
import { getAllPersonnel } from "@/features/personnel/server/db"

export const metadata: Metadata = {
  title: "Personnel | E-LOCK Management",
  description: "Manage facility personnel and biometric access clearance",
}

export default async function PersonnelPage() {
  const personnel = await getAllPersonnel()
  
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              Personnel & Clearances
            </h2>
          </div>
          <p className="ml-4 text-sm text-muted-foreground">
            Authorization management for industrial isolation protocols and node
            access.
          </p>
        </div>

        <PersonnelPageActions />
      </div>

      <PersonnelStats />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight">Active Personnel Roster</h3>
            <DataTable columns={columns} data={personnel} />
          </div>
        </div>
        <div>
          <AccessControlPanel />
        </div>
      </div>
    </div>
  )
}
