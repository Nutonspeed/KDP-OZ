'use server'

import {
  mockOrders,
  mockPayments,
  mockShippings,
  MockOrder,
  MockOrderItem,
} from '@/lib/mockDb'

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
  const orders = mockOrders.slice(offset, offset + limit) as Order[]
  return { orders, totalCount: mockOrders.length, error: null }
}

export async function fetchOrderById(orderId: string) {
  const order = (mockOrders.find((o) => o.id === orderId) as Order) || null
  return { order, error: null }
}

export async function fetchOrderCount() {
  return { count: mockOrders.length, error: null }
}

export async function fetchRecentOrders(limit: number) {
  return { orders: mockOrders.slice(0, limit) as Order[], error: null }
}

export interface CartItem { id: string; quantity: number; base_price: number }

export async function createOrder(
  userId: string,
  totalAmount: number,
  cartItems: CartItem[],
  shipping: {
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
) {
  // Generate a new unique order ID based on the current length. In a real
  // database this would be handled by the database itself.
  const newId = (mockOrders.length + 1).toString()
  const createdAt = new Date().toISOString()
  // Construct a shipping address object compatible with the MockOrder type.  Name
  // and address line2 are omitted because they are not collected in the
  // checkout form. If needed, these fields can be added later.
  const shippingAddress = {
    name: '',
    address_line1: shipping.address,
    city: shipping.city,
    state: shipping.state,
    zip_code: shipping.zip,
    country: shipping.country,
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
      product_id: ci.id,
      quantity: ci.quantity,
      price: ci.base_price,
      price_at_purchase: ci.base_price,
    })),
  }
  // Persist the new order in the mock database
  mockOrders.push(order as MockOrder)
  // Create an associated payment record with status unpaid
  const paymentId = `pay_${mockPayments.length + 1}`
  mockPayments.push({
    id: paymentId,
    order_id: newId,
    amount: totalAmount,
    status: 'unpaid',
    created_at: createdAt,
    updated_at: createdAt,
  })
  // Create an associated shipping record.  Even though the Shipping
  // interface does not include address fields, we maintain the address on the
  // order itself (shipping_address).  Shipping entries track only the
  // status and timestamps.
  mockShippings.push({
    id: newId,
    order_id: newId,
    status: 'processing',
    updated_at: createdAt,
  })
  // Notify the system that a new order has been created.  In a real
  // implementation this could dispatch an event or send an email.  Here we
  // simply log to the server console so that admins can see the event in
  // their logs during testing.
  console.log(`New order created: ${newId}`)
  return {
    success: true,
    orderId: newId,
    order,
    error: null,
  }
}

type ActionResult = { success: boolean; error?: string }

export async function updateOrder(id: string, data: Partial<Order>): Promise<ActionResult> {
  const idx = mockOrders.findIndex(o => o.id === id)
  if (idx === -1) {
    return { success: false, error: 'Order not found' }
  }
  const existing = mockOrders[idx]
  // Merge provided fields onto the existing order.
  mockOrders[idx] = { ...existing, ...data } as MockOrder
  return { success: true }
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  const orderIdx = mockOrders.findIndex(o => o.id === id)
  if (orderIdx >= 0) {
    mockOrders.splice(orderIdx, 1)
    // Remove related payment records
    const paymentIdx = mockPayments.findIndex(p => p.order_id === id)
    if (paymentIdx >= 0) mockPayments.splice(paymentIdx, 1)
    // Remove related shipping records
    const shipIdx = mockShippings.findIndex(s => s.order_id === id)
    if (shipIdx >= 0) mockShippings.splice(shipIdx, 1)
    return { success: true }
  }
  return { success: false, error: 'Order not found' }
}

export async function updateOrderStatus(id: string, status: string): Promise<ActionResult> {
  const order = mockOrders.find(o => o.id === id)
  if (!order) {
    return { success: false, error: 'Order not found' }
  }
  order.status = status
  // Update shipping status if shipping entry exists
  const shipping = mockShippings.find(s => s.order_id === id)
  if (shipping) {
    shipping.status = status as any
    shipping.updated_at = new Date().toISOString()
  } else {
    // Create a shipping record if none exists
    mockShippings.push({
      id: id,
      order_id: id,
      status: status as any,
      updated_at: new Date().toISOString(),
    })
  }
  return { success: true }
}

export async function fetchUserOrders(userId: string) {
  return mockOrders.filter(o => o.user_id === userId) as Order[]
}

// Update the shipping status for a given order. This helper can be used
// by admin UIs to change the shipping state independently of the order
// status.
export async function updateShippingStatus(orderId: string, status: string): Promise<ActionResult> {
  const shipping = mockShippings.find(s => s.order_id === orderId)
  const now = new Date().toISOString()
  if (shipping) {
    shipping.status = status as any
    shipping.updated_at = now
    return { success: true }
  }
  // If no shipping record exists, create one
  mockShippings.push({ id: orderId, order_id: orderId, status: status as any, updated_at: now })
  return { success: true }
}
