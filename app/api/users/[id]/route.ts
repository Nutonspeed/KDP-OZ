import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchUserById, updateUser, deleteUser } from '@/actions/users'

const updateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.string().optional(),
})

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const { user } = await fetchUserById(id)
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ user })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const json = await req.json()
    const parsed = updateSchema.parse(json)
    const { id } = await params
    const result = await updateUser(id, {
      email: parsed.email,
      password: parsed.password,
      user_metadata: parsed.role ? { role: parsed.role } : undefined,
    })
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('User update error', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await deleteUser(id)
  return NextResponse.json(result, { status: result.success ? 200 : 404 })
}
