"use server"

import { cookies } from "next/headers"
import * as bcrypt from "bcryptjs"
import { getUserById, getUserByIdentifier } from "@/features/auth/server/db/auth"
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  refreshSession,
  SessionUser,
} from "@/features/auth/server/actions/jwt"
import { env } from "@/data/env/server"
import "@/lib/mqtt-server"

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
  const identifier = formData.get("identifier")?.toString()
  const pin = formData.get("password")?.toString()

  if (!identifier || !pin) {
    return { error: "Email / Employee ID and PIN are required" }
  }

  try {
    const user = await getUserByIdentifier(identifier)
    if (!user) {
      return { error: "Invalid credentials" }
    }

    const isMatch = await bcrypt.compare(pin, user.passwordHash)
    if (!isMatch) {
      return { error: "Invalid credentials" }
    }

    const payload: SessionUser = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      position: user.position,
      securityLevel: user.securityLevel,
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
    return refreshSession()
  }

  try {
    const payload = await verifyAccessToken(token)
    if (!payload) {
      return refreshSession()
    }

    const user = await getUserById(payload.sub)
    if (user) {
      payload.position = user.position
      payload.securityLevel = user.securityLevel
    }

    return payload
  } catch {
    return refreshSession()
  }
}

import { challenges, createChallenge, getChallenge, deleteChallenge } from "@/features/auth/server/challenges"
import { getAllPersonnel } from "@/features/personnel/server/db/personnel"

export async function requestBiometricChallengeAction(identifier: string) {
  try {
    const user = await getUserByIdentifier(identifier)
    if (!user) {
      return { error: "User not found" }
    }

    if (!user.fingerprintId) {
      return { error: "No fingerprint registered for this user" }
    }

    const challengeToken = crypto.randomUUID()
    createChallenge(challengeToken, user.fingerprintId)

    return { success: true, fingerprintId: user.fingerprintId, challengeToken }
  } catch {
    return { error: "Failed to initiate biometric challenge" }
  }
}

export async function startBiometricChallengeAction() {
  try {
    for (const [token, challenge] of challenges.entries()) {
      if (!challenge.verified && challenge.fingerprintId === null) {
        deleteChallenge(token)
      }
    }

    const challengeToken = crypto.randomUUID()
    createChallenge(challengeToken, null)

    return { success: true, challengeToken }
  } catch {
    return { error: "Failed to start biometric scan" }
  }
}

export async function checkBiometricStatusAction(challengeToken: string) {
  try {
    const challenge = getChallenge(challengeToken)
    if (!challenge) {
      return { status: "expired" as const, failedAttempts: 0 }
    }

    if (challenge.failedAttempts >= 3) {
      deleteChallenge(challengeToken)
      return { status: "locked" as const, failedAttempts: 3 }
    }

    if (!challenge.verified) {
      return { status: "pending" as const, failedAttempts: challenge.failedAttempts }
    }

    deleteChallenge(challengeToken)

    const allPersonnel = await getAllPersonnel()
    const matchedUser = challenge.fingerprintId !== null
      ? allPersonnel.find((u) => u.fingerprintId === challenge.fingerprintId)
      : challenge.userId
        ? allPersonnel.find((u) => u.id === challenge.userId)
        : null

    if (!matchedUser) {
      return { status: "expired" as const, failedAttempts: 0 }
    }

    const payload: SessionUser = {
      sub: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
      position: matchedUser.position,
      securityLevel: matchedUser.securityLevel,
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

    return { status: "verified" as const, role: matchedUser.role, failedAttempts: 0 }
  } catch {
    return { status: "expired" as const, failedAttempts: 0 }
  }
}

export async function cancelBiometricChallengeAction(challengeToken: string) {
  try {
    deleteChallenge(challengeToken)
    return { success: true }
  } catch {
    return { error: "Failed to cancel challenge" }
  }
}