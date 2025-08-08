'use server'

import { cookies } from 'next/headers'

const AUTH_EMAIL = 'admin@example.com'
const AUTH_PASSWORD = 'password123'

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}) {
  if (email === AUTH_EMAIL && password === AUTH_PASSWORD) {
    cookies().set('session', 'authenticated', { httpOnly: true })
    return { id: '1', email }
  }
  return null
}

export async function signOut() {
  cookies().delete('session')
}

export async function getSession() {
  const session = cookies().get('session')
  if (session?.value === 'authenticated') {
    return { user: { id: '1', email: AUTH_EMAIL } }
  }
  return null
}
