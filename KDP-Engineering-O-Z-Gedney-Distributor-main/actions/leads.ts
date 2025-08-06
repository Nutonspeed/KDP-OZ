'use server'

import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function fetchLeads() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error.message);
    return [];
  }
  return data;
}

export async function addLead(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const email = formData.get('email') as string;

  const { error } = await supabase
    .from('leads')
    .insert({ email });

  if (error) {
    console.error('Error adding lead:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/leads');
  return { success: true };
}

export async function deleteLead(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lead:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/leads');
  return { success: true };
}

// New: Function to fetch lead count
export async function fetchLeadCount(): Promise<number> {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching lead count:', error.message);
    return 0;
  }
  return count || 0;
}

// New: Function to update lead status
export async function updateLeadStatus(id: string, status: string) {
  const supabase = createSupabaseAdminClient(); // Assuming admin privileges needed for status update
  try {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead status:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/leads');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error updating lead status:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

// New: Function to add a note to a lead
export async function addNoteToLead(id: string, note: string) {
  const supabase = createSupabaseAdminClient(); // Assuming admin privileges needed for adding notes
  try {
    const { data: currentLead, error: fetchError } = await supabase
      .from('leads')
      .select('notes') // Assuming a 'notes' column exists in your 'leads' table
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching lead for note:', fetchError.message);
      return { success: false, error: fetchError.message };
    }

    const existingNotes = currentLead?.notes ? `${currentLead.notes}\n` : '';
    const newNotes = `${existingNotes}${new Date().toLocaleString()}: ${note}`;

    const { error } = await supabase
      .from('leads')
      .update({ notes: newNotes })
      .eq('id', id);

    if (error) {
      console.error('Error adding note to lead:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/leads');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error adding note to lead:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
