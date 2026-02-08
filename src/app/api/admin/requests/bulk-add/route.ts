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
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const raw = body.users
    const sendEmail = body.sendEmail !== false
    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json(
        { error: 'Body must include "users" array with at least one { email, name?, company? }' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || request.nextUrl.origin
    const results: { email: string; status: 'created' | 'updated' | 'skipped'; error?: string }[] = []

    for (const row of raw) {
      const email = typeof row.email === 'string' ? row.email.trim().toLowerCase() : ''
      const name = typeof row.name === 'string' ? row.name.trim() : email.split('@')[0] || 'User'
      const company = typeof row.company === 'string' ? row.company.trim() || null : null

      if (!email) {
        results.push({ email: '(empty)', status: 'skipped', error: 'Missing email' })
        continue
      }
      if (!isValidEmail(email)) {
        results.push({ email, status: 'skipped', error: 'Invalid email' })
        continue
      }

      try {
        const token = crypto.randomBytes(32).toString('hex')
        const accessUrl = `${origin}/resources/portal?token=${token}&email=${encodeURIComponent(email)}`

        const existing = await prisma.accessRequest.findFirst({
          where: { email },
        })
        if (existing) {
          if (existing.status === 'approved') {
            results.push({ email, status: 'skipped', error: 'Already approved' })
            continue
          }
          await prisma.accessRequest.update({
            where: { id: existing.id },
            data: { status: 'approved', token, name, company },
          })
        } else {
          await prisma.accessRequest.create({
            data: { email, name, company, token, status: 'approved' },
          })
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
                  </div>
                  <div style="padding: 30px;">
                    <p>Dear ${name},</p>
                    <p>Your access to the Roalla Resources Portal has been set up.</p>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                      <a href="${accessUrl}" style="display: inline-block; background: #00b4c5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Access Resources Portal</a>
                    </div>
                    <p>Best regards,<br><strong>The Roalla Team</strong></p>
                  </div>
                </div>
              `,
            })
          } catch (_) {}
        }

        results.push({ email, status: existing ? 'updated' : 'created' })
      } catch (e) {
        results.push({ email, status: 'skipped', error: 'Database error' })
      }
    }

    const created = results.filter((r) => r.status === 'created').length
    const updated = results.filter((r) => r.status === 'updated').length
    const skipped = results.filter((r) => r.status === 'skipped').length

    return NextResponse.json({
      success: true,
      results,
      summary: { created, updated, skipped },
    })
  } catch (e) {
    console.error('Bulk add error:', e)
    return NextResponse.json({ error: 'Bulk add failed' }, { status: 500 })
  }
}
