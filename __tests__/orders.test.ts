import { fetchOrders, createOrder, updateOrderStatus } from '@/actions/orders'
import { mockOrders } from '@/lib/mock/orders'

describe('orders actions', () => {
  test('fetchOrders returns mock data', async () => {
    const result = await fetchOrders(1,10)
    expect(result).toEqual({ orders: mockOrders, totalCount: mockOrders.length, error: null })
  })

  test('createOrder returns success', async () => {
    const result = await createOrder('user1', 10, [])
    expect(result.success).toBe(true)
  })

  test('updateOrderStatus returns success', async () => {
    const result = await updateOrderStatus('1', 'shipped')
    expect(result.success).toBe(true)
  })
})
