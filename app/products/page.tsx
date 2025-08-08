"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from 'react'
import { fetchProducts } from "@/actions/products"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Product } from "@/types/product" // Import Product type

// We convert this page into a client component to enable search/filter functionality.
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { products: fetched } = await fetchProducts()
      setProducts(fetched)
      setLoading(false)
    }
    load()
  }, [])

  // Simple case-insensitive search across product name and description
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase()
    return (
      p.name.toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center text-slate-900 mb-8 font-sarabun">สินค้าของเรา</h1>
      <p className="text-center text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto font-sarabun">
        สำรวจผลิตภัณฑ์คุณภาพสูงของเราที่ออกแบบมาเพื่อตอบสนองความต้องการทางวิศวกรรมของคุณ
        ไม่ว่าจะเป็นงานอุตสาหกรรมหรือเชิงพาณิชย์
      </p>
      {/* Search bar */}
      <div className="max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="ค้นหาชื่อหรือรายละเอียดสินค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="font-sarabun"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg font-sarabun">กำลังโหลดสินค้า...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=400&width=400&text=Product+Image"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors font-sarabun">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 font-sarabun line-clamp-2">
                      {product.description || "ไม่มีรายละเอียด"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="font-sarabun">{product.type}</Badge>
                      <Badge variant="secondary" className="font-sarabun">{product.material}</Badge>
                    </div>
                    <div className="mt-4 text-xl font-bold text-slate-900 font-sarabun">
                      ฿{product.base_price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg font-sarabun">ไม่พบสินค้าที่ตรงกับคำค้นหา</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
