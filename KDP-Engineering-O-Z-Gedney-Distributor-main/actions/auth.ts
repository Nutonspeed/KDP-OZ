'use server'

import { createSupabaseServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign-in error:', error.message);
    // You might want to return the error or handle it differently
    // For now, we'll just redirect to login with an error param
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/admin');
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign-out error:', error.message);
  }

  redirect('/admin/login');
}

export async function getSession() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
