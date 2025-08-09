import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { addLeadFromJson } from "@/actions/leads"

const rfqSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(),
  message: z.string().optional(),
  utm: z.record(z.any()).optional(),
  productInterest: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const parsed = rfqSchema.parse(data)
    console.log("RFQ submitted", parsed)
    const result = await addLeadFromJson(parsed)
    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("RFQ error", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
