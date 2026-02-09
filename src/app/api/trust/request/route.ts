import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)
const REQUEST_LIMIT_IP = 5
const REQUEST_LIMIT_EMAIL = 3
const REQUEST_WINDOW_MS = 3600_000 // 1 hour

export async function POST(request: NextRequest) {
  try {
    const ipKey = getRateLimitKey(request, 'ip')
    const rlIp = rateLimit({ key: `trust:request:ip:${ipKey}`, limit: REQUEST_LIMIT_IP, windowMs: REQUEST_WINDOW_MS })
    if (!rlIp.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    if (email) {
      const emailKey = getRateLimitKey(request, 'email', email)
      const rlEmail = rateLimit({ key: `trust:request:${emailKey}`, limit: REQUEST_LIMIT_EMAIL, windowMs: REQUEST_WINDOW_MS })
      if (!rlEmail.success) {
        return NextResponse.json({ error: 'Too many access requests from this email. Please try again later.' }, { status: 429 })
      }
    }
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

    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.roalla.com'
    const statusUrl = `${baseUrl}/trust`

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Roalla Business Enablement Group <noreply@roalla.com>',
          to: [email],
          subject: 'We Received Your Trust Center Access Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="padding: 30px;">
                <p>Dear ${name},</p>
                <p>We have received your request to access our Trust Center documents. We will review it and get back to you within 1–2 business days.</p>
                <p>You can check your request status anytime at: <a href="${statusUrl}">${statusUrl}</a> (use this email address).</p>
                <p>Best regards,<br><strong>The Roalla Team</strong></p>
              </div>
            </div>
          `,
        })
      } catch (e) {
        console.error('Trust request confirmation email failed:', e)
      }
    }

    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL
    if (adminEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Roalla Business Enablement Group <noreply@roalla.com>',
          to: [adminEmail],
          subject: 'New Trust Center Gated Access Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="padding: 30px;">
                <p>A new gated access request has been submitted.</p>
                <p><strong>${name}</strong> (${email})${company ? ` – ${company}` : ''}</p>
                <p>Review and approve or reject at: ${baseUrl}/admin/trust/requests</p>
                <p>Best regards,<br>Roalla</p>
              </div>
            </div>
          `,
        })
      } catch (e) {
        console.error('Trust admin notification email failed:', e)
      }
    }

    return NextResponse.json({ success: true, message: 'Your request has been submitted. We will notify you once it is reviewed.' })
  } catch (e) {
    console.error('Trust request error:', e)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
