import { fetchProducts, addProduct } from '@/actions/products'
import { mockDb } from '@/lib/mockDb'

describe('products actions', () => {
  test('fetchProducts returns mock data', async () => {
    const result = await fetchProducts(1, 10)
    expect(result).toEqual({ products: mockDb.products, totalCount: mockDb.products.length, error: null })
  })

  test('addProduct returns success', async () => {
    const productData: any = {
      name: 'Prod',
      slug: 'prod',
      description: '',
      base_price: 10,
      category: '',
      type: '',
      material: '',
      sizes: [],
      image_url: '',
      stock_quantity: 0,
    }
    const result = await addProduct(productData)
    expect(result.success).toBe(true)
  })
})
