'use server'

import { mockDb } from '@/lib/mockDb'
import { Lead } from '@/lib/mock/leads'

export async function fetchLeads(): Promise<Lead[]> {
  return mockDb.leads
}

type ActionResult = { success: boolean; error?: string }

export async function addLead(formData: FormData): Promise<ActionResult> {
  const data = Object.fromEntries(formData.entries()) as Record<string, string>
  const newLead: Lead = {
    id: String(mockDb.leads.length + 1),
    customerName: data.name || '',
    company: data.company || '',
    phone: data.phone || '',
    email: data.email || '',
    productInterest: data.productInterest || '',
    size: data.size || '',
    quantity: data.quantity || '',
    status: data.status || 'ใหม่',
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockDb.leads.push(newLead)
  return { success: true }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const idx = mockDb.leads.findIndex(l => l.id === id)
  if (idx !== -1) {
    mockDb.leads.splice(idx, 1)
    return { success: true }
  }
  return { success: false, error: 'Lead not found' }
}

export async function fetchLeadCount(): Promise<number> {
  return mockDb.leads.length
}

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  const lead = mockDb.leads.find(l => l.id === id)
  if (lead) {
    lead.status = status
    return { success: true }
  }
  return { success: false, error: 'Lead not found' }
}

export async function addNoteToLead(id: string, note: string): Promise<ActionResult> {
  const lead = mockDb.leads.find(l => l.id === id)
  if (lead) {
    lead.notes = lead.notes || []
    lead.notes.push(note)
    return { success: true }
  }
  return { success: false, error: 'Lead not found' }
}
