const globalForChallenges = globalThis as unknown as {
  challenges: Map<string, { fingerprintId: number; verified: boolean; createdAt: number }>
}

if (!globalForChallenges.challenges) {
  globalForChallenges.challenges = new Map()
}

export const challenges = globalForChallenges.challenges

const CHALLENGE_TTL_MS = 120_000

export function createChallenge(token: string, fingerprintId: number) {
  challenges.set(token, { fingerprintId, verified: false, createdAt: Date.now() })
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
