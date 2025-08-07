'use server'

import { mockOrders } from '@/lib/mock/orders'
import { mockUsers } from '@/lib/mock/users'
import { mockProducts } from '@/lib/mock/products'

export interface SalesSummaryPoint {
  date: string
  total: number
}

export interface CountPoint {
  date: string
  count: number
}

export interface TopProduct {
  id: string
  name: string
  totalSold: number
}

function isWithinRange(date: string, start: string, end: string) {
  const d = new Date(date).getTime()
  return d >= new Date(start).getTime() && d <= new Date(end).getTime()
}

export async function getSalesSummaryRange(start: string, end: string) {
  const summary = mockOrders
    .filter(o => isWithinRange(o.created_at, start, end))
    .map(o => ({ date: o.created_at.split('T')[0], total: o.total_amount }))
  return { summary, error: null }
}

export async function getUserGrowthTrendRange(start: string, end: string) {
  const trend = mockUsers
    .filter(u => isWithinRange(u.created_at, start, end))
    .map(u => ({ date: u.created_at.split('T')[0], count: 1 }))
  return { trend, error: null }
}

export async function getDailyOrderCountsRange(start: string, end: string) {
  const counts = mockOrders
    .filter(o => isWithinRange(o.created_at, start, end))
    .map(o => ({ date: o.created_at.split('T')[0], count: 1 }))
  return { counts, error: null }
}

export async function getTopProducts(start: string, end: string, limit: number) {
  const totals: Record<string, number> = {}
  mockOrders
    .filter(o => isWithinRange(o.created_at, start, end))
    .forEach(o => {
      o.order_items?.forEach(item => {
        totals[item.product_id] = (totals[item.product_id] || 0) + item.quantity
      })
    })
  const products = Object.entries(totals)
    .map(([id, qty]) => {
      const product = mockProducts.find(p => p.id === id)
      return { id, name: product?.name || 'Unknown', totalSold: qty }
    })
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, limit)
  return { products, error: null }
}
