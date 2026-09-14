import type { SellerContent } from "@/lib/seller-content"

export function FeaturedCollection({ seller }: { seller: SellerContent }) {
  return (
    <section id="collections" className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">{seller.name} collection</h2>
            <p className="text-lg text-muted-foreground font-mono text-pretty">
              {seller.description}
            </p>
            <ul className="space-y-3 font-mono">
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span>Premium combed cotton blend for ultimate comfort</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span>Reinforced heel and toe for durability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span>Unique designs you won&apos;t find anywhere else</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span>Sustainable production practices</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={seller.galleryImages[0] || seller.heroImage}
                  alt={`${seller.name} sock detail 1`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={seller.galleryImages[1] || seller.heroImage}
                  alt={`${seller.name} sock detail 2`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={seller.galleryImages[2] || seller.heroImage}
                  alt={`${seller.name} sock detail 3`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={seller.galleryImages[3] || seller.heroImage}
                  alt={`${seller.name} sock detail 4`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
