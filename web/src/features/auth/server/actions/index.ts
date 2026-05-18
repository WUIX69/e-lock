"use server"

import { cookies } from "next/headers"
import * as bcrypt from "bcryptjs"
import { getUserByEmail } from "@/features/auth/server/db"
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  refreshSession,
  SessionUser,
} from "./auth"
import { env } from "@/data/env/server"

// HACK: Simple parser helper for maxAge calculation in cookies
function parseExpiresInToSeconds(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/)
  if (!match) return 3600
  const value = parseInt(match[1], 10)
  const unit = match[2]
  switch (unit) {
    case "s":
      return value
    case "m":
      return value * 60
    case "h":
      return value * 60 * 60
    case "d":
      return value * 24 * 60 * 60
    default:
      return 3600
  }
}

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

    const payload: SessionUser = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const accessToken = await createAccessToken(payload)
    const refreshToken = await createRefreshToken(payload)

    const cookieStore = await cookies()
    const accessAge = parseExpiresInToSeconds(env.JWT_EXPIRES_IN)
    const refreshAge = parseExpiresInToSeconds(env.JWT_REFRESH_EXPIRES_IN)

    cookieStore.set("elock_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessAge,
      path: "/",
    })

    cookieStore.set("elock_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshAge,
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
  cookieStore.delete("elock_access_token")
  cookieStore.delete("elock_refresh_token")
  return { success: true }
}

export async function getSessionAction(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("elock_access_token")?.value

  if (!token) {
    // Try to silently refresh the session
    return refreshSession()
  }

  try {
    const payload = await verifyAccessToken(token)
    if (!payload) {
      // Access token expired or invalid, try refresh
      return refreshSession()
    }
    return payload
  } catch {
    return refreshSession()
  }
}
