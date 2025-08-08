// This module defines a unified in-memory mock database used across the
// application for testing purposes. It consolidates previously separate
// mock modules (orders, products, users, leads) into a single source of
// truth. Additional structures for payments and shipping are provided so
// that actions can operate on a consistent data store. When integrating
// a real backend, this file can be swapped for calls to a database.

import { Product } from '@/types/product'
import type { Coupon } from '@/types/coupon'

// Types reproduced from the original mock modules for consistency.
export interface MockOrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product_name?: string
  price_at_purchase?: number
}

export interface MockOrder {
  id: string
  user_id: string
  total_amount: number
  status: string
  payment_status: 'paid' | 'unpaid' | 'refunded'
  created_at: string
  order_items?: MockOrderItem[]
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
}

export interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  role: string | null
  app_metadata: Record<string, any>
  user_metadata: { role?: string; [key: string]: any }
}

export interface Lead {
  id: string
  email: string
  customer_name: string
  phone: string
  product_interest: string
  status: 'รอติดต่อ' | 'กำลังเจรจา' | 'ปิดการขาย'
  created_at: string
  updated_at: string
  notes?: string[]
  company?: string
  size?: string
  quantity?: string
  address?: string
}

// Additional structures for payment and shipping tracking.
export interface Payment {
  id: string
  order_id: string
  amount: number
  status: 'unpaid' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

export interface Shipping {
  id: string
  order_id: string
  status: 'processing' | 'shipped' | 'delivered' | 'canceled'
  tracking_number?: string
  updated_at: string
}

// Seed data ported from the original mock modules. These examples are
// intentionally simple to make the flow easy to test. Feel free to
// extend these arrays with more realistic data as needed.

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mock Product A',
    slug: 'mock-product-a',
    description: 'Mock product A description',
    type: 'A',
    material: 'Aluminum',
    sizes: ['1/2', '3/4'],
    base_price: 100,
    category: 'Standard',
    image_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 10,
    // Additional mock fields for extended product features
    tags: ['featured', 'new'],
    discount_price: 80,
    sale_start_date: new Date().toISOString(),
    sale_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Mock Product B',
    slug: 'mock-product-b',
    description: 'Mock product B description',
    type: 'B',
    material: 'Steel',
    sizes: ['1'],
    base_price: 200,
    category: 'Standard',
    image_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 5,
    // Additional mock fields for extended product features
    tags: ['sale', 'popular'],
    discount_price: 150,
    sale_start_date: new Date().toISOString(),
    sale_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockOrders: MockOrder[] = [
  {
    id: '1',
    user_id: '1',
    total_amount: 300,
    status: 'pending',
    payment_status: 'unpaid',
    created_at: new Date().toISOString(),
    order_items: [
      {
        id: '1',
        product_id: '1',
        quantity: 1,
        price: 100,
        product_name: 'Mock Product A',
        price_at_purchase: 100,
      },
      {
        id: '2',
        product_id: '2',
        quantity: 1,
        price: 200,
        product_name: 'Mock Product B',
        price_at_purchase: 200,
      },
    ],
    notes: '',
    shipping_address: {
      name: 'Mock Customer',
      address_line1: '123 Mock St',
      city: 'Bangkok',
      state: '',
      zip_code: '10000',
      country: 'TH',
      phone: '000-0000',
    },
  },
]

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@example.com',
    created_at: new Date().toISOString(),
    last_sign_in_at: null,
    email_confirmed_at: null,
    role: 'authenticated',
    app_metadata: {},
    user_metadata: { role: 'admin', segment: 'returning' },
  },
  {
    id: '2',
    email: 'bob@example.com',
    created_at: new Date().toISOString(),
    last_sign_in_at: null,
    email_confirmed_at: null,
    role: 'authenticated',
    app_metadata: {},
    user_metadata: { role: 'viewer', segment: 'new' },
  },
]

export const mockLeads: Lead[] = [
  {
    id: '1',
    email: 'lead@example.com',
    customer_name: 'Mock Lead',
    phone: '000-0000',
    product_interest: 'Mock Product',
    status: 'รอติดต่อ',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: [],
    company: 'Mock Company',
    size: '',
    quantity: '',
  },
]

// Payments start empty; entries are added when orders are created and payments initiated.
export const mockPayments: Payment[] = []

// Shipping entries track the shipping status of orders. They start empty.
export const mockShippings: Shipping[] = []

// A simple analytics container. Real analytics should be computed on the fly.
export const mockAnalytics: Record<string, any> = {}

/**
 * A collection of discount coupons that can be applied during checkout. Each coupon
 * includes metadata such as usage limits and validity dates. When integrating a real
 * backend, replace this with a persistent store.
 */
export const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'SAVE10',
    description: 'Save 10% on your order',
    discount_percentage: 0.1,
    valid_from: new Date().toISOString(),
    valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    max_uses: 100,
    use_count: 0,
    min_order_value: 0,
  },
  {
    id: '2',
    code: 'FREESHIP',
    description: 'Free shipping on orders over $200',
    discount_amount: 50,
    valid_from: new Date().toISOString(),
    valid_to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    max_uses: 50,
    use_count: 0,
    min_order_value: 200,
  },
]
