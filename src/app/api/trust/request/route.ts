import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const company = typeof body.company === 'string' ? body.company.trim() || null : null
    const agreementId = typeof body.agreementId === 'string' ? body.agreementId.trim() : ''
    const acceptedNda = body.acceptedNda === true
    const items = Array.isArray(body.items) ? body.items : []

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!acceptedNda) {
      return NextResponse.json({ error: 'You must accept the NDA to request access' }, { status: 400 })
    }

    const agreement = await prisma.ndaAgreement.findUnique({ where: { id: agreementId } })
    if (!agreement) {
      return NextResponse.json({ error: 'Invalid agreement' }, { status: 400 })
    }

    const headers = request.headers
    const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headers.get('x-real-ip') ?? null
    const userAgent = headers.get('user-agent') ?? null

    const signature = await prisma.ndaSignature.create({
      data: {
        agreementId,
        email,
        name,
        company,
        ipAddress: ip,
        userAgent: userAgent ? userAgent.slice(0, 500) : null,
      },
    })

    const validItems: { resourceId?: string; articleId?: string }[] = []
    for (const it of items) {
      if (it.type === 'resource' && typeof it.id === 'string') {
        const r = await prisma.portalResource.findUnique({ where: { id: it.id }, select: { gated: true } })
        if (r?.gated) validItems.push({ resourceId: it.id })
      } else if (it.type === 'article' && typeof it.id === 'string') {
        const a = await prisma.portalArticle.findUnique({ where: { id: it.id }, select: { gated: true } })
        if (a?.gated) validItems.push({ articleId: it.id })
      }
    }

    await prisma.gatedAccessRequest.create({
      data: {
        email,
        name,
        company,
        ndaSignatureId: signature.id,
        status: 'pending',
        items: validItems.length ? { create: validItems } : undefined,
      },
    })

    return NextResponse.json({ success: true, message: 'Your request has been submitted. We will notify you once it is reviewed.' })
  } catch (e) {
    console.error('Trust request error:', e)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
