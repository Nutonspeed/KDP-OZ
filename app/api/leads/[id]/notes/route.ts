import { NextRequest, NextResponse } from 'next/server'
import { addLeadNote } from '@/lib/leads'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const note = typeof body.note === 'string' ? body.note.trim() : ''
    if (!note) {
      return NextResponse.json({ error: 'Invalid note' }, { status: 400 })
    }
    const lead = await addLeadNote(params.id, note)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    return NextResponse.json(lead)
  } catch {
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
}

