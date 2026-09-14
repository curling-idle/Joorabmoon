import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductShowcase } from "@/components/product-showcase"
import { FeaturedCollection } from "@/components/featured-collection"
import { AboutSection } from "@/components/about-section"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { getSellerContent } from "@/lib/seller-content"

export default async function Home() {
  const seller = await getSellerContent()

  return (
    <main className="min-h-screen">
      <Header sellerName={seller.name} />
      <Hero seller={seller} />
      <ProductShowcase seller={seller} />
      <FeaturedCollection seller={seller} />
      <AboutSection seller={seller} />
      <Newsletter />
      <Footer />
    </main>
  )
}
