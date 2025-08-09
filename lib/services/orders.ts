import { mockOrders, MockOrder } from '@/lib/mock/orders'
import { mockPayments, mockShippings } from '@/lib/mockDb'
import type { Order } from '@/types/order'
import type { OrderInput } from '@/lib/db/ordersDb'

export async function listOrders(page = 1, limit = 10): Promise<{ orders: Order[]; totalCount: number }> {
  const offset = (page - 1) * limit
  const orders = mockOrders.slice(offset, offset + limit) as Order[]
  return { orders, totalCount: mockOrders.length }
}

export async function getOrderById(id: string): Promise<Order | null> {
  return (mockOrders.find(o => o.id === id) as Order) || null
}

export async function createOrder(data: OrderInput): Promise<Order> {
  const newId = (mockOrders.length + 1).toString()
  const createdAt = new Date().toISOString()
  const order: Order = {
    id: newId,
    user_id: data.user_id,
    total_amount: data.total_amount,
    status: data.status,
    payment_status: data.payment_status as any,
    created_at: createdAt,
    notes: data.notes,
    shipping_address: data.shipping_address,
    invoice_url: data.invoice_url,
    invoice_id: data.invoice_id,
    order_items: data.order_items?.map((ci, idx) => ({
      id: `${idx + 1}`,
      order_id: newId,
      product_id: ci.product_id,
      quantity: ci.quantity,
      price: ci.price,
      product_name: ci.product_name,
      price_at_purchase: ci.price_at_purchase,
    })),
  }
  mockOrders.push(order as MockOrder)
  const paymentId = `pay_${mockPayments.length + 1}`
  mockPayments.push({
    id: paymentId,
    order_id: newId,
    amount: data.total_amount,
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
