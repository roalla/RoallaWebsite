import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcrypt'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManageTeam, isAdmin } from '@/lib/access'
import { logTeamAction } from '@/lib/team-audit'
import { Resend } from 'resend'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const VALID_ROLES = ['admin', 'partner', 'business', 'member'] as const
const MIN_PASSWORD_LENGTH = 8
const PARTNER_ADD_USER_CAP = Math.max(0, Number(process.env.PARTNER_ADD_USER_CAP) || 50)
const resend = new Resend(process.env.RESEND_API_KEY)

function randomPassword(length: number = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map((b) => chars[b % chars.length])
    .join('')
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !canManageTeam(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const actorId = (session.user as { id?: string }).id
  const body = await request.json().catch(() => ({}))
  const rows = Array.isArray(body.rows) ? body.rows : []
  const sendInviteEmail = body.sendInviteEmail === true

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Provide rows array with at least one { email, name?, role? }' }, { status: 400 })
  }

  let finalOrganizationId: string | null = null
  let addedByUserId: string | null = null
  if (!isAdmin(session.user)) {
    const partner = actorId
      ? await prisma.user.findUnique({
          where: { id: actorId },
          select: { organizationId: true },
        })
      : null
    if (!partner?.organizationId) {
      return NextResponse.json({ error: 'Partners must be assigned to an organization before adding users' }, { status: 403 })
    }
    const addedCount = await prisma.user.count({ where: { addedByUserId: actorId } })
    const remaining = Math.max(0, PARTNER_ADD_USER_CAP - addedCount)
    if (rows.length > remaining) {
      return NextResponse.json(
        { error: `You can add at most ${remaining} more user(s). Requested ${rows.length}.` },
        { status: 403 }
      )
    }
    finalOrganizationId = partner.organizationId
    addedByUserId = actorId ?? null
  }

  const results: { created: number; errors: string[] } = { created: 0, errors: [] }
  const loginUrl = `${process.env.NEXTAUTH_URL || 'https://www.roalla.com'}/login`

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const email = typeof row?.email === 'string' ? row.email.trim().toLowerCase() : ''
    const name = typeof row?.name === 'string' ? row.name.trim() || null : null
    let role = typeof row?.role === 'string' ? row.role.trim().toLowerCase() : 'member'
    if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) role = 'member'
    if (!isAdmin(session.user) && role === 'admin') role = 'member'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      results.errors.push(`Row ${i + 1}: valid email required`)
      continue
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      results.errors.push(`Row ${i + 1}: ${email} already exists`)
      continue
    }

    const password = randomPassword(MIN_PASSWORD_LENGTH + 4)
    const passwordHash = await bcrypt.hash(password, 12)

    try {
      const user = await prisma.$transaction(async (tx) => {
        const u = await tx.user.create({
          data: {
            email,
            name,
            passwordHash,
            role,
            organizationId: finalOrganizationId,
            addedByUserId,
          },
        })
        await tx.userRole.create({ data: { userId: u.id, role } })
        return u
      })

      await logTeamAction({
        action: 'user_added',
        actorUserId: actorId ?? undefined,
        targetUserId: user.id,
        metadata: { email: user.email, roles: [role], bulk: true },
      })

      if (sendInviteEmail && resend && user.email) {
        try {
          await resend.emails.send({
            from: 'Roalla Business Enablement Group <noreply@roalla.com>',
            to: [user.email],
            subject: "You've been invited to the platform",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="padding: 30px;">
                  <p>You've been added to the platform.</p>
                  <p>Sign in at: <a href="${loginUrl}">${loginUrl}</a></p>
                  <p>Use the password that your administrator gave you.</p>
                  <p>Best regards,<br>Roalla</p>
                </div>
              </div>
            `,
          })
        } catch (e) {
          console.error('Bulk invite email failed for', user.email, e)
        }
      }

      results.created++
    } catch (e) {
      results.errors.push(`Row ${i + 1}: ${email} – ${e instanceof Error ? e.message : 'Failed to create'}`)
    }
  }

  return NextResponse.json(results)
}
