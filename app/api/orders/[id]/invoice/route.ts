import { NextResponse } from 'next/server'
import { createInvoiceForOrder, fetchOrderById } from '@/actions/orders'

type Context = { params: Promise<{ id: string }> }

export async function POST(_req: Request, context: Context) {
  const { id } = await context.params
  const result = await createInvoiceForOrder(id)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}

export async function GET(_req: Request, context: Context) {
  const { id } = await context.params
  const { order } = await fetchOrderById(id)
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ invoice_url: order.invoice_url })
}

