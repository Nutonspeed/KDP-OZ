import { NextRequest, NextResponse } from 'next/server'
import { addLead, getLeads } from '@/lib/leads'

export async function GET() {
  const leads = await getLeads()
  return NextResponse.json(leads)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const lead = await addLead(data)
  return NextResponse.json(lead, { status: 201 })
}
