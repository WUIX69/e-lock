import {
  pgTable,
  index,
  foreignKey,
  uuid,
  text,
  timestamp,
  unique,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const deviceStatus = pgEnum("device_status", [
  "active",
  "warning",
  "offline",
  "maintenance",
])
export const deviceType = pgEnum("device_type", [
  "field_controller",
  "shunt_trip",
  "gateway",
])
export const notificationCategory = pgEnum("notification_category", [
  "safety_alert",
  "task_update",
  "system_health",
])
export const notificationSeverity = pgEnum("notification_severity", [
  "critical",
  "warning",
  "info",
  "default",
])
export const userRole = pgEnum("user_role", [
  "admin",
  "senior_engineer",
  "user",
])
export const userStatus = pgEnum("user_status", [
  "active",
  "inactive",
  "off-site",
  "on-leave",
])

export const tasks = pgTable(
  "tasks",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    deviceId: uuid("device_id").notNull(),
    userId: uuid("user_id").notNull(),
    taskType: text("task_type").notNull(),
    subject: text().notNull(),
    priority: text().notNull(),
    description: text(),
    status: text().default("pending").notNull(),
    submittedAt: timestamp("submitted_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("tasks.device_id_index").using(
      "btree",
      table.deviceId.asc().nullsLast().op("uuid_ops")
    ),
    index("tasks.status_index").using(
      "btree",
      table.status.asc().nullsLast().op("text_ops")
    ),
    index("tasks.user_id_index").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.deviceId],
      foreignColumns: [devices.id],
      name: "tasks_device_id_devices_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "tasks_user_id_users_id_fk",
    }).onDelete("cascade"),
  ]
)

export const devices = pgTable(
  "devices",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    deviceId: text("device_id").notNull(),
    type: deviceType().notNull(),
    assignedMachine: text("assigned_machine").notNull(),
    macAddress: text("mac_address").notNull(),
    isHighPriority: boolean("is_high_priority").default(false).notNull(),
    signalStrength: integer("signal_strength").default(0),
    lastHeartbeatAt: timestamp("last_heartbeat_at", {
      withTimezone: true,
      mode: "string",
    }),
    status: deviceStatus().default("offline").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("devices.device_id_index").using(
      "btree",
      table.deviceId.asc().nullsLast().op("text_ops")
    ),
    index("devices.mac_address_index").using(
      "btree",
      table.macAddress.asc().nullsLast().op("text_ops")
    ),
    unique("devices_device_id_unique").on(table.deviceId),
    unique("devices_mac_address_unique").on(table.macAddress),
  ]
)

export const users = pgTable(
  "users",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    employeeId: text("employee_id").notNull(),
    name: text().notNull(),
    email: text().notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole().default("user").notNull(),
    position: text().notNull(),
    securityLevel: text("security_level").notNull(),
    status: userStatus().default("active").notNull(),
    lastLocation: text("last_location").default("N/A"),
    lastActiveAt: timestamp("last_active_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("users.email_index").using(
      "btree",
      table.email.asc().nullsLast().op("text_ops")
    ),
    index("users.employee_id_index").using(
      "btree",
      table.employeeId.asc().nullsLast().op("text_ops")
    ),
    unique("users_employee_id_unique").on(table.employeeId),
    unique("users_email_unique").on(table.email),
  ]
)

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    deviceId: uuid("device_id").notNull(),
    userId: uuid("user_id"),
    action: text().notNull(),
    triggeredAt: timestamp("triggered_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_logs.device_id_index").using(
      "btree",
      table.deviceId.asc().nullsLast().op("uuid_ops")
    ),
    index("audit_logs.triggered_at_index").using(
      "btree",
      table.triggeredAt.asc().nullsLast().op("timestamptz_ops")
    ),
    foreignKey({
      columns: [table.deviceId],
      foreignColumns: [devices.id],
      name: "audit_logs_device_id_devices_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "audit_logs_user_id_users_id_fk",
    }).onDelete("set null"),
  ]
)

export const taskCoworkers = pgTable(
  "task_coworkers",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    taskId: uuid("task_id").notNull(),
    userId: uuid("user_id"),
    name: text().notNull(),
  },
  (table) => [
    index("task_coworkers.task_id_index").using(
      "btree",
      table.taskId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: "task_coworkers_task_id_tasks_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "task_coworkers_user_id_users_id_fk",
    }).onDelete("set null"),
  ]
)

export const notifications = pgTable(
  "notifications",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    recipientId: uuid("recipient_id").notNull(),
    title: text().notNull(),
    description: text().notNull(),
    category: notificationCategory().notNull(),
    severity: notificationSeverity().default("default").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    actionLabel: text("action_label"),
    actorName: text("actor_name"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("notifications.is_read_index").using(
      "btree",
      table.isRead.asc().nullsLast().op("bool_ops")
    ),
    index("notifications.recipient_id_index").using(
      "btree",
      table.recipientId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.recipientId],
      foreignColumns: [users.id],
      name: "notifications_recipient_id_users_id_fk",
    }).onDelete("cascade"),
  ]
)

export const attachments = pgTable("attachments", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  referenceId: uuid("reference_id").notNull(),
  referenceModel: text("reference_model").notNull(),
  category: text().notNull(),
  uploadedById: uuid("uploaded_by_id").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
})
