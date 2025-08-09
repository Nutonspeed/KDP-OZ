import { generateInvoice } from '@/lib/db/orders'
import type { Order, OrderItem } from '@/types/order'
import type { OrderInput } from '@/lib/db/ordersDb'

export interface CartItem { id: string; quantity: number; base_price: number }

type OrderService = typeof import('@/lib/db/ordersDb')

async function getService(): Promise<OrderService> {
  if (process.env.POSTGRES_URL) {
    return await import('@/lib/db/ordersDb')
  }
  return await import('@/lib/services/orders')
}

export async function listOrders(page: number = 1, limit: number = 10) {
  const service = await getService()
  const { orders, totalCount } = await service.listOrders(page, limit)
  return { orders, totalCount, error: null }
}

// Backwards compatibility
export async function fetchOrders(page: number = 1, limit: number = 10) {
  return listOrders(page, limit)
}

export async function getOrderById(id: string) {
  const service = await getService()
  const order = await service.getOrderById(id)
  return { order, error: null }
}

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
) {
  const service = await getService()
  const orderData: OrderInput = {
    user_id: userId,
    total_amount: totalAmount,
    status: 'pending',
    payment_status: 'unpaid',
    shipping_address: shipping
      ? {
          name: '',
          address_line1: shipping.address,
          city: shipping.city,
          state: shipping.state,
          zip_code: shipping.zip,
          country: shipping.country,
        }
      : undefined,
    order_items: cartItems.map(ci => ({
      product_id: ci.id,
      quantity: ci.quantity,
      price: ci.base_price,
      price_at_purchase: ci.base_price,
    })),
  }
  const order = await service.createOrder(orderData)
  return { success: true, orderId: order.id, order, error: null }
}

export async function updateOrder(id: string, data: Partial<Order>) {
  const service = await getService()
  const order = await service.updateOrder(id, data)
  if (!order) {
    return { success: false, error: 'Order not found', order: null }
  }
  return { success: true, order }
}

export async function updateOrderStatus(id: string, status: string) {
  return updateOrder(id, { status })
}

export async function deleteOrder(id: string) {
  const service = await getService()
  const success = await service.deleteOrder(id)
  return success ? { success: true } : { success: false, error: 'Order not found' }
}

export async function createInvoiceForOrder(orderId: string) {
  const service = await getService()
  const order = await service.getOrderById(orderId)
  if (!order) {
    return { success: false, error: 'Order not found' }
  }
  if (order.invoice_url) {
    return { success: true, invoiceUrl: order.invoice_url }
  }
  const invoiceResult = await generateInvoice(orderId, order.total_amount)
  if (!invoiceResult.success) {
    return { success: false, error: invoiceResult.error }
  }
  const invoice = invoiceResult.invoice
  await service.updateOrder(orderId, { invoice_url: invoice.url, invoice_id: invoice.id })
  return { success: true, invoiceUrl: invoice.url }
}

export async function fetchOrderCount() {
  const service = await getService()
  const { totalCount } = await service.listOrders(1, 1)
  return { count: totalCount, error: null }
}

export async function fetchRecentOrders(limit: number) {
  const service = await getService()
  const { orders } = await service.listOrders(1, limit)
  return { orders, error: null }
}

export const fetchOrderById = getOrderById

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const service = await getService()
  const { orders } = await service.listOrders(1, 1000)
  return orders.filter(o => o.user_id === userId)
}

export type { Order, OrderItem }
