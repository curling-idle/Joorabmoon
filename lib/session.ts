import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "node:crypto"

const cookieName = "jm_session"
const secret = process.env.SESSION_SECRET || "development-only-change-me"

export function createSessionToken(userId: string) {
  const signature = createHmac("sha256", secret).update(userId).digest("hex")
  return `${userId}.${signature}`
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null
  const [userId, signature] = token.split(".")
  if (!userId || !signature) return null
  const expected = createHmac("sha256", secret).update(userId).digest("hex")
  if (signature.length !== expected.length) return null
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? userId : null
}

export async function getSessionUserId() {
  return verifySessionToken((await cookies()).get(cookieName)?.value)
}

export { cookieName }
