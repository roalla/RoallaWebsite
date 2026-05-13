import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Resend } from 'resend'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import {
  buildStoredReason,
  isValidRequestReason,
  requestReasonLabel,
  requestReasonNeedsCode,
  type RequestReasonValue,
} from '@/lib/request-reasons'

const resend = new Resend(process.env.RESEND_API_KEY)
const requestTypeLabels: Record<string, string> = {
  'advisory-board-match': 'Advisory Board Match',
  'digital-creations': 'Digital Creations',
  general: 'General Resource Centre Access',
}

/** POST: Create a resources portal access request as the signed-in user. Body: { name, company?, reason?, requestType?, requestReason, accessCode? }. Email from session. */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!session || !email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Sign in to request access.' }, { status: 401 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email on account.' }, { status: 400 })
  }

  let body: {
    name?: string
    company?: string
    reason?: string
    requestType?: string
    requestReason?: string
    accessCode?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const company = typeof body.company === 'string' ? body.company.trim() || null : null
  const requestTypeKey = typeof body.requestType === 'string' ? body.requestType.trim().toLowerCase() : ''
  const requestTypeLabel = requestTypeLabels[requestTypeKey] ?? null
  const reasonText = typeof body.reason === 'string' ? body.reason.trim() : ''
  const requestReasonRaw = typeof body.requestReason === 'string' ? body.requestReason.trim().toLowerCase() : ''
  if (!isValidRequestReason(requestReasonRaw)) {
    return NextResponse.json({ error: 'Please select a valid reason for your request.' }, { status: 400 })
  }
  const requestReason = requestReasonRaw as RequestReasonValue
  const accessCode = typeof body.accessCode === 'string' ? body.accessCode.trim().toUpperCase() : ''

  if (requestReasonNeedsCode(requestReason) && !accessCode) {
    return NextResponse.json({ error: 'An access code is required for this request reason.' }, { status: 400 })
  }

  if (accessCode) {
    const code = await prisma.portalCode.findUnique({
      where: { code: accessCode },
      select: { id: true },
    })
    if (!code) {
      return NextResponse.json({ error: 'Invalid access code. Please check your code and try again.' }, { status: 400 })
    }
  }

  const reason = buildStoredReason({
    requestTypeLabel,
    requestReason,
    freeTextReason: reasonText,
    accessCode: accessCode || null,
  })

  if (!name) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const origin = process.env.NEXTAUTH_URL || request.headers.get('origin') || 'https://www.roalla.com'

  let accessRequest: { id: string }
  try {
    accessRequest = await prisma.accessRequest.create({
      data: {
        email,
        name,
        company,
        reason,
        token,
        status: 'pending',
      },
    })
  } catch (dbError: unknown) {
    const err = dbError as { code?: string; message?: string }
    if (err?.code === 'P1001' || err?.message?.includes("Can't reach database")) {
      return NextResponse.json({ error: 'Database connection failed. Please try again later.' }, { status: 503 })
    }
    if (err?.code === 'P1000' || err?.message?.includes('password authentication failed') || err?.message?.includes('Authentication failed')) {
      return NextResponse.json({ error: 'Database configuration error. Please try again later or contact support.' }, { status: 503 })
    }
    if (err?.code === 'P2021' || err?.code === 'P2025') {
      return NextResponse.json({ error: 'Database table not found. Please contact support.' }, { status: 500 })
    }
    throw dbError
  }

  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: 'Roalla Website <noreply@roalla.com>',
        to: ['sales@roalla.com'],
        subject: `New Resources Portal Access Request from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00b4c5;">New Resources Portal Access Request (signed in)</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Company:</strong> ${company || 'Not provided'}</p>
              <p><strong>Request Type:</strong> ${requestTypeLabel || 'General Resource Centre Access'}</p>
              <p><strong>Request Reason:</strong> ${requestReasonLabel(requestReason)}</p>
              <p><strong>Access Code:</strong> ${accessCode || 'Not provided'}</p>
              <p><strong>Reason:</strong> ${reasonText || 'Not provided'}</p>
              <p><strong>Request ID:</strong> ${accessRequest.id}</p>
              <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="background: #fff; padding: 20px; border-left: 4px solid #00b4c5; margin: 20px 0;">
              <p><strong>To approve this request, visit:</strong></p>
              <p><a href="${origin}/api/resources/approve?requestId=${accessRequest.id}&token=${token}" style="color: #00b4c5;">Approve Access Request</a></p>
            </div>
          </div>
        `,
      })
      await resend.emails.send({
        from: 'Roalla Business Enablement Group <noreply@roalla.com>',
        to: [email],
        subject: 'Resources Portal Access Request Received',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #00b4c5, #ffd700); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Request Received!</h1>
            </div>
            <div style="padding: 30px;">
              <p>Dear ${name},</p>
              <p>Thank you for requesting access to the Roalla Resources Portal. We have received your request and will review it shortly.</p>
              <p>You will receive an email with access instructions within 24 hours once your request has been approved.</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Request Details:</strong></p>
                <p>Email: ${email}</p>
                <p>Company: ${company || 'Not provided'}</p>
                <p>Request Type: ${requestTypeLabel || 'General Resource Centre Access'}</p>
              </div>
              <p>Best regards,<br><strong>The Roalla Team</strong></p>
            </div>
          </div>
        `,
      })
    } catch {
      // Request is saved; email is best-effort
    }
  }

  return NextResponse.json({ success: true, message: 'Access request submitted successfully' })
}
