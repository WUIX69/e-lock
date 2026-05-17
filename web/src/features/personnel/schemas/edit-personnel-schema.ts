import { z } from "zod"

const roles = ["admin", "user"] as const
const statuses = ["active", "inactive", "off-site", "on-leave"] as const

export const editPersonnelSchema = z.object({
  id: z.string().uuid("Invalid User ID"),
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
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits").optional().or(z.literal("")),
})

export type EditPersonnelSchema = z.infer<typeof editPersonnelSchema>
