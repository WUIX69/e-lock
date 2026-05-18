import { LucideIcon } from "lucide-react"

export interface PersonnelStat {
  label: string
  value: string
  icon: LucideIcon
  color: string
}

export interface RecentActivityItem {
  id: string
  user: string
  action: string
  target: string
  time: string
  initials: string
  isAlert?: boolean
}

export interface ComplianceStat {
  label: string
  value: string
}

export interface AdminStatItem {
  count: string | number
  total?: string | number
  status?: string
  subtext: string
}

export interface AdminDashboardStats {
  activeLockouts: AdminStatItem
  anomaliesDetected: AdminStatItem
  nodeDiagnostics: AdminStatItem
}

