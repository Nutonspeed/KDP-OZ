'use server'

import { mockUsers } from '@/lib/mock/users'

export async function fetchUsers(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  const users = mockUsers.slice(offset, offset + limit)
  return { users, totalCount: mockUsers.length, error: null }
}

export async function fetchUserCount() {
  return { count: mockUsers.length, error: null }
}

export async function fetchRecentUsers(limit: number) {
  return { users: mockUsers.slice(0, limit), error: null }
}

export async function updateUserRole() {
  return { success: true, user: null }
}

export async function deleteUser() {
  return { success: true }
}

export async function createUser() {
  return { success: true, user: mockUsers[0] }
}

export async function updateUser() {
  return { success: true, user: mockUsers[0] }
}
