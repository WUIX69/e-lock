import { z } from "zod"

export const submitTaskSchema = z.object({
  deviceId: z.string().uuid("Invalid device"),
  taskType: z.string().min(1, "Task type is required"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  priority: z.enum(["Routine", "High", "Critical"]),
  description: z.string().optional(),
  coWorkerId: z.string().uuid().optional(),
  coWorkerName: z.string().optional(),
})

export const updateTaskSchema = submitTaskSchema.extend({
  id: z.string().uuid(),
  status: z.enum(["pending", "completed", "cancelled"]).optional(),
})
