import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ valid: false })
  }
  const tc = await prisma.trustCenterToken.findUnique({
    where: { token },
  })
  const valid = !!(tc && tc.expiresAt > new Date())
  return NextResponse.json({
    valid,
    email: valid ? tc!.email : undefined,
    expiresAt: valid ? tc!.expiresAt.toISOString() : undefined,
  })
}
