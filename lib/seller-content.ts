import { headers } from "next/headers"
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

async function getBucketFromHost() {
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

function toPublicUrl(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  bucket: string,
  path: string,
) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

export async function getSellerContent(): Promise<SellerContent> {
  const bucket = await getBucketFromHost()
  const fallback = getFallbackContent(bucket)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallback
  }

  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data: files, error } = await supabase.storage.from(bucket).list("", {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    })

    if (error) throw error

    const imageFiles = (files || []).filter((file) => file.name && imageExtensions.test(file.name))
    if (!imageFiles.length) return fallback

    const imageUrls = imageFiles.map((file) => toPublicUrl(supabase, bucket, file.name!))
    let content: ContentFile = {}
    const { data: contentFile } = await supabase.storage.from(bucket).download("content.json")
    if (contentFile) content = JSON.parse(await contentFile.text()) as ContentFile

    const products = imageFiles.map((file, index) => {
      const configuredProduct = content.products?.[index]
      return {
        id: `${bucket}-${file.name}`,
        name: configuredProduct?.name || nameFromFile(file.name!),
        description:
          configuredProduct?.description || `A signature design from ${titleFromBucket(bucket)}.`,
        image:
          configuredProduct?.image ||
          imageUrls[index],
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
