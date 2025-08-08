'use server'

import { mockLeads, Lead } from '@/lib/mockDb'

export async function fetchLeads(): Promise<Lead[]> {
  return mockLeads
}

type ActionResult = { success: boolean; error?: string }

export async function addLead(formData: FormData): Promise<ActionResult> {
  try {
    // Extract values from FormData. Fallback to empty strings if undefined.
    const email = (formData.get('email') as string) ?? ''
    const name = (formData.get('customer_name') as string) ?? ''
    const phone = (formData.get('phone') as string) ?? ''
    const interest = (formData.get('product_interest') as string) ?? ''
    const company = (formData.get('company') as string) ?? ''
    const size = (formData.get('size') as string) ?? ''
    const quantity = (formData.get('quantity') as string) ?? ''
    const address = (formData.get('address') as string) ?? ''
    const now = new Date().toISOString()
    const newLead: Lead = {
      id: (mockLeads.length + 1).toString(),
      email,
      customer_name: name,
      phone,
      product_interest: interest,
      status: 'รอติดต่อ',
      created_at: now,
      updated_at: now,
      notes: [],
      company,
      size,
      quantity,
      address,
    }
    mockLeads.push(newLead)
    return { success: true }
  } catch (err) {
    return { success: false, error: 'Failed to add lead' }
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const idx = mockLeads.findIndex(l => l.id === id)
  if (idx >= 0) {
    mockLeads.splice(idx, 1)
    return { success: true }
  }
  return { success: false, error: 'Lead not found' }
}

export async function fetchLeadCount(): Promise<number> {
  return mockLeads.length
}

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  const lead = mockLeads.find(l => l.id === id)
  if (!lead) {
    return { success: false, error: 'Lead not found' }
  }
  lead.status = status as any
  lead.updated_at = new Date().toISOString()
  return { success: true }
}

export async function addNoteToLead(id: string, note: string): Promise<ActionResult> {
  const lead = mockLeads.find(l => l.id === id)
  if (!lead) {
    return { success: false, error: 'Lead not found' }
  }
  if (!lead.notes) lead.notes = []
  lead.notes.push(note)
  lead.updated_at = new Date().toISOString()
  return { success: true }
}
