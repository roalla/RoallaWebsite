import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifySync } from 'otplib'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[]; id?: string } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const secret = typeof body.secret === 'string' ? body.secret.trim() : ''
  const code = typeof body.code === 'string' ? body.code.replace(/\s/g, '') : ''

  if (!secret || !code) {
    return NextResponse.json({ error: 'Secret and code required' }, { status: 400 })
  }

  const result = verifySync({ secret, token: code })
  if (!result.valid) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret, twoFactorEnabled: true },
  })

  return NextResponse.json({ success: true })
}
