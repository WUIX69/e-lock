import { z } from "zod"

const roles = ["admin", "user"] as const
const statuses = ["active", "inactive", "off-site", "on-leave"] as const

export const addPersonnelSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(roles, {
    message: "Please select a role",
  }),
  position: z.string().min(2, "Position must be at least 2 characters"),
  securityLevel: z.string().min(1, "Security level is required"),
  status: z.enum(statuses, {
    message: "Please select a status",
  }),
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
})

export type AddPersonnelSchema = z.infer<typeof addPersonnelSchema>
