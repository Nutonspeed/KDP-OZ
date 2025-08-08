import { mockProducts } from './mock/products'
import { mockOrders, MockOrder } from './mock/orders'
import { mockUsers, User } from './mock/users'
import { mockLeads, Lead } from './mock/leads'
import { Product } from '@/types/product'

export interface Payment {
  id: string
  order_id: string
  amount: number
  status: 'pending' | 'succeeded' | 'failed'
  method?: string
  created_at: string
}

export interface ShippingInfo {
  order_id: string
  status: string
  tracking_number?: string
  updated_at: string
}

export interface MockDb {
  products: Product[]
  orders: MockOrder[]
  users: User[]
  leads: Lead[]
  payments: Payment[]
  shipping: ShippingInfo[]
  analytics: {
    totalSales: number
    totalUsers: number
    totalOrders: number
  }
  content: {
    about: { title: string; body: string }
  }
}

export const mockDb: MockDb = {
  products: mockProducts,
  orders: mockOrders,
  users: mockUsers,
  leads: mockLeads,
  payments: [],
  shipping: [],
  analytics: {
    totalSales: mockOrders.reduce((sum, o) => sum + o.total_amount, 0),
    totalUsers: mockUsers.length,
    totalOrders: mockOrders.length,
  },
  content: {
    about: {
      title: 'About Our Store (Mock)',
      body: 'This content is served from the mock database. Swap with real data in production.',
    },
  },
}
