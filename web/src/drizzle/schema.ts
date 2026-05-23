import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

// ─── Shared column helpers ────────────────────────────────────────────────────

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow()

const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

// ─── Enums ───────────────────────────────────────────────────────────────────

export const DeviceTypeEnum = pgEnum("device_type", [
  "field_controller",
  "shunt_trip",
  "gateway",
])

export const DeviceStatusEnum = pgEnum("device_status", [
  "active",
  "warning",
  "offline",
  "maintenance",
])

export const UserRoleEnum = pgEnum("user_role", [
  "admin",
  "senior_engineer",
  "user",
])
export const UserStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "off-site",
  "on-leave",
])

// ─── Tables ──────────────────────────────────────────────────────────────────

export const UserTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: text("employee_id").notNull().unique(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: UserRoleEnum("role").notNull().default("user"),
    position: text("position").notNull(),
    securityLevel: text("security_level").notNull(),
    status: UserStatusEnum("status").notNull().default("active"),
    lastLocation: text("last_location").default("N/A"),
    lastActiveAt: timestamp("last_active_at", {
      withTimezone: true,
    }).defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("users.email_index").on(table.email),
    index("users.employee_id_index").on(table.employeeId),
  ]
)

export const TaskTable = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: uuid("device_id")
      .notNull()
      .references(() => DeviceTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    taskType: text("task_type").notNull(),
    subject: text("subject").notNull(),
    priority: text("priority").notNull(),
    description: text("description"),
    status: text("status").notNull().default("pending"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("tasks.device_id_index").on(table.deviceId),
    index("tasks.user_id_index").on(table.userId),
    index("tasks.status_index").on(table.status),
  ]
)

export const TaskCoWorkerTable = pgTable(
  "task_coworkers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id")
      .notNull()
      .references(() => TaskTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => UserTable.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
  },
  (table) => [index("task_coworkers.task_id_index").on(table.taskId)]
)

export const DeviceTable = pgTable(
  "devices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: text("device_id").notNull().unique(),
    type: DeviceTypeEnum("type").notNull(),
    assignedMachine: text("assigned_machine").notNull(),
    macAddress: text("mac_address").notNull().unique(),
    isHighPriority: boolean("is_high_priority").notNull().default(false),
    signalStrength: integer("signal_strength").default(0),
    lastHeartbeatAt: timestamp("last_heartbeat_at", { withTimezone: true }),
    status: DeviceStatusEnum("status").notNull().default("offline"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("devices.device_id_index").on(table.deviceId),
    index("devices.mac_address_index").on(table.macAddress),
  ]
)

export const AuditLogTable = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: uuid("device_id")
      .notNull()
      .references(() => DeviceTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => UserTable.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    triggeredAt: timestamp("triggered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs.device_id_index").on(table.deviceId),
    index("audit_logs.triggered_at_index").on(table.triggeredAt),
  ]
)

// ─── Relations ────────────────────────────────────────────────────────────────

export const deviceRelations = relations(DeviceTable, ({ many }) => ({
  auditLogs: many(AuditLogTable),
  tasks: many(TaskTable),
}))

export const userRelations = relations(UserTable, ({ many }) => ({
  auditLogs: many(AuditLogTable),
  tasks: many(TaskTable),
  taskCoWorkers: many(TaskCoWorkerTable),
}))

export const auditLogRelations = relations(AuditLogTable, ({ one }) => ({
  device: one(DeviceTable, {
    fields: [AuditLogTable.deviceId],
    references: [DeviceTable.id],
  }),
  user: one(UserTable, {
    fields: [AuditLogTable.userId],
    references: [UserTable.id],
  }),
}))

export const taskRelations = relations(TaskTable, ({ one, many }) => ({
  device: one(DeviceTable, {
    fields: [TaskTable.deviceId],
    references: [DeviceTable.id],
  }),
  user: one(UserTable, {
    fields: [TaskTable.userId],
    references: [UserTable.id],
  }),
  coWorkers: many(TaskCoWorkerTable),
}))

export const taskCoWorkerRelations = relations(
  TaskCoWorkerTable,
  ({ one }) => ({
    task: one(TaskTable, {
      fields: [TaskCoWorkerTable.taskId],
      references: [TaskTable.id],
    }),
    user: one(UserTable, {
      fields: [TaskCoWorkerTable.userId],
      references: [UserTable.id],
    }),
  })
)
