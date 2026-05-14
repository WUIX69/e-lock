import { PersonnelMember, ActivePersonnel } from "@/types/personnel"

export const MOCK_PERSONNEL: PersonnelMember[] = [
  {
    id: "P-101",
    name: "Alex Thompson",
    role: "Senior Electrician",
    clearance: "Level 4 (LOTO)",
    status: "Active",
    lastAccess: "02m ago",
    node: "Node 04",
  },
  {
    id: "P-102",
    name: "Maria Rodriguez",
    role: "Safety Supervisor",
    clearance: "Level 5 (Admin)",
    status: "Active",
    lastAccess: "15m ago",
    node: "Control Room",
  },
  {
    id: "P-103",
    name: "Ken Chen",
    role: "Maintenance Engineer",
    clearance: "Level 3",
    status: "Off-Site",
    lastAccess: "2h ago",
    node: "N/A",
  },
  {
    id: "P-104",
    name: "Sarah Jenkins",
    role: "System Admin",
    clearance: "Level 5 (Admin)",
    status: "Active",
    lastAccess: "Now",
    node: "Node 01",
  },
  {
    id: "P-105",
    name: "Robert Miller",
    role: "Junior Technician",
    clearance: "Level 2",
    status: "Active",
    lastAccess: "45m ago",
    node: "Node 02",
  },
]

export const MOCK_ACTIVE_PERSONNEL: ActivePersonnel[] = [
  {
    name: "Alex Thompson",
    role: "Senior Electrician",
    time: "02:41:00",
    status: "Secured",
  },
  {
    name: "Sarah Jenkins",
    role: "Safety Inspector",
    time: "01:15:32",
    status: "Secured",
  },
  {
    name: "Michael Zhao",
    role: "Machine Op",
    time: "00:45:10",
    status: "Active",
  },
]
