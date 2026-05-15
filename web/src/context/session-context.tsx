"use client"

import * as React from "react"
import { MOCK_ACCOUNTS, MockAccount } from "@/data/mock/accounts"

interface SessionContextValue {
  currentUser: MockAccount | null
  setCurrentUser: (user: MockAccount) => void
  isLoading: boolean
}

const SessionContext = React.createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<MockAccount | null>(MOCK_ACCOUNTS[0])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate initial session check
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
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
