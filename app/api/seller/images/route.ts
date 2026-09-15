import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSessionUserId } from "@/lib/session"
import { db } from "@/lib/postgres"
import { getBucketFromHost, getRustfsClient, toSignedUrl } from "@/lib/seller-content"

const allowedTypes = new Set(["image/avif", "image/gif", "image/jpeg", "image/png", "image/webp"])
const maxFileSize = 10 * 1024 * 1024

export async function POST(request: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  if (db) {
    const users = await db`select role from users where id = ${userId} limit 1`
    if (users[0]?.role !== "seller") {
      return NextResponse.json({ error: "Only sellers can upload product images" }, { status: 403 })
    }
  }

  const file = (await request.formData()).get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file" }, { status: 400 })
  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Use a PNG, JPG, GIF, WEBP, or AVIF image" }, { status: 400 })
  }
  if (file.size > maxFileSize) {
    return NextResponse.json({ error: "Images must be 10 MB or smaller" }, { status: 400 })
  }

  const client = getRustfsClient()
  if (!client) return NextResponse.json({ error: "RustFS is not configured" }, { status: 503 })

  const bucket = await getBucketFromHost()
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const key = `products/${crypto.randomUUID()}.${extension}`

  try {
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      ContentLength: file.size,
    }))
    return NextResponse.json({ key, url: await toSignedUrl(client, bucket, key) })
  } catch (error) {
    console.error(`Unable to upload seller image to RustFS bucket "${bucket}".`, error)
    return NextResponse.json({ error: "Unable to upload image" }, { status: 502 })
  }
}
