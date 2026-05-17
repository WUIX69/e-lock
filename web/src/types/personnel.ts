export interface PersonnelMember {
  id: string
  name: string
  role: string
  clearance: string
  status: "Active" | "Off-Site" | "Locked"
  lastAccess: string
  node: string
}

export interface ActivePersonnel {
  name: string
  role: string
  time: string
  status: string
}

import { LucideIcon } from "lucide-react"

export interface AccessProtocol {
  label: string
  icon: LucideIcon
  desc: string
  color?: string
}

export interface AddPersonnelFormData {
  fullName: string
  email: string
  role: "admin" | "user"
  pin: string
}

export interface AddPersonnelResult {
  success?: boolean
  error?: string
}
