"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Profile } from "./mock-data"

type AuthUser = {
  id: string
  email: string
}

type AuthContextType = {
  user: AuthUser | null
  profile: Profile | null
  isLoading: boolean
  isMockMode: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (data: SignUpData) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<{ error?: string }>
  setMockUser: (userId: string | null) => void
}

type SignUpData = {
  email: string
  password: string
  first_name: string
  last_name: string
  role: "buyer" | "seller"
  gender?: string
  city?: string
  country?: string
  wallet_address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMockMode] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const response = await fetch("/api/auth/session")
    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
      setProfile(data.profile)
    }
    setIsLoading(false)
  }

  async function signIn(email: string, _password: string) {
    const response = await fetch("/api/auth/sign-in", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password: _password }) })
    const data = await response.json()
    if (!response.ok) return { error: data.error || "Authentication service unavailable" }
    await checkAuth()
    return {}
  }

  async function signUp(data: SignUpData) {
    const response = await fetch("/api/auth/sign-up", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) })
    const result = await response.json()
    if (!response.ok) return { error: result.error || "Authentication service unavailable" }
    await checkAuth()
    return {}
  }

  async function signOut() {
    await fetch("/api/auth/sign-out", { method: "POST" })
    setUser(null)
    setProfile(null)
  }

  async function updateProfile(data: Partial<Profile>) {
    if (!user) return { error: "Not authenticated" }
    return { error: "Profile editing is not available yet" }
  }

  function setMockUser(userId: string | null) {
    if (userId === null) void signOut()
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, isLoading, isMockMode, signIn, signUp, signOut, updateProfile, setMockUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
