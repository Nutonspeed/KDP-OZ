import {
  createUser,
  fetchUserCount,
  fetchUserById,
  updateUser,
  deleteUser as deleteUserAction,
} from '@/actions/users'
import { GET as listUsersApi, POST as createUserApi } from '@/app/api/users/route'
import { GET as getUserApi, PATCH as patchUserApi, DELETE as deleteUserApi } from '@/app/api/users/[id]/route'
import { NextRequest } from 'next/server'

describe('users actions', () => {
  test('createUser increases count', async () => {
    const initial = await fetchUserCount()
    const result = await createUser({ email: 'new@example.com', password: 'secret123', role: 'viewer' })
    expect(result.success).toBe(true)
    const after = await fetchUserCount()
    expect(after.count).toBe(initial.count + 1)
  })

  test('update and delete user', async () => {
    const { user } = await createUser({ email: 'upd@example.com', password: 'secret123', role: 'viewer' })
    const upd = await updateUser(user!.id, { user_metadata: { role: 'admin' } })
    expect(upd.success).toBe(true)
    const fetched = await fetchUserById(user!.id)
    expect(fetched.user?.user_metadata.role).toBe('admin')
    const del = await deleteUserAction(user!.id)
    expect(del.success).toBe(true)
  })

  test('API routes create, update, and delete user', async () => {
    const postReq = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'api@example.com', password: 'secret123', role: 'viewer' }),
      headers: { 'Content-Type': 'application/json' },
    })
    let res = await createUserApi(postReq)
    expect(res.status).toBe(200)

    const listRes = await listUsersApi(new NextRequest('http://localhost/api/users'))
    const listData: any = await listRes.json()
    const user = listData.users.find((u: any) => u.email === 'api@example.com')
    expect(user).toBeTruthy()

    const patchReq = new NextRequest(`http://localhost/api/users/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: 'admin' }),
      headers: { 'Content-Type': 'application/json' },
    })
    res = await patchUserApi(patchReq, { params: { id: user.id } })
    expect(res.status).toBe(200)

    const singleRes = await getUserApi(new NextRequest(`http://localhost/api/users/${user.id}`), {
      params: { id: user.id },
    })
    const singleData: any = await singleRes.json()
    expect(singleData.user.user_metadata.role).toBe('admin')

    const delRes = await deleteUserApi(
      new NextRequest(`http://localhost/api/users/${user.id}`, { method: 'DELETE' }),
      { params: { id: user.id } },
    )
    expect(delRes.status).toBe(200)
  })
})
