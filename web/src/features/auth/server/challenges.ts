interface ChallengeEntry {
  fingerprintId: number | null
  verified: boolean
  createdAt: number
  userId?: string
  failedAttempts: number
}

const globalForChallenges = globalThis as unknown as {
  challenges: Map<string, ChallengeEntry>
}

if (!globalForChallenges.challenges) {
  globalForChallenges.challenges = new Map()
}

export const challenges = globalForChallenges.challenges

const CHALLENGE_TTL_MS = 120_000

export function createChallenge(token: string, fingerprintId: number | null) {
  challenges.set(token, { fingerprintId, verified: false, createdAt: Date.now(), failedAttempts: 0 })
}

export function getChallenge(token: string) {
  const entry = challenges.get(token)
  if (!entry) return null
  if (Date.now() - entry.createdAt > CHALLENGE_TTL_MS) {
    challenges.delete(token)
    return null
  }
  return entry
}

export function verifyChallenge(token: string) {
  const entry = challenges.get(token)
  if (!entry) return false
  entry.verified = true
  return true
}

export function deleteChallenge(token: string) {
  challenges.delete(token)
}

export function incrementFailedAttempt(token: string): number {
  const entry = challenges.get(token)
  if (!entry) return 0
  entry.failedAttempts++
  return entry.failedAttempts
}

export function resetFailedAttempts(token: string) {
  const entry = challenges.get(token)
  if (entry) {
    entry.failedAttempts = 0
  }
}

export function setChallengeUserId(token: string, userId: string) {
  const entry = challenges.get(token)
  if (entry) {
    entry.userId = userId
  }
}
