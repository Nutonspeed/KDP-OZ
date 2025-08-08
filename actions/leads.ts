'use server'

import { mockDb, Lead } from '@/lib/mockDb'

export async function fetchLeads(): Promise<Lead[]> {
  return mockDb.leads
}

type ActionResult = { success: boolean; error?: string }

export async function addLead(formData: FormData): Promise<ActionResult> {
  const lead: Lead = {
    id: String(mockDb.leads.length + 1),
    email: formData.get('email') as string,
    customer_name: formData.get('customer_name') as string,
    phone: formData.get('phone') as string,
    product_interest: formData.get('product_interest') as string,
    status: 'รอติดต่อ',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: [],
    company: formData.get('company') as string | undefined,
    size: formData.get('size') as string | undefined,
    quantity: formData.get('quantity') as string | undefined,
    address: formData.get('address') as string | undefined,
  }
  mockDb.leads.push(lead)
  return { success: true }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const index = mockDb.leads.findIndex(l => l.id === id)
  if (index === -1) return { success: false, error: 'Lead not found' }
  mockDb.leads.splice(index, 1)
  return { success: true }
}

export async function fetchLeadCount(): Promise<number> {
  return mockDb.leads.length
}

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  const lead = mockDb.leads.find(l => l.id === id)
  if (!lead) return { success: false, error: 'Lead not found' }
  lead.status = status as Lead['status']
  lead.updated_at = new Date().toISOString()
  return { success: true }
}

export async function addNoteToLead(id: string, note: string): Promise<ActionResult> {
  const lead = mockDb.leads.find(l => l.id === id)
  if (!lead) return { success: false, error: 'Lead not found' }
  lead.notes = [...(lead.notes || []), note]
  lead.updated_at = new Date().toISOString()
  return { success: true }
}
