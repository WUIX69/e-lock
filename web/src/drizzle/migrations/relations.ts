import { relations } from "drizzle-orm/relations"
import {
  devices,
  tasks,
  users,
  auditLogs,
  taskCoworkers,
  notifications,
} from "./schema"

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  device: one(devices, {
    fields: [tasks.deviceId],
    references: [devices.id],
  }),
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  taskCoworkers: many(taskCoworkers),
}))

export const devicesRelations = relations(devices, ({ many }) => ({
  tasks: many(tasks),
  auditLogs: many(auditLogs),
}))

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  auditLogs: many(auditLogs),
  taskCoworkers: many(taskCoworkers),
  notifications: many(notifications),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  device: one(devices, {
    fields: [auditLogs.deviceId],
    references: [devices.id],
  }),
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}))

export const taskCoworkersRelations = relations(taskCoworkers, ({ one }) => ({
  task: one(tasks, {
    fields: [taskCoworkers.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskCoworkers.userId],
    references: [users.id],
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.recipientId],
    references: [users.id],
  }),
}))
