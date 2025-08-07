'use server'

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

export async function addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  return { success: true, product: { ...productData, id: 'new', created_at: '', updated_at: '' } as Product }
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'created_at'>>) {
  const product = mockProducts.find(p => p.id === id) || null
  return { success: true, product }
}

export async function deleteProduct(id: string) {
  return { success: true }
}
