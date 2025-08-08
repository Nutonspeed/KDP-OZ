'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'

export interface RealtimeOrder {
  id: string
  total_amount: number
  created_at: string
}

export function useRealtimeOrders() {
  const [orders, setOrders] = useState<RealtimeOrder[]>([])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    const channel = (supabase as any)
      .channel('orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload: { new: RealtimeOrder }) => {
          setOrders((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      if (supabase && 'removeChannel' in supabase) {
        ;(supabase as any).removeChannel(channel)
      }
    }
  }, [])

  return orders
}

