import { mockProducts } from '@/lib/mockDb'
import { Product } from '@/types/product'

export async function listProducts(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  const products = mockProducts.slice(offset, offset + limit)
  return { products, totalCount: mockProducts.length }
}

export async function getProductBySlug(slug: string) {
  return mockProducts.find((p) => p.slug === slug) || null
}

export async function getProductById(id: string) {
  return mockProducts.find((p) => p.id === id) || null
}

export async function getProductCount() {
  return mockProducts.length
}

export async function getRecentProducts(limit: number) {
  return mockProducts.slice(0, limit)
}

export async function getLowStockProducts(threshold: number = 5) {
  return mockProducts.filter((p) => p.stock_quantity < threshold)
}

type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>

export async function addProduct(productData: ProductInput): Promise<Product> {
  const newId = (mockProducts.length + 1).toString()
  const now = new Date().toISOString()
  const newProduct: Product = { id: newId, created_at: now, updated_at: now, ...productData }
  mockProducts.push(newProduct)
  return newProduct
}

export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product | null> {
  const idx = mockProducts.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const existing = mockProducts[idx]
  const updated: Product = { ...existing, ...productData, updated_at: new Date().toISOString() }
  mockProducts[idx] = updated
  return updated
}

export async function deleteProduct(id: string): Promise<boolean> {
  const idx = mockProducts.findIndex((p) => p.id === id)
  if (idx === -1) return false
  mockProducts.splice(idx, 1)
  return true
}
