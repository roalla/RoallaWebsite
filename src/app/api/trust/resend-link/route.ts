import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)
const TOKEN_EXPIRY_DAYS = 90
const RESEND_LIMIT = 3
const RESEND_WINDOW_MS = 3600_000 // 1 hour

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const email = (body.email as string)?.trim()?.toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  const key = getRateLimitKey(request, 'email', email)
  const rl = rateLimit({ key: `trust:resend:${key}`, limit: RESEND_LIMIT, windowMs: RESEND_WINDOW_MS })
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many resend requests. Try again later.' }, { status: 429 })
  }

  const approvedRequest = await prisma.gatedAccessRequest.findFirst({
    where: { email, status: 'approved' },
    orderBy: { createdAt: 'desc' },
  })
  if (!approvedRequest) {
    return NextResponse.json({ error: 'No approved request found for this email' }, { status: 404 })
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS)
  const token = crypto.randomBytes(32).toString('hex')

  await prisma.trustCenterToken.create({
    data: { email, token, expiresAt },
  })

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.roalla.com'
  const accessLink = `${baseUrl}/trust?token=${token}`

  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: 'Roalla Business Enablement Group <noreply@roalla.com>',
        to: [email],
        subject: 'Your Trust Center Access Link',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px;">
              <p>Here is your Trust Center access link (requested via the status checker):</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <a href="${accessLink}" style="display: inline-block; background: #00b4c5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Open Trust Center</a>
              </div>
              <p style="font-size: 12px; color: #999; word-break: break-all;">${accessLink}</p>
              <p style="margin-top: 20px;">This link is valid for ${TOKEN_EXPIRY_DAYS} days.</p>
              <p>Best regards,<br><strong>The Roalla Team</strong></p>
            </div>
          </div>
        `,
      })
    } catch (e) {
      console.error('Trust Center resend-link email failed:', e)
      return NextResponse.json({ success: true, accessLink, emailSent: false, message: 'New link created but email failed. Use the link below.' })
    }
  }

  return NextResponse.json({ success: true, accessLink, emailSent: !!process.env.RESEND_API_KEY })
}
