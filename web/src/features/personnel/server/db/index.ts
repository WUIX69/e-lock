import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import * as bcrypt from "bcryptjs"
import {
  AddPersonnelSchema,
  EditPersonnelSchema,
} from "../../schemas/personnel"

export async function getUserByEmail(email: string) {
  const users = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email))
    .limit(1)
  return users[0] || null
}

export async function insertPersonnel(data: AddPersonnelSchema) {
  const passwordHash = await bcrypt.hash(data.pin, 10)

  const [newUser] = await db
    .insert(UserTable)
    .values({
      employeeId: data.employeeId,
      name: data.fullName,
      email: data.email,
      passwordHash,
      role: data.role,
      position: data.position,
      securityLevel: data.securityLevel,
      status: data.status,
    })
    .returning()

  return newUser
}

export async function getAllPersonnel() {
  return await db.select().from(UserTable).orderBy(UserTable.createdAt)
}

export async function updatePersonnel(
  id: string,
  data: Omit<EditPersonnelSchema, "id">
) {
  const updateData: {
    name: string
    email: string
    role: "admin" | "user"
    position: string
    securityLevel: string
    status: "active" | "inactive" | "off-site" | "on-leave"
    passwordHash?: string
  } = {
    name: data.fullName,
    email: data.email,
    role: data.role,
    position: data.position,
    securityLevel: data.securityLevel,
    status: data.status,
  }

  if (data.pin) {
    updateData.passwordHash = await bcrypt.hash(data.pin, 10)
  }

  const [updatedUser] = await db
    .update(UserTable)
    .set(updateData)
    .where(eq(UserTable.id, id))
    .returning()

  return updatedUser
}
