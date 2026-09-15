import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/postgres"
import { cookieName, createSessionToken } from "@/lib/session"

export async function POST(request: Request) {
  if (!db) return NextResponse.json({ error: "Database is not configured" }, { status: 503 })
  const data = await request.json()
  if (!data.email || !data.password || !data.first_name || !data.last_name) {
    return NextResponse.json({ error: "Required account details are missing" }, { status: 400 })
  }
  try {
    const passwordHash = await hash(data.password, 12)
    const [user] = await db`
      insert into users (email, password_hash, first_name, last_name, role, gender, city, country, wallet_address)
      values (${data.email.toLowerCase()}, ${passwordHash}, ${data.first_name}, ${data.last_name},
        ${data.role || "buyer"}, ${data.gender || ""}, ${data.city || ""}, ${data.country || ""}, ${data.wallet_address || ""})
      returning id, email
    `
    const response = NextResponse.json({ user })
    response.cookies.set(cookieName, createSessionToken(user.id), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 })
    return response
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return NextResponse.json({ error: "Email is already registered" }, { status: 409 })
    console.error("Account creation failed", error)
    return NextResponse.json({ error: "Unable to create account" }, { status: 500 })
  }
}
