'use server'

import { mockOrders } from '@/lib/mock/orders'
import { mockUsers } from '@/lib/mock/users'

export interface SalesSummaryPoint {
  date: string;
  total: number;
}

export interface CountPoint {
  date: string;
  count: number;
}

export async function getWeeklySalesSummary() {
  const summary = mockOrders.map(o => ({ date: o.created_at.split('T')[0], total: o.total_amount }))
  return { summary, error: null }
}

export async function getUserGrowthTrend() {
  const trend = mockUsers.map(u => ({ date: u.created_at.split('T')[0], count: 1 }))
  return { trend, error: null }
}

export async function getDailyOrderCounts() {
  const counts = mockOrders.map(o => ({ date: o.created_at.split('T')[0], count: 1 }))
  return { counts, error: null }
}
