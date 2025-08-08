import * as productService from '@/lib/services/products'
import { Product } from '@/types/product'

export async function fetchProducts(page: number = 1, limit: number = 10) {
  const { products, totalCount } = productService.listProducts(page, limit)
  return { products, totalCount, error: null }
}

export async function fetchProductBySlug(slug: string) {
  const product = productService.getProductBySlug(slug)
  return { product, error: null }
}

export async function fetchProductCount() {
  const count = productService.getProductCount()
  return { count, error: null }
}

export async function fetchRecentProducts(limit: number) {
  const products = productService.getRecentProducts(limit)
  return { products, error: null }
}

export async function fetchLowStockProducts(threshold: number = 5) {
  const products = productService.getLowStockProducts(threshold)
  return { products, error: null }
}

type ActionResult<T = {}> = { success: boolean; error?: string } & T

export async function addProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<ActionResult<{ product: Product }>> {
  const product = productService.addProduct(productData)
  return { success: true, product }
}

export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<ActionResult<{ product: Product | null }>> {
  const product = productService.updateProduct(id, productData)
  if (!product) {
    return { success: false, error: 'Product not found', product: null }
  }
  return { success: true, product }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const success = productService.deleteProduct(id)
  return success ? { success: true } : { success: false, error: 'Product not found' }
}
