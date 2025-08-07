import { NextRequest, NextResponse } from 'next/server'
import { addLead, getLeads, leadInputSchema } from '@/lib/leads'

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const email = params.get('email') ?? undefined
    const status = params.get('status') ?? undefined
    const search = params.get('q') ?? undefined
    const leads = await getLeads({ email, status, search })
    return NextResponse.json(leads)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = leadInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid lead data' },
        { status: 400 }
      )
    }
    const lead = await addLead(parsed.data)
    return NextResponse.json(lead, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    )
  }
}
