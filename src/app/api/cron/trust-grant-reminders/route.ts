import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)
const REMIND_DAYS = 30 // Send reminder when grant expires in ≤ this many days

/**
 * Call this from a cron job (e.g. Vercel Cron or external) to email users whose
 * gated access grants expire within REMIND_DAYS days.
 * Secure with CRON_SECRET: ?secret=your-secret
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const from = new Date()
  const to = new Date()
  to.setDate(to.getDate() + REMIND_DAYS)

  const expiringGrants = await prisma.gatedAccessGrant.findMany({
    where: {
      expiresAt: { gte: from, lte: to },
    },
    select: { email: true, expiresAt: true },
    distinct: ['email'],
  })

  if (expiringGrants.length === 0 || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ sent: 0, message: 'No expiring grants or RESEND_API_KEY not set' })
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.roalla.com'
  let sent = 0
  for (const g of expiringGrants) {
    const expiresAt = g.expiresAt!
    const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    try {
      await resend.emails.send({
        from: 'Roalla Business Enablement Group <noreply@roalla.com>',
        to: [g.email],
        subject: 'Your Trust Center Access Is Expiring Soon',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px;">
              <p>Your gated Trust Center document access will expire in ${daysLeft} day(s) (around ${expiresAt.toLocaleDateString()}).</p>
              <p>To request renewed access, please submit a new request at: <a href="${baseUrl}/trust">${baseUrl}/trust</a></p>
              <p>If you have questions, contact us at <strong>sales@roalla.com</strong>.</p>
              <p>Best regards,<br><strong>The Roalla Team</strong></p>
            </div>
          </div>
        `,
      })
      sent++
    } catch (e) {
      console.error('Grant reminder email failed for', g.email, e)
    }
  }

  return NextResponse.json({ sent, total: expiringGrants.length })
}
