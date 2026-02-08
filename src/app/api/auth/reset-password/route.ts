import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

const MIN_PASSWORD_LENGTH = 8

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = typeof body.token === 'string' ? body.token.trim() : ''
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''

    if (!token) {
      return NextResponse.json({ error: 'Reset token is required' }, { status: 400 })
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      )
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has expired. Request a new one.' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.delete({ where: { id: resetRecord.id } }),
    ])

    return NextResponse.json({ message: 'Password updated. You can sign in with your new password.' })
  } catch (e) {
    console.error('Reset password error:', e)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
