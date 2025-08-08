'use server'

import { mockDb, Payment } from '@/lib/mockDb'
import { updateOrderStatus } from './orders'

export async function createPaymentIntent(amount: number, orderId: string) {
  const payment: Payment = {
    id: String(mockDb.payments.length + 1),
    orderId,
    amount,
    status: 'pending',
  }
  mockDb.payments.push(payment)
  // In mock flow, clientSecret can just be payment id
  return { clientSecret: payment.id, error: null }
}

export async function confirmPayment(paymentIntentId: string) {
  const payment = mockDb.payments.find(p => p.id === paymentIntentId)
  if (!payment) return { success: false, orderId: null, error: 'Payment not found' }
  payment.status = 'succeeded'
  await updateOrderStatus(payment.orderId, 'processing')
  return { success: true, orderId: payment.orderId, error: null }
}
