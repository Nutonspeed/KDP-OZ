import { NextResponse } from 'next/server'
import { createInvoiceForOrder, fetchOrderById } from '@/actions/orders'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const result = await createInvoiceForOrder(params.id)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { order } = await fetchOrderById(params.id)
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ invoice_url: order.invoice_url })
}

