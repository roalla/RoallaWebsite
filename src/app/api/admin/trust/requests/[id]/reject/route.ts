import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { logTrustAction } from '@/lib/trust-audit'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { roles?: string[]; id?: string } | undefined
  if (!session || !currentUser?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const req = await prisma.gatedAccessRequest.findUnique({ where: { id } })
  if (!req || req.status !== 'pending') {
    return NextResponse.json({ error: 'Request not found or already reviewed' }, { status: 404 })
  }

  await prisma.gatedAccessRequest.update({
    where: { id },
    data: { status: 'rejected', reviewedAt: new Date(), reviewedByUserId: currentUser.id! },
  })

  const body = await request.json().catch(() => ({}))
  const reason = typeof body.reason === 'string' ? body.reason.trim() || undefined : undefined
  const sendEmail = body.sendEmail === true && !!process.env.RESEND_API_KEY

  await logTrustAction({
    action: 'rejected',
    requestId: id,
    userId: currentUser.id!,
    metadata: { email: req.email, sendEmail, hasReason: !!reason },
  })

  let emailSent = false
  if (sendEmail) {
    try {
      const reasonBlock = reason
        ? `<p><strong>Note from our team:</strong> ${reason.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`
        : ''
      await resend.emails.send({
        from: 'Roalla Business Enablement Group <noreply@roalla.com>',
        to: [req.email],
        subject: 'Update on Your Trust Center Access Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px;">
              <p>Dear ${req.name},</p>
              <p>Thank you for your interest in accessing our Trust Center documents.</p>
              <p>After review, we are unable to grant access at this time. If you have questions or would like to discuss further, please contact us at <strong>sales@roalla.com</strong>.</p>
              ${reasonBlock}
              <p>Best regards,<br><strong>The Roalla Team</strong></p>
            </div>
          </div>
        `,
      })
      emailSent = true
    } catch (e) {
      console.error('Trust Center rejection email failed:', e)
    }
  }

  return NextResponse.json({ success: true, emailSent })
}
