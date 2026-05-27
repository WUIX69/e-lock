"use client"

import * as React from "react"
import { getSessionAction } from "@/features/auth/server/actions/auth"

export interface SessionUser {
  id: string
  email: string
  name: string
  role: "admin" | "senior_engineer" | "user"
  position?: string
  securityLevel?: number
}

interface AuthContextValue {
  currentUser: SessionUser | null
  setCurrentUser: (user: SessionUser | null) => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
            position: session.position,
            securityLevel: session.securityLevel,
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
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
