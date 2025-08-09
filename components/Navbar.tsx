'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ShoppingCart, User, LogOut, LayoutDashboard, History, Users, Package, BarChart3 } from 'lucide-react'
import { useAuthStore, useCartStore } from '@/lib/store'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { logout } = useAuthStore()
  const { user, isAdmin } = useCurrentUser()
  const isAuthenticated = !!user
  const totalCartItems = useCartStore((state) => state.getTotalItems())
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg font-sarabun">Conduit Body</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/products" className="font-medium hover:underline font-sarabun">
            สินค้า
          </Link>
          <Link href="/about" className="font-medium hover:underline font-sarabun">
            เกี่ยวกับเรา
          </Link>
          <Link href="/contact" className="font-medium hover:underline font-sarabun">
            ติดต่อ
          </Link>
          {isAdmin && (
            <Link href="/admin" className="font-medium hover:underline font-sarabun">
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {totalCartItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                    <AvatarFallback>
                      {user?.email ? user.email.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-sarabun">
                  {user?.email || 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center font-sarabun">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/analytics" className="flex items-center font-sarabun">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/orders" className="flex items-center font-sarabun">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/products" className="flex items-center font-sarabun">
                    <Package className="mr-2 h-4 w-4" />
                    Products
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users" className="flex items-center font-sarabun">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/order-history" className="flex items-center font-sarabun">
                    <History className="mr-2 h-4 w-4" />
                    ประวัติคำสั่งซื้อ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center font-sarabun">
                  <LogOut className="mr-2 h-4 w-4" />
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/login" className="font-sarabun">
                เข้าสู่ระบบ
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
