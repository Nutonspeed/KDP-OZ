'use server'

import { mockUsers, User } from '@/lib/mock/users'

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

type ActionResult<T = {}> = { success: boolean; error?: string } & T

export async function updateUserRole(): Promise<ActionResult<{ user: User | null }>> {
  return { success: true, user: null }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  return { success: true }
}

export async function createUser(data: { email: string; password: string; role: string }): Promise<ActionResult<{ user: User }>> {
  return { success: true, user: mockUsers[0] }
}

export async function updateUser(id: string, updates: { email?: string; password?: string; user_metadata?: { role: string } }): Promise<ActionResult<{ user: User }>> {
  return { success: true, user: mockUsers[0] }
}
