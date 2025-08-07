import { NextRequest, NextResponse } from 'next/server'
import {
  getLead,
  updateLead,
  deleteLead,
  leadUpdateSchema,
  leadInputSchema,
} from '@/lib/leads'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await getLead(params.id)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    return NextResponse.json(lead)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const parsed = leadInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid lead data' }, { status: 400 })
    }
    const lead = await updateLead(params.id, parsed.data)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    return NextResponse.json(lead)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const parsed = leadUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid lead data' }, { status: 400 })
    }
    const lead = await updateLead(params.id, parsed.data)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    return NextResponse.json(lead)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteLead(params.id)
    if (!success) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
