"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store"
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 text-center">
        <ShoppingCart className="w-24 h-24 text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-sarabun">ตะกร้าสินค้าของคุณว่างเปล่า</h1>
        <p className="text-lg text-gray-600 mb-8 font-sarabun">
          ดูสินค้าของเราและเพิ่มสินค้าที่คุณสนใจลงในตะกร้า
        </p>
        <Button asChild size="lg">
          <Link href="/products">ดูสินค้าทั้งหมด</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 font-sarabun">ตะกร้าสินค้าของคุณ</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <div>
                      <Link href={`/products/${item.slug}`} className="text-lg font-semibold hover:underline font-sarabun">
                        {item.name}
                      </Link>
                      <p className="text-gray-600 text-sm font-sarabun">฿{item.base_price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600 font-sarabun">
                        ฿{(item.base_price * item.quantity).toLocaleString()}
                      </p>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between font-sarabun">
                  <span>ราคารวมสินค้า:</span>
                  <span>฿{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-sarabun">
                  <span>ค่าจัดส่ง:</span>
                  <span>฿0.00</span> {/* Placeholder for now */}
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold font-sarabun">
                  <span>ยอดรวมทั้งหมด:</span>
                  <span>฿{getTotalPrice().toLocaleString()}</span>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    ดำเนินการชำระเงิน <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
