'use server'

import { mockDb } from '@/lib/mockDb'
import { updateOrderStatus } from './orders'

export async function createPaymentIntent(amount: number, orderId: string) {
  const id = `pi_${mockDb.payments.length + 1}`
  mockDb.payments.push({ id, order_id: orderId, amount, status: 'pending', created_at: new Date().toISOString() })
  return { clientSecret: id, error: null }
}

export async function confirmPayment(paymentIntentId: string) {
  const payment = mockDb.payments.find(p => p.id === paymentIntentId)
  if (!payment) {
    return { success: false, orderId: null, error: 'Payment not found' }
  }
  payment.status = 'succeeded'
  const order = mockDb.orders.find(o => o.id === payment.order_id)
  if (order) {
    order.payment_status = 'paid'
    await updateOrderStatus(order.id, 'processing')
  }
  return { success: true, orderId: payment.order_id, error: null }
}
