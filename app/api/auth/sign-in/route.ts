import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { db } from "@/lib/postgres"
import { cookieName, createSessionToken } from "@/lib/session"

export async function POST(request: Request) {
  if (!db) return NextResponse.json({ error: "Database is not configured" }, { status: 503 })
  const { email, password } = await request.json()
  const rows = await db`select id, email, password_hash from users where lower(email) = lower(${email}) limit 1`
  if (!rows[0] || !(await compare(password, rows[0].password_hash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }
  const response = NextResponse.json({ user: { id: rows[0].id, email: rows[0].email } })
  response.cookies.set(cookieName, createSessionToken(rows[0].id), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 })
  return response
}
