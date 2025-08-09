import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  getLeadById,
  updateLead,
  updateLeadStatus,
  addNoteToLead,
  deleteLead,
} from '@/actions/leads'

const updateSchema = z.object({
  email: z.string().email().optional(),
  customer_name: z.string().optional(),
  phone: z.string().optional(),
  product_interest: z.string().optional(),
  company: z.string().optional(),
  size: z.string().optional(),
  quantity: z.string().optional(),
  address: z.string().optional(),
  status: z.string().optional(),
  note: z.string().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id)
  if (!lead) {
    return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, lead })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = updateSchema.parse(await req.json())
    if (data.note) {
      await addNoteToLead(params.id, data.note)
    }
    if (data.status) {
      await updateLeadStatus(params.id, data.status)
    }
    const fields: any = { ...data }
    delete fields.note
    delete fields.status
    if (Object.keys(fields).length > 0) {
      await updateLead(params.id, fields)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('Lead update error', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await deleteLead(params.id)
  return NextResponse.json(result, { status: result.success ? 200 : 404 })
}

