'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { RealtimeOrder } from '@/hooks/useRealtimeOrders'

interface RealtimeSalesChartProps {
  orders: RealtimeOrder[]
}

export default function RealtimeSalesChart({ orders }: RealtimeSalesChartProps) {
  const data = useMemo(
    () =>
      orders.map((o) => ({
        time: new Date(o.created_at).toLocaleTimeString(),
        sales: o.total_amount,
      })),
    [orders]
  )

  return (
    <ChartContainer
      config={{
        sales: {
          label: 'Sales',
          color: 'hsl(var(--chart-1))',
        },
      }}
    >
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" dot={false} />
      </LineChart>
    </ChartContainer>
  )
}

