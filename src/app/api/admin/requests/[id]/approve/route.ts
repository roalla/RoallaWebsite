import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { isAdmin } from '@/lib/access'

const resend = new Resend(process.env.RESEND_API_KEY)

export const dynamic = 'force-dynamic'

/** POST: approve a pending request from admin. Sets default access (public only) unless body overrides. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: requestId } = await params
  if (!requestId) {
    return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
  }

  const accessRequest = await prisma.accessRequest.findUnique({
    where: { id: requestId },
    select: { id: true, email: true, name: true, status: true, token: true },
  })
  if (!accessRequest) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }
  if (accessRequest.status !== 'pending') {
    return NextResponse.json({ error: 'Request is not pending' }, { status: 400 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const fullAccess = typeof body.fullAccess === 'boolean' ? body.fullAccess : false
    const grantResourceIds = Array.isArray(body.grantResourceIds) ? body.grantResourceIds.filter((id: unknown) => typeof id === 'string') : []
    const grantArticleIds = Array.isArray(body.grantArticleIds) ? body.grantArticleIds.filter((id: unknown) => typeof id === 'string') : []
    const sendEmail = body.sendEmail !== false
    const currentUserId = (session.user as { id?: string }).id
    const email = accessRequest.email.toLowerCase()

    await prisma.$transaction(async (tx) => {
      await tx.accessRequest.update({
        where: { id: requestId },
        data: { status: 'approved', fullAccess },
      })
      const toCreate: { email: string; resourceId?: string; articleId?: string; grantedByUserId: string | null }[] = []
      for (const resourceId of grantResourceIds) {
        toCreate.push({ email, resourceId, grantedByUserId: currentUserId ?? null })
      }
      for (const articleId of grantArticleIds) {
        toCreate.push({ email, articleId, grantedByUserId: currentUserId ?? null })
      }
      if (toCreate.length > 0) {
        await tx.portalItemGrant.createMany({ data: toCreate })
      }
    })

    if (sendEmail && process.env.RESEND_API_KEY) {
      const origin = request.headers.get('origin') || request.nextUrl.origin
      const accessUrl = `${origin}/resources/portal?token=${accessRequest.token}&email=${encodeURIComponent(accessRequest.email)}`
      try {
        await resend.emails.send({
          from: 'Roalla Business Enablement Group <noreply@roalla.com>',
          to: [accessRequest.email],
          subject: 'Your Resources Portal Access Has Been Approved',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #00b4c5, #ffd700); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Access Approved!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Welcome to the Resources Portal</p>
              </div>
              <div style="padding: 30px;">
                <p>Dear ${accessRequest.name},</p>
                <p>Your request to access the Roalla Resources Portal has been approved.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <a href="${accessUrl}" style="display: inline-block; background: #00b4c5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Access Resources Portal</a>
                </div>
                <p style="font-size: 12px; color: #999; word-break: break-all;">${accessUrl}</p>
                <p>Best regards,<br><strong>The Roalla Team</strong></p>
              </div>
            </div>
          `,
        })
      } catch (e) {
        console.error('Approve email failed:', e)
      }
    }

    return NextResponse.json({
      success: true,
      emailSent: sendEmail && !!process.env.RESEND_API_KEY,
    })
  } catch (e) {
    console.error('Approve request error:', e)
    return NextResponse.json({ error: 'Failed to approve' }, { status: 500 })
  }
}
