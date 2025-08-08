'use server'

import { mockDb, User } from '@/lib/mockDb'

export async function fetchUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; totalCount: number; error: null }> {
  const offset = (page - 1) * limit
  const users = mockDb.users.slice(offset, offset + limit)
  return { users, totalCount: mockDb.users.length, error: null }
}

export async function fetchUserCount() {
  return { count: mockDb.users.length, error: null }
}

export async function fetchRecentUsers(limit: number): Promise<{ users: User[]; error: null }> {
  return { users: mockDb.users.slice(0, limit), error: null }
}

type ActionResult<T = {}> = { success: boolean; error?: string } & T

export async function updateUserRole(): Promise<ActionResult<{ user: User | null }>> {
  return { success: true, user: null }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const index = mockDb.users.findIndex(u => u.id === id)
  if (index === -1) return { success: false, error: 'User not found' }
  mockDb.users.splice(index, 1)
  return { success: true }
}

export async function createUser(data: { email: string; password: string; role: string }): Promise<ActionResult<{ user: User }>> {
  const user: User = {
    id: String(mockDb.users.length + 1),
    email: data.email,
    created_at: new Date().toISOString(),
    last_sign_in_at: null,
    email_confirmed_at: null,
    role: 'authenticated',
    app_metadata: {},
    user_metadata: { role: data.role },
  }
  mockDb.users.push(user)
  return { success: true, user }
}

export async function updateUser(
  id: string,
  updates: { email?: string; password?: string; user_metadata?: { role: string } }
): Promise<ActionResult<{ user: User }>> {
  const user = mockDb.users.find(u => u.id === id)
  if (!user) return { success: false, error: 'User not found' }
  Object.assign(user, updates)
  if (updates.user_metadata) {
    user.user_metadata = { ...user.user_metadata, ...updates.user_metadata }
  }
  return { success: true, user }
}
