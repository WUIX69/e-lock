import { AuditLog } from "@/types/audit"

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-001",
    person: { name: "Alex Thompson", role: "Sr. Electrician", initials: "AT" },
    machineId: "MC-402",
    isolation: "Electrical",
    verification: "Biometric",
    time: "2024-05-14 08:41:22",
    status: "Secured",
  },
  {
    id: "LOG-002",
    person: { name: "Sarah Jenkins", role: "Safety Lead", initials: "SJ" },
    machineId: "CONV-12",
    isolation: "Mechanical",
    verification: "PIN + Tag",
    time: "2024-05-14 09:12:05",
    status: "Active",
  },
  {
    id: "LOG-003",
    person: {
      name: "Unrecognized",
      role: "Unauthorized",
      initials: "??",
      error: true,
    },
    machineId: "PUMP-04",
    isolation: "Fluid",
    verification: "Failed Attempt",
    time: "2024-05-14 10:05:41",
    status: "Blocked",
  },
  {
    id: "LOG-004",
    person: { name: "Michael Zhao", role: "Maintenance", initials: "MZ" },
    machineId: "GEN-01",
    isolation: "Multiple",
    verification: "Biometric",
    time: "2024-05-14 10:45:18",
    status: "Secured",
  },
]
