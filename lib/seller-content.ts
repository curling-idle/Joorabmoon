import { headers } from "next/headers"
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { mockProducts } from "./mock-data"

export type SellerProduct = {
  id: string
  name: string
  description: string
  image: string
  price: number
  colors: string[]
}

export type SellerContent = {
  bucket: string
  name: string
  tagline: string
  description: string
  heroImage: string
  galleryImages: string[]
  products: SellerProduct[]
}

type ContentFile = {
  name?: string
  description?: string
  tagline?: string
  heroImage?: string
  galleryImages?: string[]
  products?: Array<{
    name?: string
    description?: string
    image?: string
    price?: number
    colors?: string[]
  }>
}

const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i

function titleFromBucket(bucket: string) {
  return bucket
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function nameFromFile(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getFallbackContent(bucket: string): SellerContent {
  const products = mockProducts.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.images[0],
    price: product.price_usd,
    colors: product.colors,
  }))

  return {
    bucket,
    name: titleFromBucket(bucket),
    tagline: "Step into color",
    description:
      "Express yourself from the ground up with artistic, handcrafted socks designed for creative souls.",
    heroImage: products[0]?.image || "/placeholder.svg",
    galleryImages: products.slice(1, 5).map((product) => product.image),
    products,
  }
}

export async function getBucketFromHost() {
  const requestHeaders = await headers()
  const host = (requestHeaders.get("host") || "").split(":")[0].toLowerCase()
  const configuredBucket =
    process.env.SELLER_BUCKET || process.env.NEXT_PUBLIC_SELLER_BUCKET || "joorabmoon"

  if (!host || host === "localhost" || host === "127.0.0.1") return configuredBucket

  const rootDomain = (process.env.SELLER_ROOT_DOMAIN || "sockseller.com")
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .toLowerCase()
  if (!host.endsWith(`.${rootDomain}`)) return configuredBucket

  const subdomain = host.slice(0, -`.${rootDomain}`.length).split(".")[0]
  return subdomain || configuredBucket
}

export function getRustfsClient() {
  const endpoint = process.env.RUSTFS_ENDPOINT
  const accessKeyId = process.env.RUSTFS_ACCESS_KEY_ID
  const secretAccessKey = process.env.RUSTFS_SECRET_ACCESS_KEY

  if (!endpoint || !accessKeyId || !secretAccessKey) return null

  return new S3Client({
    endpoint,
    region: process.env.RUSTFS_REGION || "us-east-1",
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export async function toSignedUrl(client: S3Client, bucket: string, path: string) {
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: path }),
    { expiresIn: 60 * 60 },
  )
}

export async function getSellerContent(): Promise<SellerContent> {
  const bucket = await getBucketFromHost()
  const fallback = getFallbackContent(bucket)
  const rustfs = getRustfsClient()

  if (!rustfs) return fallback

  try {
    const { Contents = [] } = await rustfs.send(
      new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 100 }),
    )
    const imageFiles = Contents
      .filter((file) => file.Key && imageExtensions.test(file.Key))
      .sort((a, b) => (a.Key || "").localeCompare(b.Key || ""))
    if (!imageFiles.length) return fallback

    const imageUrls = await Promise.all(
      imageFiles.map((file) => toSignedUrl(rustfs, bucket, file.Key!)),
    )
    let content: ContentFile = {}
    try {
      const contentFile = await rustfs.send(
        new GetObjectCommand({ Bucket: bucket, Key: "content.json" }),
      )
      if (contentFile.Body) {
        content = JSON.parse(await contentFile.Body.transformToString()) as ContentFile
      }

    } catch (error) {
      if (!(error instanceof S3ServiceException) || error.name !== "NoSuchKey") throw error
    }

    const products = imageFiles.map((file, index) => {
      const configuredProduct = content.products?.[index]
      return {
        id: `${bucket}-${file.Key}`,
        name: configuredProduct?.name || nameFromFile(file.Key!),
        description:
          configuredProduct?.description || `A signature design from ${titleFromBucket(bucket)}.`,
        image: configuredProduct?.image || imageUrls[index],
        price: configuredProduct?.price ?? 24.99,
        colors: configuredProduct?.colors?.length ? configuredProduct.colors : ["Multi"],
      }
    })

    const heroImage =
      content.heroImage ||
      imageUrls[0] ||
      fallback.heroImage
    const galleryImages =
      content.galleryImages?.length
        ? content.galleryImages
        : imageUrls.slice(1, 5)

    return {
      bucket,
      name: content.name || titleFromBucket(bucket),
      tagline: content.tagline || fallback.tagline,
      description: content.description || fallback.description,
      heroImage,
      galleryImages,
      products,
    }
  } catch (error) {
    console.error(`Unable to load seller content from storage bucket "${bucket}".`, error)
    return fallback
  }
}
