'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Order, OrderItem } from "@/actions/orders" // Import Order and OrderItem types
import Image from "next/image"
import Link from "next/link"

interface CustomerOrderListProps {
  orders: Order[];
}

export default function CustomerOrderList({ orders }: CustomerOrderListProps) {
  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-600 font-sarabun">
          คุณยังไม่มีคำสั่งซื้อใดๆ ในขณะนี้
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-sarabun">คำสั่งซื้อ #{order.id.substring(0, 8).toUpperCase()}</CardTitle>
              <p className="text-sm text-gray-500 font-sarabun">
                วันที่: {new Date(order.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            <Badge
              variant={
                order.status === 'completed'
                  ? 'secondary'
                  : order.status === 'cancelled'
                    ? 'destructive'
                    : 'default'
              }
              className="font-sarabun"
            >
              {order.status === 'pending' && 'รอดำเนินการ'}
              {order.status === 'processing' && 'กำลังดำเนินการ'}
              {order.status === 'completed' && 'สำเร็จ'}
              {order.status === 'cancelled' && 'ยกเลิก'}
            </Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sarabun">สินค้า</TableHead>
                  <TableHead className="font-sarabun">จำนวน</TableHead>
                  <TableHead className="font-sarabun">ราคาต่อหน่วย</TableHead>
                  <TableHead className="font-sarabun">รวม</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items?.map((item: OrderItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center gap-2">
                      {item.product_image_url ? (
                        <Image
                          src={item.product_image_url || "/placeholder.svg"}
                          alt={item.product_name || ''}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Image</div>
                      )}
                      <Link href={`/products/${item.product_slug}`} className="font-medium hover:underline font-sarabun">
                        {item.product_name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-sarabun">{item.quantity}</TableCell>
                    <TableCell className="font-sarabun">฿{(item.price_at_purchase ?? 0).toLocaleString()}</TableCell>
                    <TableCell className="font-sarabun">฿{(item.quantity * (item.price_at_purchase ?? 0)).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-right font-bold text-lg font-sarabun">
              ยอดรวม: ฿{order.total_amount.toLocaleString()}
            </div>
            <div className="mt-2 text-right text-sm text-gray-600 font-sarabun">
              สถานะการชำระเงิน:{" "}
              <Badge
                variant={
                  order.payment_status === 'paid'
                    ? 'secondary'
                    : order.payment_status === 'refunded'
                      ? 'destructive'
                      : 'default'
                }
              >
                {order.payment_status === 'unpaid' && 'ยังไม่ชำระ'}
                {order.payment_status === 'paid' && 'ชำระแล้ว'}
                {order.payment_status === 'refunded' && 'คืนเงินแล้ว'}
              </Badge>
            </div>
            <div className="mt-2 text-right text-sm text-gray-600 font-sarabun">
              ที่อยู่จัดส่ง: {order.shipping_address?.name}, {order.shipping_address?.address_line1}, {order.shipping_address?.city}, {order.shipping_address?.zip_code}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
