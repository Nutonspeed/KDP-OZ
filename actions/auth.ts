'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    return null
  }
  return {
    id: data.user.id,
    email: data.user.email ?? '',
    role: data.user.user_metadata?.role,
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
}

export async function getSession() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}
