import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchLeads, addLeadFromJson, searchLeads } from '@/actions/leads'

const leadSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(),
  message: z.string().optional(),
  productInterest: z.array(z.string()).optional(),
})

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const query = {
    name: params.get('name') ?? undefined,
    email: params.get('email') ?? undefined,
    status: params.get('status') ?? undefined,
  }
  const leads = Object.values(query).some(v => v) ? await searchLeads(query) : await fetchLeads()
  return NextResponse.json({ success: true, leads })
}

export async function POST(req: NextRequest) {
  try {
    const data = leadSchema.parse(await req.json())
    const result = await addLeadFromJson(data)
    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('Lead create error', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

