import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { logTrustAction } from '@/lib/trust-audit'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { roles?: string[]; id?: string } | undefined
  if (!session || !currentUser?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => typeof id === 'string') as string[] : []
  const sendEmail = body.sendEmail === true && !!process.env.RESEND_API_KEY
  const reason = typeof body.reason === 'string' ? body.reason.trim() || undefined : undefined

  if (ids.length === 0) {
    return NextResponse.json({ error: 'No request IDs provided' }, { status: 400 })
  }

  const pending = await prisma.gatedAccessRequest.findMany({
    where: { id: { in: ids }, status: 'pending' },
  })

  const results: { id: string; success: boolean; error?: string }[] = []

  for (const req of pending) {
    try {
      await prisma.gatedAccessRequest.update({
        where: { id: req.id },
        data: { status: 'rejected', reviewedAt: new Date(), reviewedByUserId: currentUser.id! },
      })

      await logTrustAction({
        action: 'rejected',
        requestId: req.id,
        userId: currentUser.id!,
        metadata: { email: req.email, sendEmail, hasReason: !!reason },
      })

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
                  <p>After review, we are unable to grant access at this time. If you have questions, please contact us at <strong>sales@roalla.com</strong>.</p>
                  ${reasonBlock}
                  <p>Best regards,<br><strong>The Roalla Team</strong></p>
                </div>
              </div>
            `,
          })
        } catch (e) {
          console.error('Bulk reject email failed for', req.email, e)
        }
      }
      results.push({ id: req.id, success: true })
    } catch (e) {
      console.error('Bulk reject failed for', req.id, e)
      results.push({ id: req.id, success: false, error: e instanceof Error ? e.message : 'Failed' })
    }
  }

  const succeeded = results.filter((r) => r.success).length
  return NextResponse.json({ results, succeeded, total: ids.length })
}
