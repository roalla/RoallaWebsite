import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySync } from 'otplib'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const token = typeof body.token === 'string' ? body.token.trim() : ''
  const code = typeof body.code === 'string' ? body.code.replace(/\s/g, '') : ''

  if (!token || !code) {
    return NextResponse.json({ error: 'Token and code required' }, { status: 400 })
  }

  const pending = await prisma.authPendingToken.findUnique({
    where: { token },
  })
  if (!pending || pending.type !== '2fa_pending' || pending.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token. Please sign in again.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: pending.userId },
  })
  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: '2FA not configured' }, { status: 400 })
  }

  const result = verifySync({ secret: user.twoFactorSecret, token: code })
  if (!result.valid) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  const successToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 2)

  await prisma.$transaction([
    prisma.authPendingToken.delete({ where: { id: pending.id } }),
    prisma.authPendingToken.create({
      data: { token: successToken, userId: user.id, type: '2fa_success', expiresAt },
    }),
  ])

  return NextResponse.json({ success: true, signInToken: successToken })
}
