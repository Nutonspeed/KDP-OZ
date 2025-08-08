import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log("RFQ submitted", data)
    // TODO: save to DB or send email
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("RFQ error", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
