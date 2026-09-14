import type { SellerContent } from "@/lib/seller-content"

export function AboutSection({ seller }: { seller: SellerContent }) {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">{seller.name}: socks as art</h2>
          <p className="text-xl text-muted-foreground font-mono text-pretty leading-relaxed">
            {seller.description}
          </p>
          <p className="text-lg text-muted-foreground font-mono text-pretty leading-relaxed">
            Every image in this storefront is loaded from the seller&apos;s storage bucket, so each seller can publish a different collection without changing the app.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 pt-12">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">10k+</div>
              <div className="font-mono text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">50+</div>
              <div className="font-mono text-sm text-muted-foreground">Unique Designs</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">100%</div>
              <div className="font-mono text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
