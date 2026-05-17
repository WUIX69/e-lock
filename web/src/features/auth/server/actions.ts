"use server"

import { cookies } from "next/headers"
import { SignJWT } from "jose"
import * as bcrypt from "bcryptjs"
import { getUserByEmail } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development"
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET)

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const user = await getUserByEmail(email)
    if (!user) {
      return { error: "Invalid credentials" }
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return { error: "Invalid credentials" }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET_KEY)

    const cookieStore = await cookies()
    cookieStore.set("elock_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return { success: true, role: user.role }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("elock_session")
  return { success: true }
}

import { jwtVerify } from "jose"

export async function getSessionAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get("elock_session")?.value
  if (!token) return null

  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    return verified.payload as {
      sub: string
      email: string
      name: string
      role: "admin" | "user"
    }
  } catch (err) {
    return null
  }
}
