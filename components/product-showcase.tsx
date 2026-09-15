"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useState } from "react"
import type { SellerContent } from "@/lib/seller-content"
import type { Product } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

export function ProductShowcase({ seller }: { seller: SellerContent }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const { addItem } = useCart()

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  function handleAddToCart(product: SellerContent["products"][number]) {
    const cartProduct: Product = {
      id: product.id,
      shop_id: seller.bucket,
      name: product.name,
      slug: product.id,
      description: product.description,
      price_ton: 0,
      price_usd: product.price,
      images: [product.image],
      category: "socks",
      sizes: ["M"],
      colors: product.colors,
      stock: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    }
    addItem(cartProduct, "M", product.colors[0] || "Multi")
    toast.success(`${product.name} added to cart`)
  }

  return (
    <section id="shop" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Featured Collection</h2>
          <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto text-pretty">
            {
              "Discover our curated selection of artistic socks, each pair designed to add personality to your everyday style."
            }
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {seller.products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? "fill-accent text-accent" : ""}`} />
                </Button>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{product.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-border"
                      style={{
                        backgroundColor: color.toLowerCase(),
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <Button className="group/btn" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
