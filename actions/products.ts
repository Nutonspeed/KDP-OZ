import { Product } from '@/types/product'

type ProductService = typeof import('@/lib/db/products')

async function getService(): Promise<ProductService> {
  if (process.env.POSTGRES_URL) {
    return await import('@/lib/db/products')
  }
  return await import('@/lib/services/products')
}

export async function fetchProducts(page: number = 1, limit: number = 10) {
  const service = await getService()
  const { products, totalCount } = await service.listProducts(page, limit)
  return { products, totalCount, error: null }
}

export async function fetchProductBySlug(slug: string) {
  const service = await getService()
  const product = await service.getProductBySlug(slug)
  return { product, error: null }
}

export async function fetchProductById(id: string) {
  const service = await getService()
  const product = await service.getProductById(id)
  return { product, error: null }
}

export async function fetchProductCount() {
  const service = await getService()
  const count = await service.getProductCount()
  return { count, error: null }
}

export async function fetchRecentProducts(limit: number) {
  const service = await getService()
  const products = await service.getRecentProducts(limit)
  return { products, error: null }
}

export async function fetchLowStockProducts(threshold: number = 5) {
  const service = await getService()
  const products = await service.getLowStockProducts(threshold)
  return { products, error: null }
}

type ActionResult<T = {}> = { success: boolean; error?: string } & T

export async function addProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<ActionResult<{ product: Product }>> {
  const service = await getService()
  const product = await service.addProduct(productData)
  return { success: true, product }
}

export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<ActionResult<{ product: Product | null }>> {
  const service = await getService()
  const product = await service.updateProduct(id, productData)
  if (!product) {
    return { success: false, error: 'Product not found', product: null }
  }
  return { success: true, product }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const service = await getService()
  const success = await service.deleteProduct(id)
  return success ? { success: true } : { success: false, error: 'Product not found' }
}
