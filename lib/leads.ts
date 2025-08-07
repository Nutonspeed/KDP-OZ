import { sql } from './db'
import { mockLeads } from './mockData'

export interface Lead {
  id: string
  customerName: string
  company?: string
  phone?: string
  email?: string
  address?: string
  productInterest?: string
  size?: string
  quantity?: string
  status?: string
  notes?: string[]
  createdAt: string
  updatedAt: string
}

const hasDb = !!sql

export async function getLeads(): Promise<Lead[]> {
  if (hasDb && sql) {
    const result = await sql<Lead[]>`
      SELECT id,
             customer_name   as "customerName",
             company,
             phone,
             email,
             address,
             product_interest as "productInterest",
             size,
             quantity,
             status,
             notes,
             created_at       as "createdAt",
             updated_at       as "updatedAt"
      FROM leads
      ORDER BY created_at DESC`
    return result
  }
  return mockLeads
}

export type LeadInput = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>

export async function addLead(lead: LeadInput): Promise<Lead> {
  if (hasDb && sql) {
    const result = await sql<Lead[]>`
      INSERT INTO leads (
        customer_name,
        company,
        phone,
        email,
        address,
        product_interest,
        size,
        quantity,
        status,
        notes
      ) VALUES (
        ${lead.customerName},
        ${lead.company ?? null},
        ${lead.phone ?? null},
        ${lead.email ?? null},
        ${lead.address ?? null},
        ${lead.productInterest ?? null},
        ${lead.size ?? null},
        ${lead.quantity ?? null},
        ${lead.status ?? null},
        ${JSON.stringify(lead.notes ?? [])}
      ) RETURNING id,
                customer_name   as "customerName",
                company,
                phone,
                email,
                address,
                product_interest as "productInterest",
                size,
                quantity,
                status,
                notes,
                created_at       as "createdAt",
                updated_at       as "updatedAt"`
    return result[0]
  }
  const newLead: Lead = {
    id: (mockLeads.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
    ...lead,
  }
  mockLeads.push(newLead)
  return newLead
}
