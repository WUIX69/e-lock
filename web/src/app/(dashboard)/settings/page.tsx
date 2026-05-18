import { Metadata } from "next"
import { HardwareConfig } from "@/features/settings/components/hardware-config"
import { SafetyThresholds } from "@/features/settings/components/safety-thresholds"
import { NetworkManagement } from "@/features/settings/components/network-management"
import { SecurityAccess } from "@/features/settings/components/security-access"
import { SystemBackups } from "@/features/settings/components/system-backups"

export const metadata: Metadata = {
  title: "System Settings | E-LOCK Management",
  description: "Configure hardware, safety thresholds, and system preferences",
}

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              System Settings
            </h2>
          </div>
          <p className="ml-4 text-sm text-muted-foreground">
            Configure hardware parameters, safety thresholds, and system
            preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <HardwareConfig />
        </div>

        <div className="lg:col-span-4">
          <SafetyThresholds />
        </div>

        <div className="lg:col-span-6">
          <NetworkManagement />
        </div>

        <div className="lg:col-span-6">
          <SecurityAccess />
        </div>

        <div className="lg:col-span-12">
          <SystemBackups />
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center text-muted-foreground">
        <div className="flex gap-4 items-center">
          <span className="text-xs font-mono">E-LOCK INDUSTRIAL FW v2.4.1-STABLE</span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase">System Online</span>
        </div>
        <p className="text-xs">© 2024 E-LOCK Industrial Safety Systems. All Rights Reserved.</p>
      </div>
    </div>
  )
}