'use client'

import { PieChart, Pie, Cell } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export interface SegmentDatum {
  type: string
  count: number
}

interface CustomerSegmentationCardProps {
  data: SegmentDatum[]
}

export default function CustomerSegmentationCard({
  data,
}: CustomerSegmentationCardProps) {
  const config = {
    new: { label: 'New', color: 'hsl(var(--chart-1))' },
    returning: { label: 'Returning', color: 'hsl(var(--chart-2))' },
    unknown: { label: 'Unknown', color: 'hsl(var(--chart-3))' },
  }

  return (
    <ChartContainer config={config} className="mx-auto aspect-square max-h-[300px]">
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="type" innerRadius={60} outerRadius={80}>
          {data.map((entry) => (
            <Cell key={entry.type} fill={`var(--color-${entry.type})`} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  )
}

