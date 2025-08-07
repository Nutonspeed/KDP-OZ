'use server'

import { createSupabaseAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function fetchUsers(page: number = 1, limit: number = 10) {
  const supabase = createSupabaseAdminClient();
  const offset = (page - 1) * limit;

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching users:', error.message);
      return { users: [], totalCount: 0, error: error.message };
    }

    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error fetching user count:', countError.message);
      return { users: [], totalCount: 0, error: countError.message };
    }

    return { users: users || [], totalCount: count || 0, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching users:', error.message);
    return { users: [], totalCount: 0, error: 'An unexpected error occurred.' };
  }
}

export async function fetchUserCount() {
  const supabase = createSupabaseAdminClient();
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching user count:', error.message);
      return { count: 0, error: error.message };
    }
    return { count: count || 0, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching user count:', error.message);
    return { count: 0, error: 'An unexpected error occurred.' };
  }
}

export async function fetchRecentUsers(limit: number) {
  const supabase = createSupabaseAdminClient();
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent users:', error.message);
      return { users: [], error: error.message };
    }

    return { users: users || [], error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching recent users:', error.message);
    return { users: [], error: 'An unexpected error occurred.' };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = createSupabaseAdminClient();
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    });

    if (error) {
      console.error('Error updating user role:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Unexpected error updating user role:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteUser(userId: string) {
  const supabase = createSupabaseAdminClient();
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error deleting user:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

// New: Function to create a user
export async function createUser(userData: { email: string; password?: string; role?: string; }) {
  const supabase = createSupabaseAdminClient();
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Automatically confirm email for admin created users
      user_metadata: { role: userData.role || 'user' },
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Unexpected error creating user:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

// New: Function to update a user (general profile updates)
export async function updateUser(userId: string, userData: { email?: string; password?: string; user_metadata?: any; }) {
  const supabase = createSupabaseAdminClient();
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, userData);

    if (error) {
      console.error('Error updating user:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Unexpected error updating user:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
