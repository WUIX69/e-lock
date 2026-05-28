import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq, or } from "drizzle-orm"

export async function getUserByEmail(email: string) {
  const users = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email))
    .limit(1)
  return users[0] || null
}

export async function getUserById(id: string) {
  const users = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, id))
    .limit(1)
  return users[0] || null
}

export async function getUserByIdentifier(identifier: string) {
  const users = await db
    .select()
    .from(UserTable)
    .where(or(eq(UserTable.employeeId, identifier), eq(UserTable.email, identifier)))
    .limit(1)
  return users[0] || null
}
