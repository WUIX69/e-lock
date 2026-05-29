import { z } from "zod"

const ROLES = ["admin", "user"] as const
const STATUSES = ["active", "inactive", "off-site", "on-leave"] as const

const basePersonnelSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(ROLES, {
    message: "Please select a role",
  }),
  position: z.string().min(2, "Position must be at least 2 characters"),
  securityLevel: z.coerce
    .number({ message: "Security level must be a number" })
    .min(1, "Security level is required"),

  status: z.enum(STATUSES, {
    message: "Please select a status",
  }),
})

export const addPersonnelSchema = basePersonnelSchema.extend({
  employeeId: z
    .string()
    .min(1, "Employee ID is required"),
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  fingerprintId: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.coerce.number().int().min(1).max(162).optional().nullable()
  ),
}).superRefine((data, ctx) => {
  if (data.role === "admin") {
    if (!/^AD[0-9A-D*#]+$/i.test(data.employeeId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Admin Employee ID must start with AD and contain only digits, letters A-D, or symbols *, #",
        path: ["employeeId"],
      });
    }
  } else {
    if (!/^AC[0-9A-D*#]+$/i.test(data.employeeId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "User Employee ID must start with AC and contain only digits, letters A-D, or symbols *, #",
        path: ["employeeId"],
      });
    }
  }
})

export const editPersonnelSchema = basePersonnelSchema.extend({
  id: z.string().uuid("Invalid User ID"),
  employeeId: z
    .string()
    .min(1, "Employee ID is required"),
  pin: z
    .string()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits")
    .optional()
    .or(z.literal("")),
  fingerprintId: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.coerce.number().int().min(1).max(162).optional().nullable()
  ),
}).superRefine((data, ctx) => {
  if (data.role === "admin") {
    if (!/^AD[0-9A-D*#]+$/i.test(data.employeeId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Admin Employee ID must start with AD and contain only digits, letters A-D, or symbols *, #",
        path: ["employeeId"],
      });
    }
  } else {
    if (!/^AC[0-9A-D*#]+$/i.test(data.employeeId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "User Employee ID must start with AC and contain only digits, letters A-D, or symbols *, #",
        path: ["employeeId"],
      });
    }
  }
})

export type AddPersonnelSchema = z.infer<typeof addPersonnelSchema>
export type EditPersonnelSchema = z.infer<typeof editPersonnelSchema>
