import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export const dynamic = 'force-dynamic'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const company = typeof body.company === 'string' ? body.company.trim() || null : null
    const sendEmail = body.sendEmail !== false

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const origin = request.headers.get('origin') || request.nextUrl.origin
    const accessUrl = `${origin}/resources/portal?token=${token}&email=${encodeURIComponent(email)}`

    const existing = await prisma.accessRequest.findFirst({
      where: { email },
    })
    if (existing) {
      if (existing.status === 'approved') {
        return NextResponse.json(
          { error: 'A user with this email already has approved access.' },
          { status: 400 }
        )
      }
      await prisma.accessRequest.update({
        where: { id: existing.id },
        data: { status: 'approved', token, name, company },
      })
    } else {
      await prisma.accessRequest.create({
        data: {
          email,
          name,
          company,
          token,
          status: 'approved',
        },
      })
    }

    const accessRequest = await prisma.accessRequest.findFirst({
      where: { email, status: 'approved' },
    })
    if (!accessRequest) {
      return NextResponse.json({ error: 'Failed to create/update request' }, { status: 500 })
    }

    if (sendEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Roalla Business Enablement Group <noreply@roalla.com>',
          to: [email],
          subject: 'Your Resources Portal Access Has Been Approved',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #00b4c5, #ffd700); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Access Approved!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Welcome to the Resources Portal</p>
              </div>
              <div style="padding: 30px;">
                <p>Dear ${name},</p>
                <p>Your access to the Roalla Resources Portal has been set up.</p>
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
        console.error('Add user email failed:', e)
      }
    }

    return NextResponse.json({
      success: true,
      accessUrl,
      emailSent: !!sendEmail && !!process.env.RESEND_API_KEY,
    })
  } catch (e) {
    console.error('Add user error:', e)
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 })
  }
}
