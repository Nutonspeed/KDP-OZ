export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product_name?: string
  price_at_purchase?: number
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  payment_status: 'paid' | 'unpaid' | 'refunded'
  created_at: string
  notes?: string
  shipping_address?: {
    name: string
    address_line1: string
    address_line2?: string
    city: string
    state: string
    zip_code: string
    country?: string
    phone?: string
  }
  order_items?: OrderItem[]
  invoice_url?: string
  invoice_id?: string
}
