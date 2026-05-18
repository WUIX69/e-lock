import {
  AssignedMachine,
  FailSafeHardwareRow,
  TelemetrySample,
  MaintenanceTicket,
} from "@/types/user-dashboard"
import { Bolt, Timer } from "lucide-react"

export const MOCK_ASSIGNED_MACHINE: AssignedMachine = {
  name: "Main Crusher",
  id: "#402",
  zone: "Zone B",
  sector: "Primary Processing Sector",
  runtime: "184h 12m",
  isolationStatus: "ENERGIZED",
  signalLatency: "98ms",
  relayHealth: "NOMINAL",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCKIWzr3-YUSFkkB4rN-ezfUw9h2F7sS2HfVeX2LjRli0S44XLmjE16eSVH37RmT-Xxd8H4_k73bGFNtfd9Lny0AK6DNC_hB0CD84_u1kgGc1d8DaoHSDcSq50OkVPXuNdjJyZzOgK3OjlLpJaMMUU-2TsJpLLtEXH1gGTWnY8KNWOZ1zHhBeFGGaPUBqCzhoGmieO5SNPhluCC-zKDTarqYug8QL-YjiMnoYdz4QxsiivVh_oIVI96h2r6I4LfpSuSaX5EgNHGiw",
}

export const MOCK_FAILSAFE_HARDWARE: FailSafeHardwareRow[] = [
  {
    label: "Shunt Trip Breaker",
    icon: Bolt,
    statusLabel: "READY",
    statusVariant: "ready",
  },
  {
    label: "Time Delay Relay",
    icon: Timer,
    statusLabel: "SYNCED",
    statusVariant: "synced",
  },
]

export const MOCK_TELEMETRY_SAMPLES: TelemetrySample[] = Array.from(
  { length: 24 },
  (_, i) => ({
    time: i,
    voltage: 220 + Math.random() * 10,
  })
)

export const MOCK_MAINTENANCE_TICKET: MaintenanceTicket = {
  ticketId: "#LOTO-99201-B",
  tasks: [
    {
      id: "1",
      label: "Clear machine debris",
      state: "done",
      timestamp: "08:00 AM",
    },
    {
      id: "2",
      label: "Verify zero voltage at TDR",
      state: "next",
    },
    {
      id: "3",
      label: "Apply physical E-LOCK toggle",
      state: "pending",
    },
    {
      id: "4",
      label: "Sign-off maintenance log",
      state: "pending",
    },
  ],
}

export const MOCK_USER_DASHBOARD_DATA = {
  assignedMachine: MOCK_ASSIGNED_MACHINE,
  lotoStatus: MOCK_FAILSAFE_HARDWARE,
  telemetry: MOCK_TELEMETRY_SAMPLES,
  checklist: MOCK_MAINTENANCE_TICKET,
}
