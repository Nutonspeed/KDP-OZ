import Stripe from 'stripe'

export interface Invoice {
  id: string
  order_id: string
  amount: number
  status: 'draft' | 'open' | 'paid'
  url: string
  created_at: string
}

/**
 * Create an invoice using Stripe if credentials are available. When Stripe is
 * not configured a mock invoice object will be returned. This keeps tests and
 * local development from requiring external network calls.
 */
export async function generateInvoice(orderId: string, amount: number): Promise<Invoice> {
  const createdAt = new Date().toISOString()
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return {
      id: `inv_${Date.now()}`,
      order_id: orderId,
      amount,
      status: 'draft',
      url: `https://example.com/invoices/${orderId}.pdf`,
      created_at: createdAt,
    }
  }

  const stripe = new Stripe(stripeKey)
  // For demonstration purposes a hard coded customer is used. Real
  // implementations should associate a Stripe customer with the order's user.
  const customer = await stripe.customers.create({
    description: `Customer for order ${orderId}`,
  })
  await stripe.invoiceItems.create({
    customer: customer.id,
    amount: Math.round(amount * 100),
    currency: 'thb',
    description: `Order ${orderId}`,
  })
  const invoice = await stripe.invoices.create({
    customer: customer.id,
    auto_advance: true,
    collection_method: 'send_invoice',
  })
  return {
    id: invoice.id || '',
    order_id: orderId,
    amount,
    status: (invoice.status as Invoice['status']) || 'draft',
    url: invoice.hosted_invoice_url || '',
    created_at: new Date((invoice.created || Date.now()) * 1000).toISOString(),
  }
}

