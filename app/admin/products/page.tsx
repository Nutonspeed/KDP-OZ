"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Edit, Trash2, UploadCloud } from 'lucide-react'
import { useAuthStore } from "@/lib/store"
import { fetchProducts, addProduct, updateProduct, deleteProduct, fetchLowStockProducts } from "@/actions/products"
import LowStockAlert from "@/components/dashboard/LowStockAlert"
import { toast } from "@/hooks/use-toast"
import { Product } from "@/types/product"

export default function AdminProducts() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    description: '',
    base_price: 0,
    image_url: '',
    category: '',
    sizes: [] as string[],
    is_featured: false,
    stock_quantity: 0, // Added for inventory
    // Extended fields for product management
    tags: '',
    discount_price: 0,
    sale_start_date: '',
    sale_end_date: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, loading])

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      if (isAuthenticated) {
        const { products: fetchedProducts } = await fetchProducts()
        setProducts(fetchedProducts)
        const { products: low } = await fetchLowStockProducts()
        setLowStockProducts(low)
        if (low.length) {
          toast({
            title: "แจ้งเตือนสต็อกต่ำ",
            description: `${low.length} สินค้าใกล้หมดสต็อก`,
          })
        }
      }
      setLoading(false)
    }
    loadProducts()
  }, [isAuthenticated])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
        <p className="font-sarabun">กำลังโหลด...</p>
      </div>
    )
  }

  const handleAddProductClick = () => {
    setCurrentProduct(null)
    setFormState({
      name: '',
      slug: '',
      description: '',
      base_price: 0,
      image_url: '',
      category: '',
      sizes: [] as string[],
      is_featured: false,
      stock_quantity: 0, // Reset stock
      tags: '',
      discount_price: 0,
      sale_start_date: '',
      sale_end_date: '',
    })
    setImageFile(null)
    setIsAddEditDialogOpen(true)
  }

  const handleEditProductClick = (product: Product) => {
    setCurrentProduct(product)
    setFormState({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      base_price: product.base_price,
      image_url: product.image_url || '',
      category: product.category || '',
      sizes: product.sizes,
      is_featured: product.is_featured || false,
      stock_quantity: product.stock_quantity, // Set stock
      // Convert array tags to comma-separated string for form
      tags: Array.isArray((product as any).tags) ? (product as any).tags.join(', ') : '',
      discount_price: (product as any).discount_price ?? 0,
      sale_start_date: (product as any).sale_start_date ?? '',
      sale_end_date: (product as any).sale_end_date ?? '',
    })
    setImageFile(null)
    setIsAddEditDialogOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormState((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value),
    }))
  }

  const handleSelectChange = (value: string, id: string) => {
    setFormState((prev) => ({ ...prev, [id]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) return formState.image_url;
    return formState.image_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrl = formState.image_url;

    if (imageFile) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return; // Stop if image upload failed
    }

    // Convert comma-separated tags string to an array and trim whitespace
    const tagArray = formState.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const productData = {
      ...formState,
      image_url: imageUrl,
      // store tags as an array on the product model
      tags: tagArray,
    } as any;

    let result;
    if (currentProduct) {
      result = await updateProduct(currentProduct.id, productData)
    } else {
      result = await addProduct(productData)
    }

    if (result.success) {
      const { products: fetchedProducts } = await fetchProducts()
      setProducts(fetchedProducts)
      setIsAddEditDialogOpen(false)
    } else {
      alert(`Failed to save product: ${result.error}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้")) {
      const result = await deleteProduct(id)
      if (result.success) {
      const { products: fetchedProducts } = await fetchProducts()
      setProducts(fetchedProducts)
      } else {
        alert(`Failed to delete product: ${result.error}`)
      }
    }
  }

  // Export the list of products to a CSV file.  This exports only key
  // fields needed for analysis: id, name, slug, base_price, stock_quantity,
  // and created_at.  Additional fields can be added if necessary.
  const handleExportCSV = () => {
    if (!products || products.length === 0) {
      alert('ไม่มีสินค้าสำหรับส่งออก')
      return
    }
    const headers = ['id', 'name', 'slug', 'base_price', 'stock_quantity', 'created_at']
    const lines = products.map((p) => [
      p.id,
      p.name,
      p.slug,
      p.base_price,
      p.stock_quantity,
      p.created_at,
    ])
    const csv = [headers.join(','), ...lines.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'products.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sarabun">จัดการสินค้า</h1>
            <p className="text-gray-600 font-sarabun">เพิ่ม แก้ไข และลบสินค้าในร้านค้าของคุณ</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV} className="font-sarabun">
              ส่งออก CSV
            </Button>
            <Button onClick={handleAddProductClick}>
              <PlusCircle className="w-4 h-4 mr-2" />
              เพิ่มสินค้าใหม่
            </Button>
          </div>
        </div>

        <LowStockAlert products={lowStockProducts} />

        <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">รายการสินค้า</CardTitle>
            <CardDescription className="font-sarabun">จำนวนสินค้าทั้งหมด: {products.length} รายการ</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sarabun">รูปภาพ</TableHead>
                  <TableHead className="font-sarabun">ชื่อสินค้า</TableHead>
                  <TableHead className="font-sarabun">Slug</TableHead>
                  <TableHead className="font-sarabun">ราคา</TableHead>
                  <TableHead className="font-sarabun">หมวดหมู่</TableHead>
                  <TableHead className="font-sarabun">สต็อก</TableHead> {/* Added stock column */}
                  <TableHead className="font-sarabun">แนะนำ</TableHead>
                  <TableHead className="font-sarabun">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image_url ? (
                        <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Image</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium font-sarabun">{product.name}</TableCell>
                    <TableCell className="font-sarabun">{product.slug}</TableCell>
                    <TableCell className="font-sarabun">฿{product.base_price.toLocaleString()}</TableCell>
                    <TableCell className="font-sarabun">{product.category}</TableCell>
                    <TableCell className="font-sarabun">{product.stock_quantity}</TableCell> {/* Display stock */}
                    <TableCell className="font-sarabun">{product.is_featured ? 'ใช่' : 'ไม่ใช่'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditProductClick(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Product Dialog */}
        <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-sarabun">{currentProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</DialogTitle>
              <DialogDescription className="font-sarabun">
                {currentProduct ? 'แก้ไขรายละเอียดสินค้าของคุณ' : 'เพิ่มสินค้าใหม่ลงในรายการสินค้า'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-sarabun">ชื่อสินค้า</Label>
                <Input id="name" value={formState.name} onChange={handleFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="font-sarabun">Slug (URL Friendly)</Label>
                <Input id="slug" value={formState.slug} onChange={handleFormChange} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="font-sarabun">รายละเอียด</Label>
                <Textarea id="description" value={formState.description} onChange={handleFormChange} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_price" className="font-sarabun">ราคา</Label>
                <Input id="base_price" type="number" value={formState.base_price} onChange={handleFormChange} required step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="font-sarabun">หมวดหมู่</Label>
                <Select value={formState.category} onValueChange={(value) => handleSelectChange(value, 'category')}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Instrumentation">Instrumentation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_quantity" className="font-sarabun">จำนวนสต็อก</Label>
                <Input id="stock_quantity" type="number" value={formState.stock_quantity} onChange={handleFormChange} required min="0" />
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <Label htmlFor="is_featured" className="font-sarabun">สินค้าแนะนำ</Label>
                <Switch id="is_featured" checked={formState.is_featured} onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, is_featured: checked }))} />
              </div>

              {/* Tags field: comma-separated list */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tags" className="font-sarabun">แท็ก (คั่นด้วย comma)</Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="เช่น sale, popular, new"
                  value={formState.tags}
                  onChange={handleFormChange}
                />
              </div>

              {/* Discount price */}
              <div className="space-y-2">
                <Label htmlFor="discount_price" className="font-sarabun">ราคาส่วนลด (ถ้ามี)</Label>
                <Input
                  id="discount_price"
                  type="number"
                  step="0.01"
                  value={formState.discount_price}
                  onChange={handleFormChange}
                  min="0"
                />
              </div>

              {/* Sale start date */}
              <div className="space-y-2">
                <Label htmlFor="sale_start_date" className="font-sarabun">วันที่เริ่มโปรโมชั่น</Label>
                <Input
                  id="sale_start_date"
                  type="date"
                  value={formState.sale_start_date}
                  onChange={handleFormChange}
                />
              </div>

              {/* Sale end date */}
              <div className="space-y-2">
                <Label htmlFor="sale_end_date" className="font-sarabun">วันที่สิ้นสุดโปรโมชั่น</Label>
                <Input
                  id="sale_end_date"
                  type="date"
                  value={formState.sale_end_date}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image_url" className="font-sarabun">รูปภาพสินค้า</Label>
                <Input id="image_url" type="file" onChange={handleImageChange} accept="image/*" />
                {formState.image_url && !imageFile && (
                  <div className="mt-2">
                    <img src={formState.image_url || "/placeholder.svg"} alt="Current Product Image" className="w-24 h-24 object-cover rounded-md" />
                  </div>
                )}
                {imageFile && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(imageFile) || "/placeholder.svg"} alt="New Product Image Preview" className="w-24 h-24 object-cover rounded-md" />
                  </div>
                )}
                {uploadingImage && <p className="text-sm text-gray-500 font-sarabun">กำลังอัปโหลดรูปภาพ...</p>}
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={uploadingImage}>
                  {currentProduct ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
