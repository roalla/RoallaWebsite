import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcrypt'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManageTeam, isAdmin } from '@/lib/access'
import { logTeamAction } from '@/lib/team-audit'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const VALID_ROLES = ['admin', 'partner', 'business', 'member'] as const
const MIN_PASSWORD_LENGTH = 8
const PARTNER_ADD_USER_CAP = Math.max(0, Number(process.env.PARTNER_ADD_USER_CAP) || 50)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !canManageTeam(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const currentUserId = (session.user as { id?: string }).id
  const currentUserDb = currentUserId ? await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { organizationId: true },
  }) : null

  const where: { organizationId?: string | null } = {}
  if (!isAdmin(session.user)) {
    if (!currentUserDb?.organizationId) {
      return NextResponse.json([])
    }
    where.organizationId = currentUserDb.organizationId
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { email: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      organizationId: true,
      organization: { select: { id: true, name: true } },
      roles: { select: { role: true } },
    },
  })

  const list = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image,
    primaryRole: u.role,
    roles: u.roles.map((r) => r.role),
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    organizationId: u.organizationId,
    organizationName: u.organization?.name ?? null,
  }))

  return NextResponse.json(list)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !canManageTeam(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const actorId = (session.user as { id?: string }).id
  const body = await request.json()
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const name = typeof body.name === 'string' ? body.name.trim() || null : null
  const password = typeof body.password === 'string' ? body.password : ''
  const organizationId = typeof body.organizationId === 'string' ? body.organizationId.trim() || null : null
  const sendInviteEmail = body.sendInviteEmail === true
  let roles = Array.isArray(body.roles) ? body.roles.filter((r: string) => VALID_ROLES.includes(r as (typeof VALID_ROLES)[number])) : ['member']
  if (!isAdmin(session.user)) {
    roles = roles.filter((r: string) => r !== 'admin')
    if (roles.length === 0) roles = ['member']
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 })
  }

  let finalOrganizationId: string | null = null
  let addedByUserId: string | null = null

  if (isAdmin(session.user)) {
    finalOrganizationId = organizationId || null
  } else {
    const partner = actorId ? await prisma.user.findUnique({
      where: { id: actorId },
      select: { organizationId: true },
    }) : null
    if (!partner?.organizationId) {
      return NextResponse.json({ error: 'Partners must be assigned to an organization before adding users' }, { status: 403 })
    }
    const count = await prisma.user.count({ where: { addedByUserId: actorId } })
    if (count >= PARTNER_ADD_USER_CAP) {
      return NextResponse.json(
        { error: `You have reached the limit of ${PARTNER_ADD_USER_CAP} users you can add. Contact an admin to raise the limit.` },
        { status: 403 }
      )
    }
    finalOrganizationId = partner.organizationId
    addedByUserId = actorId ?? null
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const primaryRole = roles[0] ?? 'member'

  const user = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: primaryRole,
        organizationId: finalOrganizationId,
        addedByUserId,
      },
    })
    for (const role of roles) {
      await tx.userRole.create({ data: { userId: u.id, role } })
    }
    return u
  })

  await logTeamAction({
    action: 'user_added',
    actorUserId: actorId ?? undefined,
    targetUserId: user.id,
    metadata: { email: user.email, roles },
  })

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL
  if (!isAdmin(session.user) && adminEmail && resend) {
    try {
      const actorEmail = (session.user as { email?: string }).email
      await resend.emails.send({
        from: 'Roalla Business Enablement Group <noreply@roalla.com>',
        to: [adminEmail],
        subject: 'Partner added a new user',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px;">
              <p>A partner has added a new user to the platform.</p>
              <p><strong>New user:</strong> ${user.email} (${user.name || '—'})</p>
              <p><strong>Added by:</strong> ${actorEmail || 'Unknown'}</p>
              <p>View team at: ${process.env.NEXTAUTH_URL || 'https://www.roalla.com'}/admin/team</p>
              <p>Best regards,<br>Roalla</p>
            </div>
          </div>
        `,
      })
    } catch (e) {
      console.error('Partner add-user notification failed:', e)
    }
  }

  if (sendInviteEmail && resend && user.email) {
    try {
      const loginUrl = `${process.env.NEXTAUTH_URL || 'https://www.roalla.com'}/login`
      await resend.emails.send({
        from: 'Roalla Business Enablement Group <noreply@roalla.com>',
        to: [user.email],
        subject: "You've been invited to the platform",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px;">
              <p>You've been added to the platform.</p>
              <p>Sign in at: <a href="${loginUrl}">${loginUrl}</a></p>
              <p>Use the password that your administrator gave you. We recommend changing it after your first sign-in (Profile or account settings).</p>
              <p>Best regards,<br>Roalla</p>
            </div>
          </div>
        `,
      })
    } catch (e) {
      console.error('Invite email to new user failed:', e)
    }
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    roles,
    createdAt: user.createdAt,
    organizationId: finalOrganizationId,
  })
}
