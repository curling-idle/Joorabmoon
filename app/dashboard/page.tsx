"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { mockShops, mockProducts, mockOrders } from "@/lib/mock-data"
import type { Shop, Product } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  Store, Package, DollarSign, MessageCircle, Plus, Edit3, Eye, EyeOff,
  Gem, TrendingUp, ShoppingCart, BarChart3, Phone
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "shop" | "products" | "orders">("overview")
  const [editingShop, setEditingShop] = useState(false)

  // Get seller's shop and data
  const shop = mockShops.find((s) => s.owner_id === user?.id) || mockShops[0]
  const products = mockProducts.filter((p) => p.shop_id === shop?.id)
  const orders = mockOrders.filter((o) => o.shop_id === shop?.id)

  // Shop form state
  const [shopName, setShopName] = useState(shop?.name || "")
  const [shopDesc, setShopDesc] = useState(shop?.description || "")
  const [shopCity, setShopCity] = useState(shop?.city || "")
  const [shopCountry, setShopCountry] = useState(shop?.country || "")
  const [shopContact, setShopContact] = useState(shop?.contact_number || "")
  const [showContact, setShowContact] = useState(shop?.show_contact ?? true)

  // Product form
  const [showProductForm, setShowProductForm] = useState(false)
  const [productName, setProductName] = useState("")
  const [productDesc, setProductDesc] = useState("")
  const [productPriceTon, setProductPriceTon] = useState("")
  const [productPriceUsd, setProductPriceUsd] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [productImage, setProductImage] = useState<File | null>(null)
  const [productImageUrl, setProductImageUrl] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [productError, setProductError] = useState("")
  const [localProducts, setLocalProducts] = useState<Product[]>(products)

  async function handleImageUpload(file: File | null) {
    setProductImage(file)
    setProductImageUrl("")
    setProductError("")
    if (!file) return
    setUploadingImage(true)
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/seller/images", { method: "POST", body: formData })
    const result = await response.json()
    setUploadingImage(false)
    if (!response.ok) {
      setProductError(result.error || "Unable to upload image")
      return
    }
    setProductImageUrl(result.url)
  }

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!productImageUrl) {
      setProductError("Upload a product image before adding the product")
      return
    }
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      shop_id: shop!.id,
      name: productName,
      slug: productName.toLowerCase().replace(/\s+/g, "-"),
      description: productDesc,
      price_ton: parseFloat(productPriceTon) || 0,
      price_usd: parseFloat(productPriceUsd) || 0,
      images: [productImageUrl],
      category: productCategory,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White"],
      stock: 50,
      is_active: true,
      created_at: new Date().toISOString(),
      shop: shop || undefined,
    }
    setLocalProducts((prev) => [newProduct, ...prev])
    setShowProductForm(false)
    setProductName("")
    setProductDesc("")
    setProductPriceTon("")
    setProductPriceUsd("")
    setProductCategory("")
    setProductImage(null)
    setProductImageUrl("")
    setProductError("")
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
          <p className="font-mono text-muted-foreground mb-6">Please sign in to access your dashboard.</p>
          <Link href="/auth/login?redirect=/dashboard"><Button>Sign In</Button></Link>
        </div>
        <Footer />
      </main>
    )
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_ton, 0)

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="font-mono text-sm text-muted-foreground mt-1">
              Welcome back, {profile?.first_name}
            </p>
          </div>
          <Link href={`/shops/${shop?.slug}`}>
            <Button variant="outline" className="font-mono text-sm">
              <Eye className="mr-2 h-4 w-4" /> View Public Shop
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {[
            { id: "overview" as const, label: "Overview", icon: BarChart3 },
            { id: "shop" as const, label: "Shop Profile", icon: Store },
            { id: "products" as const, label: "Products", icon: Package },
            { id: "orders" as const, label: "Orders", icon: ShoppingCart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Gem className="h-5 w-5 text-accent" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">Revenue</span>
                </div>
                <p className="text-2xl font-bold">{totalRevenue.toFixed(1)} TON</p>
              </div>
              <div className="rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-accent" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">Orders</span>
                </div>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-accent" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">Products</span>
                </div>
                <p className="text-2xl font-bold">{localProducts.length}</p>
              </div>
              <div className="rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">Avg. Price</span>
                </div>
                <p className="text-2xl font-bold">
                  {localProducts.length > 0
                    ? (localProducts.reduce((s, p) => s + p.price_ton, 0) / localProducts.length).toFixed(1)
                    : "0"
                  } TON
                </p>
              </div>
            </div>

            {/* Recent orders */}
            <div className="rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
              </div>
              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-mono text-sm text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-sm font-medium">Order #{order.id.slice(-6)}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} - {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{order.total_ton} TON</p>
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                          order.status === "shipped" ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shop Profile tab */}
        {activeTab === "shop" && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Shop Profile</h2>
              <Button variant="outline" size="sm" onClick={() => setEditingShop(!editingShop)}>
                <Edit3 className="mr-2 h-4 w-4" /> {editingShop ? "Cancel" : "Edit"}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-sm font-medium mb-2">Shop Name</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  disabled={!editingShop}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm disabled:opacity-60 outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-mono text-sm font-medium mb-2">Description</label>
                <textarea
                  value={shopDesc}
                  onChange={(e) => setShopDesc(e.target.value)}
                  disabled={!editingShop}
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm disabled:opacity-60 outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={shopCity}
                    onChange={(e) => setShopCity(e.target.value)}
                    disabled={!editingShop}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm disabled:opacity-60 outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block font-mono text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    value={shopCountry}
                    onChange={(e) => setShopCountry(e.target.value)}
                    disabled={!editingShop}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm disabled:opacity-60 outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-sm font-medium mb-2">
                  <Phone className="inline h-3.5 w-3.5 mr-1" />
                  Contact Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={shopContact}
                    onChange={(e) => setShopContact(e.target.value)}
                    disabled={!editingShop}
                    className="flex-1 rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm disabled:opacity-60 outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => editingShop && setShowContact(!showContact)}
                    disabled={!editingShop}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-mono text-xs transition-colors disabled:opacity-60 ${
                      showContact
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {showContact ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {showContact ? "Visible" : "Hidden"}
                  </button>
                </div>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  {showContact ? "Your contact number is visible to buyers" : "Your contact number is hidden from buyers"}
                </p>
              </div>

              {editingShop && (
                <Button onClick={() => setEditingShop(false)} className="mt-4">
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Products tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Products ({localProducts.length})</h2>
              <Button onClick={() => setShowProductForm(!showProductForm)}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>

            {showProductForm && (
              <form onSubmit={handleAddProduct} className="rounded-xl border border-border p-6 space-y-4 bg-secondary/50">
                <h3 className="font-semibold">New Product</h3>
                {productError && <p className="font-mono text-sm text-destructive">{productError}</p>}
                <div>
                  <label htmlFor="product-image" className="block font-mono text-sm font-medium mb-2">Product image</label>
                  <input
                    id="product-image"
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                    required
                    onChange={(e) => void handleImageUpload(e.target.files?.[0] || null)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm"
                  />
                  <p className="font-mono text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WEBP, or AVIF up to 10 MB. Stored in your RustFS seller bucket.</p>
                  {uploadingImage && <p className="font-mono text-xs text-accent mt-2">Uploading image...</p>}
                  {productImage && productImageUrl && (
                    <img src={productImageUrl} alt="Product preview" className="mt-3 h-32 w-32 rounded-lg object-cover border border-border" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-sm font-medium mb-2">Price (TON)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={productPriceTon}
                      onChange={(e) => setProductPriceTon(e.target.value)}
                      required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-sm font-medium mb-2">Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productPriceUsd}
                      onChange={(e) => setProductPriceUsd(e.target.value)}
                      required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Add Product</Button>
                  <Button type="button" variant="outline" onClick={() => setShowProductForm(false)}>Cancel</Button>
                </div>
              </form>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localProducts.map((product) => (
                <div key={product.id} className="rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-secondary overflow-hidden">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Gem className="h-3 w-3 text-accent" />
                        <span className="font-bold text-sm">{product.price_ton} TON</span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{product.stock} in stock</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-border">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-mono text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                        <p className="font-mono text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Gem className="h-4 w-4 text-accent" />
                          <span className="font-bold">{order.total_ton} TON</span>
                        </div>
                        <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                          order.payment_status === "completed"
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between font-mono text-sm">
                          <span>{item.product?.name || "Product"} x{item.quantity}</span>
                          <span className="text-muted-foreground">
                            {item.size} / {item.color}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.tx_hash && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="font-mono text-xs text-muted-foreground">
                          TX: <code className="text-foreground">{order.tx_hash}</code>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
