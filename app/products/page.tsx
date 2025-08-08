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
            {filteredProducts.map((product) => {
              // Determine if the product is currently on sale based on discount price and optional sale dates
              const now = new Date();
              const hasDiscount = typeof product.discount_price === 'number' && product.discount_price > 0;
              const saleStart = product.sale_start_date ? new Date(product.sale_start_date) : null;
              const saleEnd = product.sale_end_date ? new Date(product.sale_end_date) : null;
              const isOnSale =
                hasDiscount &&
                (!saleStart || saleStart <= now) &&
                (!saleEnd || saleEnd >= now);

              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Product image */}
                    <Image
                      src={product.image_url || "/placeholder.svg?height=400&width=400&text=Product+Image"}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="p-4 bg-white">
                      {/* Product name */}
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors font-sarabun">
                        {product.name}
                      </h3>
                      {/* Product description */}
                      <p className="text-sm text-gray-500 mt-1 font-sarabun line-clamp-2">
                        {product.description || "ไม่มีรายละเอียด"}
                      </p>
                      {/* Type and material badges */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.type && <Badge variant="secondary" className="font-sarabun">{product.type}</Badge>}
                        {product.material && <Badge variant="secondary" className="font-sarabun">{product.material}</Badge>}
                        {/* Product tags */}
                        {product.tags && product.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-sarabun">{tag}</Badge>
                        ))}
                        {/* Sale badge */}
                        {isOnSale && (
                          <Badge variant="destructive" className="font-sarabun">ลดราคา</Badge>
                        )}
                      </div>
                      {/* Price display: show discount price if on sale */}
                      <div className="mt-4 text-xl font-bold font-sarabun">
                        {isOnSale ? (
                          <>
                            <span className="text-red-600">฿{(product.discount_price ?? 0).toLocaleString()}</span>
                            <span className="text-sm line-through ml-2 text-gray-500">
                              ฿{product.base_price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-900">฿{product.base_price.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500 font-sarabun">{product.stock_quantity > 0 ? `คงเหลือ ${product.stock_quantity} ชิ้น` : "สินค้าหมด"}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
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
