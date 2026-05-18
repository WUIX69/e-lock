import { relations } from "drizzle-orm"
import {
  boolean,
  index,
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

export const LockStatusEnum = pgEnum("lock_status", [
  "locked",
  "unlocked",
  "unknown",
])
export const UserRoleEnum = pgEnum("user_role", ["admin", "user"])
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

export const LockTable = pgTable("locks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location"),
  macAddress: text("mac_address").notNull().unique(),
  status: LockStatusEnum("status").notNull().default("unknown"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt,
  updatedAt,
})

export const AuditLogTable = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lockId: uuid("lock_id")
      .notNull()
      .references(() => LockTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => UserTable.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    triggeredAt: timestamp("triggered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs.lock_id_index").on(table.lockId),
    index("audit_logs.triggered_at_index").on(table.triggeredAt),
  ]
)

// ─── Relations ────────────────────────────────────────────────────────────────

export const lockRelations = relations(LockTable, ({ many }) => ({
  auditLogs: many(AuditLogTable),
}))

export const userRelations = relations(UserTable, ({ many }) => ({
  auditLogs: many(AuditLogTable),
}))

export const auditLogRelations = relations(AuditLogTable, ({ one }) => ({
  lock: one(LockTable, {
    fields: [AuditLogTable.lockId],
    references: [LockTable.id],
  }),
  user: one(UserTable, {
    fields: [AuditLogTable.userId],
    references: [UserTable.id],
  }),
}))
