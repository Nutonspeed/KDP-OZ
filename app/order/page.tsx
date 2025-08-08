"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { mockDb } from "@/lib/mockDb"

interface CartItem {
  productId: string
  productName: string
  size: string
  quantity: number
  price: number
}

export default function OrderPage() {
  const searchParams = useSearchParams()
  const productSlug = searchParams.get("product")

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })

  useEffect(() => {
    if (productSlug) {
      const product = mockDb.products.find((p) => p.slug === productSlug)
      if (product && product.sizes.length > 0) {
        addToCart(product.id, product.name, product.sizes[0], product.base_price)
      }
    }
  }, [productSlug])

  const addToCart = (productId: string, productName: string, size: string, price: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId && item.size === size)
      if (existingItem) {
        return prev.map((item) =>
          item.productId === productId && item.size === size ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { productId, productName, size, quantity: 1, price }]
    })
  }

  const updateQuantity = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size)
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size ? { ...item, quantity: newQuantity } : item,
      ),
    )
  }

  const removeFromCart = (productId: string, size: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      alert("กรุณาเพิ่มสินค้าในตะกร้า")
      return
    }

    // Create order summary
    const orderData = {
      customer: customerInfo,
      items: cartItems,
      total: getTotalPrice(),
      orderDate: new Date().toISOString(),
    }

    console.log("Order submitted:", orderData)

    // Simulate order processing
    alert("ขอบคุณสำหรับคำสั่งซื้อ เราจะติดต่อกลับเพื่อยืนยันรายละเอียดโดยเร็วที่สุด")

    // Reset form
    setCartItems([])
    setCustomerInfo({
      name: "",
      company: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    })
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">สั่งซื้อสินค้า</h1>
          <p className="text-lg text-gray-600 font-sarabun">กรอกข้อมูลและเลือกสินค้าที่ต้องการ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sarabun">เลือกสินค้า</CardTitle>
              <CardDescription className="font-sarabun">เลือกสินค้าและขนาดที่ต้องการ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDb.products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold font-sarabun">{product.name}</h3>
                        <p className="text-sm text-gray-600 font-sarabun">{product.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{product.type}</Badge>
                          <Badge variant="outline">{product.material}</Badge>
                        </div>
                      </div>
                      <p className="font-bold text-blue-600">฿{product.base_price.toLocaleString()}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(product.id, product.name, size, product.base_price)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {size}"
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary & Customer Info */}
          <div className="space-y-6">
            {/* Cart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sarabun">
                  <ShoppingCart className="w-5 h-5" />
                  ตะกร้าสินค้า ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 font-sarabun">ยังไม่มีสินค้าในตะกร้า</p>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium font-sarabun">{item.productName}</h4>
                          <p className="text-sm text-gray-600">ขนาด: {item.size}"</p>
                          <p className="text-sm font-bold text-blue-600">฿{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => removeFromCart(item.productId, item.size)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between items-center font-bold text-lg">
                      <span className="font-sarabun">รวมทั้งหมด:</span>
                      <span className="text-blue-600">฿{getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">ข้อมูลลูกค้า</CardTitle>
                <CardDescription className="font-sarabun">กรอกข้อมูลสำหรับการติดต่อ</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="font-sarabun">
                        ชื่อ-นามสกุล *
                      </Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="font-sarabun">
                        บริษัท
                      </Label>
                      <Input
                        id="company"
                        value={customerInfo.company}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="font-sarabun">
                        เบอร์โทร *
                      </Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-sarabun">
                        อีเมล *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="font-sarabun">
                      ที่อยู่จัดส่ง
                    </Label>
                    <Textarea
                      id="address"
                      rows={3}
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="ที่อยู่สำหรับจัดส่งสินค้า"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="font-sarabun">
                      หมายเหตุ
                    </Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="ข้อมูลเพิ่มเติม เช่น เวลาที่สะดวกติดต่อ"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    ส่งคำสั่งซื้อ
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
