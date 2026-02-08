import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'
import { logTrustAction } from '@/lib/trust-audit'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)
const TOKEN_EXPIRY_DAYS = 90

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { roles?: string[] } | undefined
  if (!session || !currentUser?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const req = await prisma.gatedAccessRequest.findUnique({ where: { id } })
  if (!req || req.status !== 'approved') {
    return NextResponse.json({ error: 'Request not found or not approved' }, { status: 404 })
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS)
  const token = crypto.randomBytes(32).toString('hex')

  await prisma.trustCenterToken.create({
    data: { email: req.email, token, expiresAt },
  })

  await logTrustAction({
    action: 'resend_link',
    requestId: id,
    userId: (currentUser as { id?: string })?.id,
    metadata: { email: req.email },
  })

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.roalla.com'
  const accessLink = `${baseUrl}/trust?token=${token}`

  let emailSent = false
  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: 'Roalla Business Enablement Group <noreply@roalla.com>',
        to: [req.email],
        subject: 'Your Trust Center Access Link (Resent)',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px;">
              <p>Dear ${req.name},</p>
              <p>Here is a new access link for the Trust Center (valid for ${TOKEN_EXPIRY_DAYS} days):</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <a href="${accessLink}" style="display: inline-block; background: #00b4c5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Open Trust Center</a>
              </div>
              <p style="font-size: 12px; color: #999; word-break: break-all;">${accessLink}</p>
              <p>Best regards,<br><strong>The Roalla Team</strong></p>
            </div>
          </div>
        `,
      })
      emailSent = true
    } catch (e) {
      console.error('Trust Center admin resend-link email failed:', e)
    }
  }

  return NextResponse.json({
    success: true,
    accessLink,
    emailSent,
    message: emailSent
      ? `New link sent to ${req.email}.`
      : `New link created. Share with requestor: ${accessLink}`,
  })
}
