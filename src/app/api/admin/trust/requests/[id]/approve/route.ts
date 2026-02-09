import { NextRequest, NextResponse } from 'next/server'
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { roles?: string[]; id?: string } | undefined
  if (!session || !currentUser?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const req = await prisma.gatedAccessRequest.findUnique({
    where: { id },
    include: { items: true, ndaSignature: true },
  })
  if (!req || req.status !== 'pending') {
    return NextResponse.json({ error: 'Request not found or already reviewed' }, { status: 404 })
  }

  const userId = currentUser.id!
  const email = req.email

  const body = await request.json().catch(() => ({}))
  const grantExpiryDays = body.grantExpiryDays != null ? (typeof body.grantExpiryDays === 'number' ? body.grantExpiryDays : null) : 365
  let grantExpiresAt: Date | null = null
  if (typeof grantExpiryDays === 'number' && grantExpiryDays > 0) {
    grantExpiresAt = new Date()
    grantExpiresAt.setDate(grantExpiresAt.getDate() + grantExpiryDays)
  }

  const items = await prisma.gatedAccessRequestItem.findMany({ where: { requestId: id } })
  const grantsToCreate: { email: string; resourceId?: string; articleId?: string; grantedByUserId: string; expiresAt: Date | null }[] = []

  if (items.length > 0) {
    for (const it of items) {
      if (it.resourceId) grantsToCreate.push({ email, resourceId: it.resourceId, grantedByUserId: userId, expiresAt: grantExpiresAt })
      if (it.articleId) grantsToCreate.push({ email, articleId: it.articleId, grantedByUserId: userId, expiresAt: grantExpiresAt })
    }
  } else {
    const [gatedResources, gatedArticles] = await Promise.all([
      prisma.portalResource.findMany({ where: { gated: true }, select: { id: true } }),
      prisma.portalArticle.findMany({ where: { gated: true }, select: { id: true } }),
    ])
    for (const r of gatedResources) grantsToCreate.push({ email, resourceId: r.id, grantedByUserId: userId, expiresAt: grantExpiresAt })
    for (const a of gatedArticles) grantsToCreate.push({ email, articleId: a.id, grantedByUserId: userId, expiresAt: grantExpiresAt })
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS)
  const token = crypto.randomBytes(32).toString('hex')

  await prisma.$transaction(async (tx) => {
    for (const g of grantsToCreate) {
      await tx.gatedAccessGrant.create({ data: g })
    }
    await tx.gatedAccessRequest.update({
      where: { id },
      data: { status: 'approved', reviewedAt: new Date(), reviewedByUserId: userId },
    })
    await tx.trustCenterToken.create({
      data: { email, token, expiresAt },
    })
  })

  await logTrustAction({ action: 'approved', requestId: id, userId, metadata: { email } })

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.roalla.com'
  const accessLink = `${baseUrl}/trust?token=${token}`

  let emailSent = false
  const sendEmail = body.sendEmail !== false && !!process.env.RESEND_API_KEY

  if (sendEmail) {
    try {
      await resend.emails.send({
        from: 'Roalla Business Enablement Group <noreply@roalla.com>',
        to: [req.email],
        subject: 'Your Trust Center Access Has Been Approved',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #00b4c5, #ffd700); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Access Approved</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Trust Center – secure documents</p>
            </div>
            <div style="padding: 30px;">
              <p>Dear ${req.name},</p>
              <p>Your request to access our gated Trust Center documents has been approved. You can now view and download the content you requested.</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <a href="${accessLink}" style="display: inline-block; background: #00b4c5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0;">
                  Open Trust Center
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
              <p style="font-size: 12px; color: #999; word-break: break-all;">${accessLink}</p>
              <p style="margin-top: 20px;">This link is valid for ${TOKEN_EXPIRY_DAYS} days.${grantExpiresAt ? ` Your document access expires ${grantExpiresAt.toLocaleDateString()}.` : ' Your document access does not expire.'}</p>
              <p>If you have any questions, please contact us at <strong>sales@roalla.com</strong>.</p>
              <p>Best regards,<br><strong>The Roalla Team</strong></p>
            </div>
          </div>
        `,
      })
      emailSent = true
    } catch (e) {
      console.error('Trust Center approval email failed:', e)
    }
  }

  return NextResponse.json({
    success: true,
    accessLink,
    emailSent,
    message: emailSent
      ? `Approved. An email with the access link has been sent to ${req.email}.`
      : `Approved. Share this link with the requestor: ${accessLink}`,
  })
}
