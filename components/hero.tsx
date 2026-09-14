import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { SellerContent } from "@/lib/seller-content"

export function Hero({ seller }: { seller: SellerContent }) {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">{seller.name}</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">{seller.tagline}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-mono text-pretty max-w-xl">
              {seller.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base group">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                Learn Our Story
              </Button>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[600px]">
            <img
              src={seller.heroImage}
              alt={`${seller.name} sock collection`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
