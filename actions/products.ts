
// Use the standalone mock products so tests reference the same data instance
import { mockProducts } from '@/lib/mock/products'
import { Product } from '@/types/product'

export async function fetchProducts(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  const products = mockProducts.slice(offset, offset + limit)
  return { products, totalCount: mockProducts.length, error: null }
}

export async function fetchProductBySlug(slug: string) {
  const product = mockProducts.find(p => p.slug === slug) || null
  return { product, error: null }
}

export async function fetchProductCount() {
  return { count: mockProducts.length, error: null }
}

export async function fetchRecentProducts(limit: number) {
  return { products: mockProducts.slice(0, limit), error: null }
}

type ActionResult<T = {}> = { success: boolean; error?: string } & T

export async function addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ActionResult<{ product: Product }>> {
  const newId = (mockProducts.length + 1).toString()
  const now = new Date().toISOString()
  const newProduct: Product = {
    id: newId,
    created_at: now,
    updated_at: now,
    ...productData,
  }
  mockProducts.push(newProduct)
  return { success: true, product: newProduct }
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<ActionResult<{ product: Product | null }>> {
  const idx = mockProducts.findIndex(p => p.id === id)
  if (idx === -1) {
    return { success: false, error: 'Product not found', product: null }
  }
  const existing = mockProducts[idx]
  // Update updated_at timestamp and merge new fields
  const updated = { ...existing, ...productData, updated_at: new Date().toISOString() }
  mockProducts[idx] = updated
  return { success: true, product: updated }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const idx = mockProducts.findIndex(p => p.id === id)
  if (idx >= 0) {
    mockProducts.splice(idx, 1)
    return { success: true }
  }
  return { success: false, error: 'Product not found' }
}
