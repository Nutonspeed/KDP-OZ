import { z } from 'zod'
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

export const leadInputSchema = z.object({
  customerName: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  productInterest: z.string().optional(),
  size: z.string().optional(),
  quantity: z.string().optional(),
  status: z.string().optional(),
  notes: z.array(z.string()).optional(),
})

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

export type LeadInput = z.infer<typeof leadInputSchema>

export async function addLead(lead: LeadInput): Promise<Lead> {
  const data = leadInputSchema.parse(lead)
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
        ${data.customerName},
        ${data.company ?? null},
        ${data.phone ?? null},
        ${data.email ?? null},
        ${data.address ?? null},
        ${data.productInterest ?? null},
        ${data.size ?? null},
        ${data.quantity ?? null},
        ${data.status ?? null},
        ${JSON.stringify(data.notes ?? [])}
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
    ...data,
  }
  mockLeads.push(newLead)
  return newLead
}
