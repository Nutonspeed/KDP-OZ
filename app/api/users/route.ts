import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchUsers, createUser } from '@/actions/users'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const data = await fetchUsers(page, limit)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = userSchema.parse(json)
    const result = await createUser(parsed)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('User creation error', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
