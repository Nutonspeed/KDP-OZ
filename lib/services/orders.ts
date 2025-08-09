import { mockOrders, MockOrder } from '@/lib/mock/orders'
import { mockPayments, mockShippings } from '@/lib/mockDb'
import { Order } from '@/types/order'

export async function listOrders(page = 1, limit = 10): Promise<{ orders: Order[]; totalCount: number }> {
  const offset = (page - 1) * limit
  const orders = mockOrders.slice(offset, offset + limit) as Order[]
  return { orders, totalCount: mockOrders.length }
}

export async function getOrderById(id: string): Promise<Order | null> {
  return (mockOrders.find(o => o.id === id) as Order) || null
}

export interface CartItem { id: string; quantity: number; base_price: number }

export async function createOrder(
  userId: string,
  totalAmount: number,
  cartItems: CartItem[],
  shipping?: {
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
): Promise<Order> {
  const newId = (mockOrders.length + 1).toString()
  const createdAt = new Date().toISOString()
  const shippingAddress = shipping
    ? {
        name: '',
        address_line1: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zip_code: shipping.zip,
        country: shipping.country,
      }
    : {
        name: '',
        address_line1: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
      }
  const order: Order = {
    id: newId,
    user_id: userId,
    total_amount: totalAmount,
    status: 'pending',
    payment_status: 'unpaid',
    created_at: createdAt,
    shipping_address: shippingAddress,
    order_items: cartItems.map((ci, idx) => ({
      id: `${idx + 1}`,
      order_id: newId,
      product_id: ci.id,
      quantity: ci.quantity,
      price: ci.base_price,
      price_at_purchase: ci.base_price,
    })),
  }
  mockOrders.push(order as MockOrder)
  const paymentId = `pay_${mockPayments.length + 1}`
  mockPayments.push({
    id: paymentId,
    order_id: newId,
    amount: totalAmount,
    status: 'unpaid',
    created_at: createdAt,
    updated_at: createdAt,
  })
  mockShippings.push({
    id: newId,
    order_id: newId,
    status: 'processing',
    updated_at: createdAt,
  })
  return order
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
  const idx = mockOrders.findIndex(o => o.id === id)
  if (idx === -1) return null
  const existing = mockOrders[idx]
  mockOrders[idx] = { ...existing, ...data } as MockOrder
  return mockOrders[idx] as Order
}

export async function deleteOrder(id: string): Promise<boolean> {
  const orderIdx = mockOrders.findIndex(o => o.id === id)
  if (orderIdx >= 0) {
    mockOrders.splice(orderIdx, 1)
    const paymentIdx = mockPayments.findIndex(p => p.order_id === id)
    if (paymentIdx >= 0) mockPayments.splice(paymentIdx, 1)
    const shipIdx = mockShippings.findIndex(s => s.order_id === id)
    if (shipIdx >= 0) mockShippings.splice(shipIdx, 1)
    return true
  }
  return false
}
