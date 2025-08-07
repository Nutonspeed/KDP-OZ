'use server'

import { createSupabaseAdminClient } from '@/lib/supabase';

export interface SalesSummaryPoint {
  date: string;
  total: number;
}

export interface CountPoint {
  date: string;
  count: number;
}

function getLastNDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export async function getWeeklySalesSummary(): Promise<{ summary: SalesSummaryPoint[]; error: string | null }> {
  const supabase = createSupabaseAdminClient();
  const dates = getLastNDates(7);
  const startDate = dates[0];
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', `${startDate}T00:00:00`);

    if (error) {
      console.error('Error fetching weekly sales summary:', error.message);
      return { summary: [], error: error.message };
    }

    const summaryMap: Record<string, number> = Object.fromEntries(dates.map((d) => [d, 0]));
    for (const order of orders || []) {
      const day = order.created_at.split('T')[0];
      summaryMap[day] = (summaryMap[day] || 0) + Number(order.total_amount);
    }

    const summary = dates.map((date) => ({ date, total: summaryMap[date] || 0 }));
    return { summary, error: null };
  } catch (err: any) {
    console.error('Unexpected error fetching weekly sales summary:', err.message);
    return { summary: [], error: 'An unexpected error occurred.' };
  }
}

export async function getUserGrowthTrend(): Promise<{ trend: CountPoint[]; error: string | null }> {
  const supabase = createSupabaseAdminClient();
  const dates = getLastNDates(7);
  const startDate = dates[0];
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, created_at')
      .gte('created_at', `${startDate}T00:00:00`);

    if (error) {
      console.error('Error fetching user growth trend:', error.message);
      return { trend: [], error: error.message };
    }

    const countMap: Record<string, number> = Object.fromEntries(dates.map((d) => [d, 0]));
    for (const user of users || []) {
      const day = user.created_at.split('T')[0];
      countMap[day] = (countMap[day] || 0) + 1;
    }

    const trend = dates.map((date) => ({ date, count: countMap[date] || 0 }));
    return { trend, error: null };
  } catch (err: any) {
    console.error('Unexpected error fetching user growth trend:', err.message);
    return { trend: [], error: 'An unexpected error occurred.' };
  }
}

export async function getDailyOrderCounts(): Promise<{ counts: CountPoint[]; error: string | null }> {
  const supabase = createSupabaseAdminClient();
  const dates = getLastNDates(7);
  const startDate = dates[0];
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, created_at')
      .gte('created_at', `${startDate}T00:00:00`);

    if (error) {
      console.error('Error fetching daily order counts:', error.message);
      return { counts: [], error: error.message };
    }

    const countMap: Record<string, number> = Object.fromEntries(dates.map((d) => [d, 0]));
    for (const order of orders || []) {
      const day = order.created_at.split('T')[0];
      countMap[day] = (countMap[day] || 0) + 1;
    }

    const counts = dates.map((date) => ({ date, count: countMap[date] || 0 }));
    return { counts, error: null };
  } catch (err: any) {
    console.error('Unexpected error fetching daily order counts:', err.message);
    return { counts: [], error: 'An unexpected error occurred.' };
  }
}
