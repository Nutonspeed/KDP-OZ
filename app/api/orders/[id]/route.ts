import { NextResponse } from 'next/server'
import { fetchOrderById, updateOrder } from '@/actions/orders'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { order } = await fetchOrderById(params.id)
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ order })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const result = await updateOrder(params.id, data)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}

