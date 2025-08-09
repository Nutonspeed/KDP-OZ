import { createOrder, updateOrder, createInvoiceForOrder } from '@/actions/orders'

describe('orders actions', () => {
  test('createOrder returns success', async () => {
    const result = await createOrder('user1', 10, [])
    expect(result.success).toBe(true)
  })

  test('updateOrder returns success with updated data', async () => {
    const { orderId } = await createOrder('user1', 10, [])
    const result = await updateOrder(orderId!, { status: 'shipped' } as any)
    expect(result.success).toBe(true)
    expect(result.order?.status).toBe('shipped')
  })

  test('createInvoiceForOrder returns invoice url', async () => {
    const { orderId } = await createOrder('user1', 10, [])
    const result = await createInvoiceForOrder(orderId!)
    expect(result.success).toBe(true)
    expect(result.invoiceUrl).toBeDefined()
  })
})
