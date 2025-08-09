
import { mockUsers, User } from '@/lib/mockDb'

export async function fetchUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; totalCount: number; error: null }> {
  const offset = (page - 1) * limit
  const users = mockUsers.slice(offset, offset + limit)
  return { users, totalCount: mockUsers.length, error: null }
}

export async function fetchUserCount() {
  return { count: mockUsers.length, error: null }
}

export async function fetchRecentUsers(limit: number): Promise<{ users: User[]; error: null }> {
  return { users: mockUsers.slice(0, limit), error: null }
}

export async function fetchUserById(id: string): Promise<{ user: User | null; error: null }> {
  const user = mockUsers.find(u => u.id === id) || null
  return { user, error: null }
}

type ActionResult<T = {}> = { success: boolean; error?: string } & T

export async function updateUserRole(): Promise<ActionResult<{ user: User | null }>> {
  // This function is a placeholder. Use updateUser to modify user metadata.
  return { success: true, user: null }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const idx = mockUsers.findIndex(u => u.id === id)
  if (idx >= 0) {
    mockUsers.splice(idx, 1)
    return { success: true }
  }
  return { success: false, error: 'User not found' }
}

export async function createUser(data: { email: string; password: string; role: string }): Promise<ActionResult<{ user: User }>> {
  const newId = (mockUsers.length + 1).toString()
  const now = new Date().toISOString()
  const newUser: User = {
    id: newId,
    email: data.email,
    created_at: now,
    last_sign_in_at: null,
    email_confirmed_at: null,
    role: 'authenticated',
    app_metadata: {},
    user_metadata: { role: data.role },
  }
  mockUsers.push(newUser)
  return { success: true, user: newUser }
}

export async function updateUser(id: string, updates: { email?: string; password?: string; user_metadata?: { role: string } }): Promise<ActionResult<{ user: User | null }>> {
  const idx = mockUsers.findIndex(u => u.id === id)
  if (idx === -1) {
    return { success: false, error: 'User not found', user: null }
  }
  const existing = mockUsers[idx]
  const updated: User = {
    ...existing,
    ...('email' in updates ? { email: updates.email! } : {}),
    user_metadata: updates.user_metadata ? { ...existing.user_metadata, ...updates.user_metadata } : existing.user_metadata,
  }
  mockUsers[idx] = updated
  return { success: true, user: updated }
}
