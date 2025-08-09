import { addProduct, updateProduct, deleteProduct } from '@/actions/products'

const sampleProduct = {
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

describe('products actions', () => {
  test('addProduct returns success', async () => {
    const result = await addProduct({ ...sampleProduct })
    expect(result.success).toBe(true)
    expect(result.product).toBeDefined()
  })

  test('updateProduct returns success with updated data', async () => {
    const { product } = await addProduct({ ...sampleProduct, slug: 'prod-update' })
    const result = await updateProduct(product.id, { name: 'Updated Prod' })
    expect(result.success).toBe(true)
    expect(result.product?.name).toBe('Updated Prod')
  })

  test('deleteProduct returns success', async () => {
    const { product } = await addProduct({ ...sampleProduct, slug: 'prod-delete' })
    const result = await deleteProduct(product.id)
    expect(result.success).toBe(true)
  })
})
