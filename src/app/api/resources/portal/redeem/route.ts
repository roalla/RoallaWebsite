import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPortalViewer } from '@/lib/portal-access'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
    const token = typeof body.token === 'string' ? body.token.trim() : null
    const email = typeof body.email === 'string' ? body.email.trim() : null

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }
    const verified = await verifyPortalViewer(token, email)
    if ('error' in verified) {
      return NextResponse.json({ error: verified.error }, { status: verified.status })
    }
    const { viewer } = verified

    const portalCode = await prisma.portalCode.findUnique({
      where: { code },
      include: { bundle: true },
    })
    if (!portalCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }
    if (portalCode.expiresAt && portalCode.expiresAt < new Date()) {
      return NextResponse.json({ error: 'This code has expired' }, { status: 400 })
    }
    if (portalCode.maxRedemptions != null) {
      const count = await prisma.portalCodeRedemption.count({
        where: { codeId: portalCode.id },
      })
      if (count >= portalCode.maxRedemptions) {
        return NextResponse.json({ error: 'This code has reached its redemption limit' }, { status: 400 })
      }
    }

    const existing = await prisma.userPortalBundle.findUnique({
      where: {
        email_bundleId: { email: viewer.email, bundleId: portalCode.bundleId },
      },
    })
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You already have access to this bundle',
        bundleName: portalCode.bundle.name,
      })
    }

    await prisma.$transaction([
      prisma.portalCodeRedemption.create({
        data: { codeId: portalCode.id, email: viewer.email },
      }),
      prisma.userPortalBundle.create({
        data: { email: viewer.email, bundleId: portalCode.bundleId },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Code redeemed successfully',
      bundleName: portalCode.bundle.name,
    })
  } catch (e) {
    console.error('Portal redeem error:', e)
    return NextResponse.json({ error: 'Failed to redeem code' }, { status: 500 })
  }
}
