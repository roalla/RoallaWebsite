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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { roles?: string[]; id?: string } | undefined
  if (!session || !currentUser?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => typeof id === 'string') as string[] : []
  const sendEmail = body.sendEmail !== false && !!process.env.RESEND_API_KEY
  const grantExpiryDays = body.grantExpiryDays != null ? (typeof body.grantExpiryDays === 'number' ? body.grantExpiryDays : null) : 365
  let grantExpiresAt: Date | null = null
  if (typeof grantExpiryDays === 'number' && grantExpiryDays > 0) {
    grantExpiresAt = new Date()
    grantExpiresAt.setDate(grantExpiresAt.getDate() + grantExpiryDays)
  }

  if (ids.length === 0) {
    return NextResponse.json({ error: 'No request IDs provided' }, { status: 400 })
  }

  const pending = await prisma.gatedAccessRequest.findMany({
    where: { id: { in: ids }, status: 'pending' },
    include: { items: true },
  })

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.roalla.com'
  const userId = currentUser.id!

  const results: { id: string; success: boolean; error?: string }[] = []

  for (const req of pending) {
    try {
      const items = await prisma.gatedAccessRequestItem.findMany({ where: { requestId: req.id } })
      const grantsToCreate: { email: string; resourceId?: string; articleId?: string; grantedByUserId: string; expiresAt: Date | null }[] = []
      if (items.length > 0) {
        for (const it of items) {
          if (it.resourceId) grantsToCreate.push({ email: req.email, resourceId: it.resourceId, grantedByUserId: userId, expiresAt: grantExpiresAt })
          if (it.articleId) grantsToCreate.push({ email: req.email, articleId: it.articleId, grantedByUserId: userId, expiresAt: grantExpiresAt })
        }
      } else {
        const [gatedResources, gatedArticles] = await Promise.all([
          prisma.portalResource.findMany({ where: { gated: true }, select: { id: true } }),
          prisma.portalArticle.findMany({ where: { gated: true }, select: { id: true } }),
        ])
        for (const r of gatedResources) grantsToCreate.push({ email: req.email, resourceId: r.id, grantedByUserId: userId, expiresAt: grantExpiresAt })
        for (const a of gatedArticles) grantsToCreate.push({ email: req.email, articleId: a.id, grantedByUserId: userId, expiresAt: grantExpiresAt })
      }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS)
      const token = crypto.randomBytes(32).toString('hex')

      await prisma.$transaction(async (tx) => {
        for (const g of grantsToCreate) {
          await tx.gatedAccessGrant.create({ data: g })
        }
        await tx.gatedAccessRequest.update({
          where: { id: req.id },
          data: { status: 'approved', reviewedAt: new Date(), reviewedByUserId: userId },
        })
        await tx.trustCenterToken.create({
          data: { email: req.email, token, expiresAt },
        })
      })

      await logTrustAction({ action: 'approved', requestId: req.id, userId, metadata: { email: req.email } })

      const accessLink = `${baseUrl}/trust?token=${token}`
      if (sendEmail) {
        try {
          await resend.emails.send({
            from: 'Roalla Business Enablement Group <noreply@roalla.com>',
            to: [req.email],
            subject: 'Your Trust Center Access Has Been Approved',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="padding: 30px;">
                  <p>Dear ${req.name},</p>
                  <p>Your request to access our gated Trust Center documents has been approved.</p>
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <a href="${accessLink}" style="display: inline-block; background: #00b4c5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Open Trust Center</a>
                  </div>
                  <p style="font-size: 12px; color: #999; word-break: break-all;">${accessLink}</p>
                  <p>This link is valid for ${TOKEN_EXPIRY_DAYS} days.${grantExpiresAt ? ` Your document access expires ${grantExpiresAt.toLocaleDateString()}.` : ' Your document access does not expire.'}</p>
                  <p>Best regards,<br><strong>The Roalla Team</strong></p>
                </div>
              </div>
            `,
          })
        } catch (e) {
          console.error('Bulk approve email failed for', req.email, e)
        }
      }
      results.push({ id: req.id, success: true })
    } catch (e) {
      console.error('Bulk approve failed for', req.id, e)
      results.push({ id: req.id, success: false, error: e instanceof Error ? e.message : 'Failed' })
    }
  }

  const succeeded = results.filter((r) => r.success).length
  return NextResponse.json({ results, succeeded, total: ids.length })
}
