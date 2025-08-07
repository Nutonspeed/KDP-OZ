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

export const leadUpdateSchema = leadInputSchema.partial()

export interface LeadFilter {
  email?: string
  status?: string
  search?: string
}

export async function getLeads(filter: LeadFilter = {}): Promise<Lead[]> {
  if (hasDb && sql) {
    const like = filter.search ? `%${filter.search}%` : null
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
      ${filter.email || filter.status || filter.search ? sql`WHERE` : sql``}
      ${filter.email ? sql`email = ${filter.email}` : sql``}
      ${filter.email && (filter.status || filter.search) ? sql`AND` : sql``}
      ${filter.status ? sql`status = ${filter.status}` : sql``}
      ${(filter.status && filter.search) || (filter.email && filter.search) ? sql`AND` : sql``}
      ${filter.search
        ? sql`(customer_name ILIKE ${like} OR company ILIKE ${like} OR email ILIKE ${like})`
        : sql``}
      ORDER BY created_at DESC`
    return result
  }

  let leads = mockLeads
  if (filter.email) {
    leads = leads.filter((l) => l.email === filter.email)
  }
  if (filter.status) {
    leads = leads.filter((l) => l.status === filter.status)
  }
  if (filter.search) {
    const s = filter.search.toLowerCase()
    leads = leads.filter(
      (l) =>
        l.customerName.toLowerCase().includes(s) ||
        (l.company?.toLowerCase().includes(s) ?? false) ||
        (l.email?.toLowerCase().includes(s) ?? false),
    )
  }
  return leads
}

export type LeadInput = z.infer<typeof leadInputSchema>
export type LeadUpdate = z.infer<typeof leadUpdateSchema>

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

export async function getLead(id: string): Promise<Lead | null> {
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
      WHERE id = ${id}
      LIMIT 1`
    return result[0] ?? null
  }
  return mockLeads.find((l) => l.id === id) ?? null
}

export async function updateLead(
  id: string,
  update: LeadUpdate
): Promise<Lead | null> {
  const data = leadUpdateSchema.parse(update)
  if (hasDb && sql) {
    const result = await sql<Lead[]>`
      UPDATE leads SET
        customer_name   = COALESCE(${data.customerName}, customer_name),
        company         = COALESCE(${data.company}, company),
        phone           = COALESCE(${data.phone}, phone),
        email           = COALESCE(${data.email}, email),
        address         = COALESCE(${data.address}, address),
        product_interest= COALESCE(${data.productInterest}, product_interest),
        size            = COALESCE(${data.size}, size),
        quantity        = COALESCE(${data.quantity}, quantity),
        status          = COALESCE(${data.status}, status),
        notes           = COALESCE(${data.notes ? JSON.stringify(data.notes) : null}, notes),
        updated_at      = NOW()
      WHERE id = ${id}
      RETURNING id,
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
    return result[0] ?? null
  }
  const index = mockLeads.findIndex((l) => l.id === id)
  if (index === -1) return null
  const updated: Lead = {
    ...mockLeads[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  mockLeads[index] = updated
  return updated
}

export async function deleteLead(id: string): Promise<boolean> {
  if (hasDb && sql) {
    const result = await sql<{ id: string }[]>`
      DELETE FROM leads WHERE id = ${id} RETURNING id`
    return result.length > 0
  }
  const index = mockLeads.findIndex((l) => l.id === id)
  if (index === -1) return false
  mockLeads.splice(index, 1)
  return true
}
