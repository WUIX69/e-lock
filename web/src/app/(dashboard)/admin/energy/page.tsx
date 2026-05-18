import { Metadata } from "next"
import { EnergyStats } from "@/features/energy/components/energy-stats"
import { EnergyTable } from "@/features/energy/components/energy-table"
import { HardwareConnectivity } from "@/features/energy/components/hardware-connectivity"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Energy Sources | E-LOCK Management",
  description: "Manage and monitor all primary energy isolation points",
}

const EnergyPage = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-primary" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              Energy Isolation Registry
            </h2>
          </div>
          <p className="ml-4 text-sm text-muted-foreground">
            Manage and monitor all primary energy isolation points across the
            facility.
          </p>
        </div>

        <Button className="font-semibold shadow-sm transition-all duration-200 active:scale-95">
          <Plus className="mr-2 h-4 w-4" />
          Add New Energy Source
        </Button>
      </div>

      <EnergyStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EnergyTable />
        </div>

        <div className="space-y-6">
          <HardwareConnectivity />
        </div>
      </div>
    </div>
  )
}

export default EnergyPage
