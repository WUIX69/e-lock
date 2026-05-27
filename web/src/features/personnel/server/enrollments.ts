const globalForEnrollments = globalThis as unknown as {
  enrollments: Map<number, { status: "pending" | "success" | "failed"; createdAt: number }>
}

if (!globalForEnrollments.enrollments) {
  globalForEnrollments.enrollments = new Map()
}

export const enrollments = globalForEnrollments.enrollments

const ENROLLMENT_TTL_MS = 120_000

export function setEnrollment(fingerprintId: number) {
  enrollments.set(fingerprintId, { status: "pending", createdAt: Date.now() })
}

export function getEnrollment(fingerprintId: number) {
  const entry = enrollments.get(fingerprintId)
  if (!entry) return null
  if (Date.now() - entry.createdAt > ENROLLMENT_TTL_MS) {
    enrollments.delete(fingerprintId)
    return null
  }
  return entry
}

export function completeEnrollment(fingerprintId: number, status: "success" | "failed") {
  const entry = enrollments.get(fingerprintId)
  if (entry) {
    entry.status = status
  }
}

export function deleteEnrollment(fingerprintId: number) {
  enrollments.delete(fingerprintId)
}

export function getNextAvailableId(usedIds: number[]): number {
  for (let id = 1; id <= 162; id++) {
    if (!usedIds.includes(id)) return id
  }
  return -1
}
