import { CoWorker } from "@/types/tasks"

export const MOCK_TASK_TYPES = [
  { value: "Preventative Maintenance", label: "Preventative Maintenance" },
  { value: "Emergency Repair", label: "Emergency Repair" },
  { value: "General Record / Log", label: "General Record / Log" },
  { value: "Safety Inspection", label: "Safety Inspection" },
]

export const MOCK_COWORKERS: CoWorker[] = [
  { id: "9928", name: "John Stevens", role: "Senior Safety Inspector" },
  { id: "4512", name: "Lisa Park", role: "Maintenance Lead" },
  { id: "7731", name: "David Cruz", role: "Electrical Engineer" },
  { id: "2245", name: "Amara Okafor", role: "Safety Officer" },
]
