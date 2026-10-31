import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const normalizeCode = (value: string) => value.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')

const configuredCodes = () =>
  (process.env.WEBSITE_ESTIMATE_REFERRAL_CODES ?? 'COMMUNITY30')
    .split(',')
    .map(normalizeCode)
    .filter(Boolean)

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  const rawCode =
    typeof body === 'object' && body !== null && 'code' in body && typeof body.code === 'string'
      ? body.code
      : ''
  const code = normalizeCode(rawCode)
  const valid = code.length > 0 && configuredCodes().includes(code)

  return NextResponse.json(
    valid ? { valid: true, discountPercent: 30 } : { valid: false },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
