"use client"

import * as React from "react"
import { getSessionAction } from "@/features/auth/server/actions"

export interface SessionUser {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

interface SessionContextValue {
  currentUser: SessionUser | null
  setCurrentUser: (user: SessionUser | null) => void
  isLoading: boolean
}

const SessionContext = React.createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSessionAction()
        if (session) {
          setCurrentUser({
            id: session.sub,
            email: session.email,
            name: session.name,
            role: session.role,
          })
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [])

  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = React.useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
