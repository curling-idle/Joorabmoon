"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "@/components/logo"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, isMockMode } = useAuth()
  const router = useRouter()
  const [redirect, setRedirect] = useState("/")
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("redirect")
    if (value?.startsWith("/")) setRedirect(value)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error: err } = await signIn(email, password)
    if (err) {
      setError(err)
      setLoading(false)
    } else {
      router.push(redirect)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-sm mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to store
          </Link>
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-balance">Welcome Back</h1>
          <p className="font-mono text-sm text-muted-foreground mt-2">
            Sign in to your Jorab Moon account
          </p>
        </div>

        {isMockMode && (
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <p className="font-mono text-xs text-accent font-medium mb-2">Demo Mode Active</p>
            <p className="font-mono text-xs text-muted-foreground">
              Use these emails to sign in: amir@jorabmoon.com (seller), sara@sockart.com (seller), alex@gmail.com (buyer). Any password works.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="font-mono text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-mono text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-mono text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 font-mono text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-mono text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center font-mono text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/auth/sign-up" className="text-accent hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
