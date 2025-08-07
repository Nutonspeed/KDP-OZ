'use server'

import { mockLeads, Lead } from '@/lib/mock/leads'

export async function fetchLeads(): Promise<Lead[]> {
  return mockLeads
}

type ActionResult = { success: boolean; error?: string }

export async function addLead(formData: FormData): Promise<ActionResult> {
  return { success: true }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  return { success: true }
}

export async function fetchLeadCount(): Promise<number> {
  return mockLeads.length
}

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  return { success: true }
}

export async function addNoteToLead(id: string, note: string): Promise<ActionResult> {
  return { success: true }
}
