'use client'

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Product } from "@/types/product"
import { useCartStore } from "@/lib/store"
import { ShoppingCart, Minus, Plus } from 'lucide-react'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items);

  const currentCartItem = cartItems.find(item => item.id === product.id);
  const currentQuantityInCart = currentCartItem ? currentCartItem.quantity : 0;
  const availableStock = product.stock_quantity - currentQuantityInCart;
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (quantity > 0 && availableStock >= quantity) {
      addItem(product, quantity);
      setQuantity(1); // Reset quantity after adding to cart
    } else if (isOutOfStock) {
      alert("สินค้าหมดสต็อกแล้ว");
    } else {
      alert(`ไม่สามารถเพิ่มสินค้าได้เกินจำนวนที่มีในสต็อก (${product.stock_quantity} ชิ้น) หรือเกินจำนวนที่เหลืออยู่ (${availableStock} ชิ้น)`);
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(0); // Allow empty input temporarily for user to type
    }
  }

  const incrementQuantity = () => {
    if (quantity < availableStock) {
      setQuantity((prev) => prev + 1);
    } else if (availableStock === 0 && !isOutOfStock) {
      // If availableStock is 0 but not truly out of stock (meaning all are in cart),
      // we should prevent adding more.
      alert("สินค้าในตะกร้าของคุณมีครบตามจำนวนสต็อกแล้ว");
    } else if (isOutOfStock) {
      alert("สินค้าหมดสต็อกแล้ว");
    } else {
      alert(`ไม่สามารถเพิ่มได้เกินจำนวนที่เหลืออยู่ (${availableStock} ชิ้น)`);
    }
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  return (
    <Card className="w-full max-w-4xl mx-auto md:flex">
      <div className="md:w-1/2 p-4">
        {product.image_url ? (
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-auto object-contain rounded-lg"
            priority
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <CardContent className="md:w-1/2 p-6 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 font-sarabun">{product.name}</h1>
        <p className="text-gray-600 font-sarabun">{product.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-blue-600 font-sarabun">฿{product.base_price.toLocaleString()}</span>
          <span className="text-lg text-gray-500 font-sarabun">/ ชิ้น</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-sarabun">
            สถานะสต็อก:{" "}
            <span className={`font-semibold ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
              {isOutOfStock ? "สินค้าหมด" : `มีสินค้าในสต็อก ${product.stock_quantity} ชิ้น`}
            </span>
          </p>
          {!isOutOfStock && (
            <p className="text-sm text-gray-500 font-sarabun">
              (เหลือในตะกร้าได้อีก {availableStock} ชิ้น)
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-20 text-center font-sarabun"
            min="1"
            max={availableStock > 0 ? availableStock : 1} // Max quantity is available stock
            disabled={isOutOfStock}
          />
          <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={quantity >= availableStock || isOutOfStock}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            className="flex-1 ml-4 font-sarabun"
            onClick={handleAddToCart}
            disabled={isOutOfStock || quantity <= 0 || quantity > availableStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            เพิ่มลงตะกร้า
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
