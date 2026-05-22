import { NodeDevice } from "@/types/nodes"

export const MOCK_NODES: NodeDevice[] = [
  {
    id: "node-001",
    name: "Milling Station Alpha",
    deviceId: "#ELK-9902-MS",
    sector: "Sector 7-G",
    status: "operational",
    lastTechnician: "Jared Vance",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=JaredVance",
    uptime: "99.98%",
  },
  {
    id: "node-002",
    name: "Hydraulic Press 02",
    deviceId: "#ELK-1145-HP",
    sector: "Sector 4-B",
    status: "offline",
    lastTechnician: "Sarah Chen",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen",
    alert: "PRESSURE DROP",
  },
  {
    id: "node-003",
    name: "Conveyor Main",
    deviceId: "#ELK-4421-CH",
    sector: "Logistics Hub",
    status: "operational",
    lastTechnician: "Mark Wilson",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=MarkWilson",
    loadStatus: "NORMAL (42%)",
  },
  {
    id: "node-004",
    name: "HV Transformer-A",
    deviceId: "#ELK-8812-HV",
    sector: "Power Core",
    status: "operational",
    lastTechnician: "Alex Wong",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexWong",
    loadStatus: "42\u00b0C (STABLE)",
  },
  {
    id: "node-005",
    name: "Sprayer Unit 04",
    deviceId: "#ELK-3029-SU",
    sector: "Paint Shop",
    status: "maintenance",
    lastTechnician: "Elena Rodriguez",
    lastTechnicianAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRodriguez",
    loadStatus: "NOW",
  },
]
