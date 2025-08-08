'use server'

import { mockDb } from '@/lib/mockDb'
import { User } from '@/lib/mock/users'

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

export async function updateUserRole(id: string, role: string): Promise<ActionResult<{ user: User | null }>> {
  const user = mockDb.users.find(u => u.id === id) || null
  if (user) {
    user.role = role
    return { success: true, user }
  }
  return { success: false, user: null, error: 'User not found' }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const idx = mockDb.users.findIndex(u => u.id === id)
  if (idx !== -1) {
    mockDb.users.splice(idx, 1)
    return { success: true }
  }
  return { success: false, error: 'User not found' }
}

export async function createUser(data: { email: string; password: string; role: string }): Promise<ActionResult<{ user: User }>> {
  const newUser: User = {
    id: String(mockDb.users.length + 1),
    email: data.email,
    password: data.password,
    role: data.role as any,
    created_at: new Date().toISOString(),
  }
  mockDb.users.push(newUser)
  return { success: true, user: newUser }
}

export async function updateUser(
  id: string,
  updates: { email?: string; password?: string; user_metadata?: { role: string } },
): Promise<ActionResult<{ user: User | null }>> {
  const user = mockDb.users.find(u => u.id === id) || null
  if (user) {
    Object.assign(user, updates)
    if (updates.user_metadata?.role) user.role = updates.user_metadata.role as any
    return { success: true, user }
  }
  return { success: false, user: null, error: 'User not found' }
}
