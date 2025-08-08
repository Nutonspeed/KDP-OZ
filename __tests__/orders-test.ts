import { fetchOrders, createOrder, updateOrderStatus } from '@/actions/orders'
// Align the test data with the orders module used by actions
import { mockOrders } from '@/lib/mock/orders'

describe('orders actions', () => {
  test('fetchOrders returns mock data', async () => {
    const result = await fetchOrders(1,10)
    expect(result).toEqual({ orders: mockOrders, totalCount: mockOrders.length, error: null })
  })

  test('createOrder returns success', async () => {
    const result = await createOrder('user1', 10, [], {
      address: '123 Test St',
      city: 'Testville',
      state: 'TS',
      zip: '12345',
      country: 'Testland',
    })
    expect(result.success).toBe(true)
  })

  test('updateOrderStatus returns success', async () => {
    const result = await updateOrderStatus('1', 'shipped')
    expect(result.success).toBe(true)
  })
})
