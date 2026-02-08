import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const STATUS_LIMIT = 10
const STATUS_WINDOW_MS = 60_000

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  const key = getRateLimitKey(request, 'email', email)
  const rl = rateLimit({ key: `trust:status:${key}`, limit: STATUS_LIMIT, windowMs: STATUS_WINDOW_MS })
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  const latest = await prisma.gatedAccessRequest.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      createdAt: true,
      reviewedAt: true,
    },
  })

  if (!latest) {
    return NextResponse.json({ request: null })
  }

  return NextResponse.json({
    request: {
      id: latest.id,
      status: latest.status,
      createdAt: latest.createdAt.toISOString(),
      reviewedAt: latest.reviewedAt?.toISOString() ?? null,
    },
  })
}
