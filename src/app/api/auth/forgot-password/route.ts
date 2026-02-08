import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const RESET_EXPIRY_HOURS = 1

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return same success message to avoid revealing whether email exists
    const successMessage = 'If that email is registered, we sent a password reset link. Check your inbox and spam folder.'

    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: successMessage })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    const baseUrl = request.headers.get('origin') || request.nextUrl.origin
    const resetUrl = `${baseUrl}/login/reset-password?token=${token}`

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Roalla Business Enablement Group <noreply@roalla.com>',
          to: [user.email!],
          subject: 'Reset your password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="padding: 30px;">
                <h2 style="color: #00b4c5;">Reset your password</h2>
                <p>You requested a password reset. Click the button below to set a new password. This link expires in ${RESET_EXPIRY_HOURS} hour.</p>
                <p style="margin: 24px 0;">
                  <a href="${resetUrl}" style="display: inline-block; background: #00b4c5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset password</a>
                </p>
                <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
                <p style="font-size: 12px; color: #999; word-break: break-all;">${resetUrl}</p>
                <p style="font-size: 14px; color: #666; margin-top: 24px;">If you didn't request this, you can ignore this email.</p>
              </div>
            </div>
          `,
        })
      } catch (e) {
        console.error('Forgot password email failed:', e)
      }
    }

    return NextResponse.json({ message: successMessage })
  } catch (e) {
    console.error('Forgot password error:', e)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
