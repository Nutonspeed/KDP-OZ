'use server'

import { mockPayments, mockOrders } from '@/lib/mockDb'
import { updateOrderStatus } from './orders'

export async function createPaymentIntent(amount: number, orderId: string) {
  // Generate a mock payment ID and persist a new payment record. The
  // clientSecret in this context is simply the mock payment ID and not
  // related to any external provider.
  const paymentId = `pi_${mockPayments.length + 1}`
  const now = new Date().toISOString()
  mockPayments.push({
    id: paymentId,
    order_id: orderId,
    amount,
    status: 'unpaid',
    created_at: now,
    updated_at: now,
  })
  return { clientSecret: paymentId, error: null }
}

export async function confirmPayment(paymentIntentId: string) {
  // Look up the payment by ID in the mock database
  const payment = mockPayments.find(p => p.id === paymentIntentId)
  if (!payment) {
    return { success: false, orderId: null, error: 'Payment not found' }
  }
  // Mark as paid and update timestamps
  payment.status = 'paid'
  payment.updated_at = new Date().toISOString()
  const orderId = payment.order_id
  // Update the corresponding order payment_status and status
  const order = mockOrders.find(o => o.id === orderId)
  if (order) {
    order.payment_status = 'paid'
    // Use the existing helper to update order status to processing
    await updateOrderStatus(orderId, 'processing')
  }
  return { success: true, orderId, error: null }
}
