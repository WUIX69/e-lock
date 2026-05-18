import {
  RecentActivityItem,
  ComplianceStat,
  AdminDashboardStats,
} from "@/types/dashboard"

export const MOCK_VOLTAGE_BARS: number[] = [
  40, 60, 45, 80, 55, 90, 70, 85, 40, 65, 50, 75, 45,
]

export const MOCK_RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: "1",
    user: "John Doe",
    action: "Access Granted",
    target: "Main Server Room",
    time: "2 minutes ago",
    initials: "JD",
  },
  {
    id: "2",
    user: "Jane Smith",
    action: "Access Denied",
    target: "Executive Office",
    time: "15 minutes ago",
    initials: "JS",
    isAlert: true,
  },
  {
    id: "3",
    user: "Mike Johnson",
    action: "Lock Restarted",
    target: "Warehouse Entry B",
    time: "1 hour ago",
    initials: "MJ",
  },
  {
    id: "4",
    user: "System",
    action: "Firmware Updated",
    target: "All 1st Floor Locks",
    time: "3 hours ago",
    initials: "SY",
  },
  {
    id: "5",
    user: "Sarah Williams",
    action: "Access Granted",
    target: "Server Room B",
    time: "5 hours ago",
    initials: "SW",
  },
]

export const MOCK_COMPLIANCE_STATS: ComplianceStat[] = [
  { label: "Audit Score", value: "98/100" },
  { label: "Compliance", value: "100%" },
  { label: "Active Nodes", value: "12/12" },
  { label: "Last Sync", value: "Now" },
]

export const MOCK_ADMIN_STATS: AdminDashboardStats = {
  activeLockouts: {
    count: 14,
    total: 24,
    status: "Nodes",
    subtext: "+2 since shift change",
  },
  anomaliesDetected: {
    count: 0,
    status: "Failures",
    subtext: "Failsafe Loop: Healthy",
  },
  nodeDiagnostics: {
    count: "98%",
    status: "Nominal",
    subtext: "11/12 nodes online",
  },
}

export const MOCK_SYSTEM_DIAGNOSTICS = {
  mesh: {
    signal: 94,
    nodes: 12,
    latency: "12ms",
  },
  environment: {
    temp: "32.4°C",
    status: "Within Specs",
  },
  latestAlert: {
    message:
      "RFID tag verification requested at Node 04. Access granted to Alex T.",
    time: "12m ago",
  },
  integrity: {
    status: "100% hardware fidelity",
  },
}
