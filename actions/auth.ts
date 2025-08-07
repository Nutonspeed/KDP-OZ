'use server'

import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  redirect('/admin')
}

export async function signOut() {
  redirect('/admin/login')
}

export async function getSession() {
  return { user: { id: '1', email: 'mock@example.com' } }
}
