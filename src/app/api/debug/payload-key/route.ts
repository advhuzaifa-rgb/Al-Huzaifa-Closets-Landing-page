import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Safe debug endpoint: returns whether PAYLOAD_API_KEY is present and its length
// DOES NOT return the key itself.
export async function GET() {
  try {
    const hasKey = !!process.env.PAYLOAD_API_KEY
    const len = hasKey ? String(process.env.PAYLOAD_API_KEY).length : 0
    return NextResponse.json({ present: hasKey, length: len })
  } catch (err) {
    return NextResponse.json({ present: false, length: 0, error: String(err) }, { status: 500 })
  }
}
