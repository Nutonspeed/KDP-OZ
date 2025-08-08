import { NextResponse } from 'next/server'
import { fetchOrderById, updateOrder } from '@/actions/orders'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: Request, context: Context) {
  const { id } = await context.params
  const { order } = await fetchOrderById(id)
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ order })
}

export async function PATCH(req: Request, context: Context) {
  const { id } = await context.params
  const data = await req.json()
  const result = await updateOrder(id, data)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}

