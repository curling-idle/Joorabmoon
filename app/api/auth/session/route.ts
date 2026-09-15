import { NextResponse } from "next/server"
import { db } from "@/lib/postgres"
import { getSessionUserId } from "@/lib/session"

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId || !db) return NextResponse.json({ user: null, profile: null })
  const rows = await db`select id, email, first_name, last_name, gender, birthdate, city, country, wallet_address, role, avatar_url, show_email, show_birthdate, created_at, updated_at from users where id = ${userId} limit 1`
  if (!rows[0]) return NextResponse.json({ user: null, profile: null })
  return NextResponse.json({ user: { id: rows[0].id, email: rows[0].email }, profile: rows[0] })
}
