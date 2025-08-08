'use server'

import { mockDb } from '@/lib/mockDb'
import { Product } from '@/types/product'

export async function fetchProducts(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  const products = mockDb.products.slice(offset, offset + limit)
  return { products, totalCount: mockDb.products.length, error: null }
}

export async function fetchProductBySlug(slug: string) {
  const product = mockDb.products.find(p => p.slug === slug) || null
  return { product, error: null }
}

export async function fetchProductCount() {
  return { count: mockDb.products.length, error: null }
}

export async function fetchRecentProducts(limit: number) {
  return { products: mockDb.products.slice(0, limit), error: null }
}

type ActionResult<T = {}> = { success: boolean; error?: string } & T

export async function addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ActionResult<{ product: Product }>> {
  const newProduct: Product = {
    ...productData,
    id: String(mockDb.products.length + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockDb.products.push(newProduct)
  return { success: true, product: newProduct }
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<ActionResult<{ product: Product | null }>> {
  const product = mockDb.products.find(p => p.id === id) || null
  if (product) {
    Object.assign(product, productData, { updated_at: new Date().toISOString() })
  }
  return { success: true, product }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const idx = mockDb.products.findIndex(p => p.id === id)
  if (idx !== -1) {
    mockDb.products.splice(idx, 1)
  }
  return { success: true }
}
