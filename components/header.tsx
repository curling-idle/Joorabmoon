"use client"

import { ShoppingCart, Menu, X, User, LogOut, Store, MessageCircle, LayoutDashboard, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

export function Header({ sellerName = "Jorab Moon" }: { sellerName?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, signOut, isMockMode, setMockUser } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo sellerName={sellerName} />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="font-mono text-sm font-medium text-foreground hover:text-accent transition-colors">
              Shop
            </Link>
            <Link href="/shops" className="font-mono text-sm font-medium text-foreground hover:text-accent transition-colors">
              Sellers
            </Link>
            <Link href="/#collections" className="font-mono text-sm font-medium text-foreground hover:text-accent transition-colors">
              Collections
            </Link>
            <Link href="/#about" className="font-mono text-sm font-medium text-foreground hover:text-accent transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Mock mode quick-switch */}
            {isMockMode && !user && (
              <div className="hidden lg:flex items-center gap-2">
                <select
                  className="font-mono text-xs border border-border rounded-md px-2 py-1 bg-secondary text-secondary-foreground"
                  onChange={(e) => setMockUser(e.target.value || null)}
                  defaultValue=""
                >
                  <option value="">Demo Login</option>
                  <option value="buyer-1">Buyer: Alex</option>
                  <option value="seller-1">Seller: Amir</option>
                  <option value="seller-2">Seller: Sara</option>
                </select>
              </div>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-mono">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="relative"
                >
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-mono font-bold text-accent">
                      {profile?.first_name?.[0] || "U"}
                    </span>
                  </div>
                </Button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-card shadow-xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-border">
                        <p className="font-semibold text-sm">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
                        <span className="inline-block mt-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wider">
                          {profile?.role || "buyer"}
                        </span>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-mono rounded-md hover:bg-secondary transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" /> My Account
                        </Link>
                        {profile?.wallet_address && (
                          <div className="flex items-center gap-3 px-3 py-2 text-sm font-mono text-muted-foreground">
                            <Wallet className="h-4 w-4" />
                            <span className="truncate">{profile.wallet_address}</span>
                          </div>
                        )}
                        {profile?.role === "seller" && (
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-mono rounded-md hover:bg-secondary transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" /> Seller Dashboard
                          </Link>
                        )}
                        <Link
                          href="/chat"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-mono rounded-md hover:bg-secondary transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <MessageCircle className="h-4 w-4" /> Messages
                        </Link>
                        <Link
                          href="/shops"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-mono rounded-md hover:bg-secondary transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Store className="h-4 w-4" /> Browse Shops
                        </Link>
                      </div>
                      <div className="p-2 border-t border-border">
                        <button
                          className="flex items-center gap-3 px-3 py-2 text-sm font-mono rounded-md hover:bg-secondary transition-colors w-full text-left text-destructive"
                          onClick={() => {
                            signOut()
                            setUserMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="font-mono text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="font-mono text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link href="/shop" className="font-mono text-sm font-medium text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link href="/shops" className="font-mono text-sm font-medium text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Sellers
              </Link>
              <Link href="/#collections" className="font-mono text-sm font-medium text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Collections
              </Link>
              <Link href="/#about" className="font-mono text-sm font-medium text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              {!user && (
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-mono text-sm">Sign In</Button>
                  </Link>
                  <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full font-mono text-sm">Sign Up</Button>
                  </Link>
                  {isMockMode && (
                    <select
                      className="font-mono text-xs border border-border rounded-md px-2 py-2 bg-secondary text-secondary-foreground mt-2"
                      onChange={(e) => { setMockUser(e.target.value || null); setMobileMenuOpen(false) }}
                      defaultValue=""
                    >
                      <option value="">Demo Login</option>
                      <option value="buyer-1">Buyer: Alex</option>
                      <option value="seller-1">Seller: Amir</option>
                      <option value="seller-2">Seller: Sara</option>
                    </select>
                  )}
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
