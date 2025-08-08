import { fetchOrderById } from '@/actions/orders'
import { mockDb } from '@/lib/mockDb'
import { notFound } from 'next/navigation'

interface OrderPageProps {
  searchParams: { id?: string }
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const id = searchParams?.id
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">No order ID provided</div>
      </div>
    )
  }
  const { order } = await fetchOrderById(id)
  if (!order) notFound()
  const items = order.order_items?.map((item) => {
    const product = mockDb.products.find((p) => p.id === item.product_id)
    return { ...item, product }
  })
  const shipping = mockDb.shipping.find((s) => s.order_id === id)
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-bold font-sarabun">รายละเอียดคำสั่งซื้อ</h1>
        <div className="space-y-2 font-sarabun">
          <p>รหัสคำสั่งซื้อ: {order.id}</p>
          <p>สถานะคำสั่งซื้อ: {order.status}</p>
          <p>สถานะการชำระเงิน: {order.payment_status}</p>
          {shipping && <p>สถานะการจัดส่ง: {shipping.status}</p>}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 font-sarabun">รายการสินค้า</h2>
          <ul className="space-y-1">
            {items?.map((item) => (
              <li key={item.id} className="font-sarabun">
                {item.quantity} x {item.product?.name || item.product_id} - ฿{item.price_at_purchase.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
