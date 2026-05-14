export interface AuditLogPerson {
  name: string
  role: string
  initials: string
  error?: boolean
}

export interface AuditLog {
  id: string
  person: AuditLogPerson
  machineId: string
  isolation: string
  verification: string
  time: string
  status: "Secured" | "Active" | "Blocked"
}
