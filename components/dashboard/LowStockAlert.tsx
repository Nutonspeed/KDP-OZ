'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Product } from '@/types/product'

interface LowStockAlertProps {
  products: Product[]
}

export default function LowStockAlert({ products }: LowStockAlertProps) {
  if (!products.length) return null

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">สินค้าใกล้หมดสต็อก</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-1">
          {products.map((p) => (
            <li key={p.id}>
              {p.name} ({p.stock_quantity} ชิ้น)
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
