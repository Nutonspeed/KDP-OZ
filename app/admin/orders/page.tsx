"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Eye, Edit, Trash2 } from 'lucide-react'
import { useAuthStore } from "@/lib/store"
import { fetchOrders, updateOrder, deleteOrder, Order, OrderItem, createInvoiceForOrder } from "@/actions/orders"
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function AdminOrders() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<Order['status'] | ''>('')

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, loading])

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      if (isAuthenticated) {
        const { orders: fetchedOrders } = await fetchOrders()
        setOrders(fetchedOrders)
      }
      setLoading(false)
    }
    loadOrders()
  }, [isAuthenticated])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
        <p className="font-sarabun">กำลังโหลด...</p>
      </div>
    )
  }

  const handleView = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsEditDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      const result = await updateOrder(selectedOrder.id, { status: newStatus })
      if (result.success) {
        const { orders: fetchedOrders } = await fetchOrders()
        setOrders(fetchedOrders)
        setIsEditDialogOpen(false)
        setSelectedOrder(null)
        setNewStatus('')
      } else {
        alert(`Failed to update order status: ${result.error}`)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบคำสั่งซื้อนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้")) {
      const result = await deleteOrder(id)
      if (result.success) {
        const { orders: fetchedOrders } = await fetchOrders()
        setOrders(fetchedOrders)
      } else {
        alert(`Failed to delete order: ${result.error}`)
      }
    }
  }

  const handleGenerateInvoice = async (id: string) => {
    const result = await createInvoiceForOrder(id)
    if (result.success) {
      const { orders: fetchedOrders } = await fetchOrders()
      setOrders(fetchedOrders)
      alert('สร้างใบแจ้งหนี้เรียบร้อย')
    } else {
      alert(result.error)
    }
  }

  // Export the current list of orders to a CSV file.  Only top-level
  // fields are included; order items and shipping details are omitted for
  // simplicity.  The CSV file will download automatically when this
  // function is invoked.
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) {
      alert('ไม่มีคำสั่งซื้อสำหรับส่งออก');
      return
    }
    const headers = ['id', 'user_id', 'total_amount', 'status', 'payment_status', 'created_at']
    const lines = orders.map((o) => [
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.payment_status,
      o.created_at,
    ])
    const csv = [headers.join(','), ...lines.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'orders.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'default'
      case 'processing':
        return 'secondary'
      case 'completed':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sarabun">จัดการคำสั่งซื้อ</h1>
            <p className="text-gray-600 font-sarabun">ดูและจัดการคำสั่งซื้อของลูกค้า</p>
          </div>
          {/* Export CSV button */}
          <Button variant="outline" onClick={handleExportCSV} className="font-sarabun">
            ส่งออก CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">รายการคำสั่งซื้อ</CardTitle>
            <CardDescription className="font-sarabun">จำนวนคำสั่งซื้อทั้งหมด: {orders.length} รายการ</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sarabun">รหัสคำสั่งซื้อ</TableHead>
                  <TableHead className="font-sarabun">วันที่</TableHead>
                  <TableHead className="font-sarabun">ผู้ใช้</TableHead>
                  <TableHead className="font-sarabun">ยอดรวม</TableHead>
                  <TableHead className="font-sarabun">สถานะ</TableHead>
                  <TableHead className="font-sarabun">สถานะชำระเงิน</TableHead>
                  <TableHead className="font-sarabun">ใบแจ้งหนี้</TableHead>
                  <TableHead className="font-sarabun">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium font-sarabun">{order.id.substring(0, 8)}...</TableCell>
                    <TableCell className="font-sarabun">{format(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: th })}</TableCell>
                    <TableCell className="font-sarabun">{order.user_id.substring(0, 8)}...</TableCell>
                    <TableCell className="font-sarabun">฿{order.total_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="font-sarabun">
                        {order.status === 'pending' && 'รอดำเนินการ'}
                        {order.status === 'processing' && 'กำลังดำเนินการ'}
                        {order.status === 'completed' && 'สำเร็จ'}
                        {order.status === 'cancelled' && 'ยกเลิก'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-sarabun">
                      <Badge variant={order.payment_status === 'paid' ? 'secondary' : 'default'} className="font-sarabun">
                        {order.payment_status === 'paid' && 'ชำระแล้ว'}
                        {order.payment_status === 'unpaid' && 'ยังไม่ชำระ'}
                        {order.payment_status === 'refunded' && 'คืนเงินแล้ว'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-sarabun">
                      {order.invoice_url ? (
                        <a href={order.invoice_url} target="_blank" className="underline">เปิด</a>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleGenerateInvoice(order.id)}>
                          สร้าง
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(order)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditStatus(order)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(order.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="font-sarabun">รายละเอียดคำสั่งซื้อ #{selectedOrder?.id.substring(0, 8)}...</DialogTitle>
              <DialogDescription className="font-sarabun">ข้อมูลทั้งหมดเกี่ยวกับคำสั่งซื้อนี้</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sarabun">
                <div>
                  <h3 className="font-bold mb-2">ข้อมูลคำสั่งซื้อ</h3>
                  <p><strong>รหัส:</strong> {selectedOrder.id}</p>
                  <p><strong>วันที่:</strong> {format(new Date(selectedOrder.created_at), 'dd MMM yyyy HH:mm', { locale: th })}</p>
                  <p><strong>ผู้ใช้ ID:</strong> {selectedOrder.user_id}</p>
                  <p><strong>ยอดรวม:</strong> ฿{selectedOrder.total_amount.toLocaleString()}</p>
                  <p><strong>สถานะ:</strong> <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                  <p><strong>สถานะชำระเงิน:</strong> <Badge variant={selectedOrder.payment_status === 'paid' ? 'secondary' : 'default'}>{selectedOrder.payment_status}</Badge></p>
                  {selectedOrder.invoice_url && (
                    <p>
                      <strong>ใบแจ้งหนี้:</strong>{' '}
                      <a href={selectedOrder.invoice_url} target="_blank" className="underline">
                        เปิด
                      </a>
                    </p>
                  )}
                  {selectedOrder.notes && <p><strong>หมายเหตุ:</strong> {selectedOrder.notes}</p>}
                </div>
                <div>
                  <h3 className="font-bold mb-2">ที่อยู่จัดส่ง</h3>
                  <p>{selectedOrder.shipping_address?.name}</p>
                  <p>{selectedOrder.shipping_address?.address_line1}</p>
                  {selectedOrder.shipping_address?.address_line2 && <p>{selectedOrder.shipping_address.address_line2}</p>}
                  <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zip_code}</p>
                  <p>{selectedOrder.shipping_address?.country}</p>
                  <p>โทร: {selectedOrder.shipping_address?.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-bold mb-2">รายการสินค้า</h3>
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>สินค้า</TableHead>
                          <TableHead>จำนวน</TableHead>
                          <TableHead>ราคาต่อหน่วย</TableHead>
                          <TableHead>รวม</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.order_items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>฿{(item.price_at_purchase ?? 0).toLocaleString()}</TableCell>
                            <TableCell>฿{(item.quantity * (item.price_at_purchase ?? 0)).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>ไม่มีรายการสินค้าในคำสั่งซื้อนี้</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sarabun">แก้ไขสถานะคำสั่งซื้อ #{selectedOrder?.id.substring(0, 8)}...</DialogTitle>
              <DialogDescription className="font-sarabun">เลือกสถานะใหม่สำหรับคำสั่งซื้อนี้</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status" className="font-sarabun">สถานะ</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(value: Order['status']) => setNewStatus(value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">รอดำเนินการ</SelectItem>
                      <SelectItem value="processing">กำลังดำเนินการ</SelectItem>
                      <SelectItem value="completed">สำเร็จ</SelectItem>
                      <SelectItem value="cancelled">ยกเลิก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={handleUpdateStatus}>บันทึก</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
