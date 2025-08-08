"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/lib/store"
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "@/actions/products"
import { Product } from "@/types/product"
import { PlusCircle, Edit, Trash2 } from "lucide-react"

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  base_price: z.coerce.number().nonnegative(),
  image_url: z.string().url().optional(),
  category: z.string().optional(),
  stock_quantity: z.coerce.number().int().nonnegative(),
  is_featured: z.boolean().optional(),
  sizes: z.string().optional(), // comma separated
})

type ProductFormValues = z.infer<typeof productSchema>

export default function AdminProductsPage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      base_price: 0,
      image_url: "",
      category: "",
      stock_quantity: 0,
      is_featured: false,
      sizes: "",
    },
  })

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, loading])

  const loadProducts = async () => {
    setLoading(true)
    const { products: list } = await fetchProducts()
    setProducts(list)
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  const handleAdd = () => {
    setEditing(null)
    form.reset()
    setOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditing(product)
    form.reset({
      ...product,
      sizes: product.sizes.join(", "),
    })
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    loadProducts()
  }

  const onSubmit = async (values: ProductFormValues) => {
    const payload = {
      ...values,
      sizes: values.sizes ? values.sizes.split(",").map((s) => s.trim()) : [],
    }
    if (editing) {
      await updateProduct(editing.id, payload as any)
    } else {
      await addProduct(payload as any)
    }
    setOpen(false)
    loadProducts()
  }

  if (loading || !isAuthenticated) {
    return <div className="p-8 font-sarabun">กำลังโหลด...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-sarabun">จัดการสินค้า</h1>
        <Button onClick={handleAdd} className="font-sarabun">
          <PlusCircle className="w-4 h-4 mr-2" /> เพิ่มสินค้า
        </Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-sarabun">ชื่อ</TableHead>
                <TableHead className="font-sarabun">Slug</TableHead>
                <TableHead className="font-sarabun">ราคา</TableHead>
                <TableHead className="font-sarabun">สต็อก</TableHead>
                <TableHead className="font-sarabun">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-sarabun">{p.name}</TableCell>
                  <TableCell className="font-sarabun">{p.slug}</TableCell>
                  <TableCell className="font-sarabun">฿{p.base_price.toLocaleString()}</TableCell>
                  <TableCell className="font-sarabun">{p.stock_quantity}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(p.id)}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-sarabun">
              {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-sarabun">ชื่อสินค้า</Label>
              <Input id="name" {...form.register("name")}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug" className="font-sarabun">Slug</Label>
              <Input id="slug" {...form.register("slug")}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="font-sarabun">รายละเอียด</Label>
              <Textarea id="description" {...form.register("description")}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="base_price" className="font-sarabun">ราคา</Label>
              <Input id="base_price" type="number" step="0.01" {...form.register("base_price", { valueAsNumber: true })}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="font-sarabun">หมวดหมู่</Label>
              <Input id="category" {...form.register("category")}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock_quantity" className="font-sarabun">สต็อก</Label>
              <Input id="stock_quantity" type="number" {...form.register("stock_quantity", { valueAsNumber: true })}/>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="is_featured" className="font-sarabun">สินค้าแนะนำ</Label>
              <Controller
                name="is_featured"
                control={form.control}
                render={({ field }) => (
                  <Switch id="is_featured" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sizes" className="font-sarabun">ขนาด (คั่นด้วยคอมมา)</Label>
              <Input id="sizes" {...form.register("sizes")}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url" className="font-sarabun">ลิงก์รูปภาพ</Label>
              <Input id="image_url" {...form.register("image_url")}/>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="font-sarabun">ยกเลิก</Button>
              <Button type="submit" className="font-sarabun">{editing ? "บันทึก" : "เพิ่ม"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
