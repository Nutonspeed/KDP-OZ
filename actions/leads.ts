'use server'

import { mockLeads } from '@/lib/mock/leads'

export async function fetchLeads() {
  return mockLeads
}

export async function addLead(formData: FormData) {
  return { success: true }
}

export async function deleteLead(id: string) {
  return { success: true }
}

export async function fetchLeadCount(): Promise<number> {
  return mockLeads.length
}

export async function updateLeadStatus(id: string, status: string) {
  return { success: true }
}

export async function addNoteToLead(id: string, note: string) {
  return { success: true }
}
