import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function getUserByEmail(email: string) {
  const users = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email))
    .limit(1)
  return users[0] || null
}
