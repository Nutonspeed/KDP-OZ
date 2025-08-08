import { NextResponse } from 'next/server'
import { fetchOrders } from '@/actions/orders'

export async function GET() {
  const { orders } = await fetchOrders()
  return NextResponse.json({ orders })
}

