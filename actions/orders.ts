'use server'

import { mockOrders, MockOrder } from '@/lib/mock/orders'

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface Order extends MockOrder {}

export async function fetchOrders(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  const orders = mockOrders.slice(offset, offset + limit)
  return { orders, totalCount: mockOrders.length, error: null }
}

export async function fetchOrderById(orderId: string) {
  const order = mockOrders.find(o => o.id === orderId) || null
  return { order, error: null }
}

export async function fetchOrderCount() {
  return { count: mockOrders.length, error: null }
}

export async function fetchRecentOrders(limit: number) {
  return { orders: mockOrders.slice(0, limit), error: null }
}

export interface CartItem { id: string; quantity: number; base_price: number }

export async function createOrder(userId: string, totalAmount: number, cartItems: CartItem[]) {
  return { success: true, order: { id: 'new', user_id: userId, total_amount: totalAmount, status: 'pending', created_at: new Date().toISOString(), order_items: cartItems.map(ci => ({ product_id: ci.id, quantity: ci.quantity, price: ci.base_price })) } as Order }
}

export async function updateOrderStatus(id: string, status: string) {
  return { success: true }
}

export async function fetchUserOrders(userId: string) {
  return mockOrders.filter(o => o.user_id === userId)
}
