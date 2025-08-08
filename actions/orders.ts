'use server'

import { mockDb, MockOrder, MockOrderItem } from '@/lib/mockDb'

export interface OrderItem
  extends Omit<MockOrderItem, 'price_at_purchase'> {
  price_at_purchase: number
  product_image_url?: string
  product_slug?: string
}

export interface Order extends Omit<MockOrder, 'order_items'> {
  order_items?: OrderItem[]
}

export async function fetchOrders(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  const orders = mockDb.orders.slice(offset, offset + limit) as Order[]
  return { orders, totalCount: mockDb.orders.length, error: null }
}

export async function fetchOrderById(orderId: string) {
  const order = (mockDb.orders.find((o) => o.id === orderId) as Order) || null
  return { order, error: null }
}

export async function fetchOrderCount() {
  return { count: mockDb.orders.length, error: null }
}

export async function fetchRecentOrders(limit: number) {
  return { orders: mockDb.orders.slice(0, limit) as Order[], error: null }
}

export interface CartItem { id: string; quantity: number; base_price: number }

export async function createOrder(
  userId: string,
  totalAmount: number,
  cartItems: CartItem[]
) {
  const order: Order = {
    id: String(mockDb.orders.length + 1),
    user_id: userId,
    total_amount: totalAmount,
    status: 'pending',
    payment_status: 'unpaid',
    created_at: new Date().toISOString(),
    order_items: cartItems.map((ci, idx) => ({
      id: `${idx + 1}`,
      product_id: ci.id,
      quantity: ci.quantity,
      price: ci.base_price,
      price_at_purchase: ci.base_price,
    })),
  }

  mockDb.orders.push(order)

  return {
    success: true,
    orderId: order.id,
    order,
    error: null,
  }
}

type ActionResult = { success: boolean; error?: string }

export async function updateOrder(id: string, data: Partial<Order>): Promise<ActionResult> {
  const order = mockDb.orders.find(o => o.id === id)
  if (!order) return { success: false, error: 'Order not found' }
  Object.assign(order, data)
  return { success: true }
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  const index = mockDb.orders.findIndex(o => o.id === id)
  if (index === -1) return { success: false, error: 'Order not found' }
  mockDb.orders.splice(index, 1)
  return { success: true }
}

export async function updateOrderStatus(id: string, status: string): Promise<ActionResult> {
  const order = mockDb.orders.find(o => o.id === id)
  if (!order) return { success: false, error: 'Order not found' }
  order.status = status
  return { success: true }
}

export async function fetchUserOrders(userId: string) {
  return mockDb.orders.filter((o) => o.user_id === userId) as Order[]
}
