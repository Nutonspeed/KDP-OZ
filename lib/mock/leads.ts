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
