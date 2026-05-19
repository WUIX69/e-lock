import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignJWT, jwtVerify } from "jose"
import { env } from "@/data/env/server"

const ACCESS_SECRET = new TextEncoder().encode(env.JWT_SECRET)
const REFRESH_SECRET = new TextEncoder().encode(env.JWT_REFRESH_SECRET)

export interface SessionUser {
  sub: string
  email: string
  name: string
  role: "admin" | "user"
}

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

export async function createAccessToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(ACCESS_SECRET)
}

export async function createRefreshToken(
  payload: SessionUser
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_REFRESH_EXPIRES_IN)
    .sign(REFRESH_SECRET)
}

export async function verifyAccessToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function refreshSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("elock_refresh_token")?.value

  if (!refreshToken) {
    return null
  }

  const payload = await verifyRefreshToken(refreshToken)
  if (!payload) {
    return null
  }

  const newAccessToken = await createAccessToken({
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })

  const accessAge = parseExpiresInToSeconds(env.JWT_EXPIRES_IN)
  try {
    cookieStore.set("elock_access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessAge,
      path: "/",
    })
  } catch {
  }

  return payload
}

export async function requireAuth(
  allowedRoles?: ("admin" | "user")[]
): Promise<SessionUser> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("elock_access_token")?.value
  let payload: SessionUser | null = null

  if (accessToken) {
    payload = await verifyAccessToken(accessToken)
  }

  if (!payload) {
    payload = await refreshSession()
  }

  if (!payload) {
    redirect("/login")
  }

  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    redirect("/unauthorized")
  }

  return payload
}
