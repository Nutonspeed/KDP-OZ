import { fetchOrders, createOrder, updateOrderStatus } from '@/actions/orders'
import { mockDb } from '@/lib/mockDb'

describe('orders actions', () => {
  test('fetchOrders returns mock data', async () => {
    const result = await fetchOrders(1,10)
    expect(result).toEqual({ orders: mockDb.orders, totalCount: mockDb.orders.length, error: null })
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
