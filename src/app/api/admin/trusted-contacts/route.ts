import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canAccessAdmin, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

async function requireAdminAccess() {
  const session = await getServerSession(authOptions)
  if (!session || !canAccessAdmin(session.user)) return null
  return session
}

/** List trusted contacts. Partners see their org only; admins see all (optional ?org=slug). */
export async function GET(request: NextRequest) {
  const session = await requireAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const orgSlug = searchParams.get('org')?.trim() || null

    const currentUserId = (session.user as { id?: string }).id
    let organizationId: string | null = null

    if (isAdmin(session.user)) {
      if (orgSlug) {
        const org = await prisma.organization.findFirst({
          where: { OR: [{ slug: orgSlug }, { id: orgSlug }] },
          select: { id: true },
        })
        if (org) organizationId = org.id
      }
    } else {
      const u = currentUserId
        ? await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { organizationId: true },
          })
        : null
      organizationId = u?.organizationId ?? null
      // Partners without an org see no contacts
      if (organizationId == null) {
        return NextResponse.json([])
      }
    }

    const where = organizationId != null ? { organizationId } : {}
    const contacts = await prisma.trustedContact.findMany({
      where,
      orderBy: [{ organization: { name: 'asc' } }, { name: 'asc' }],
      select: {
        id: true,
        organizationId: true,
        name: true,
        email: true,
        company: true,
        serviceOrRole: true,
        url: true,
        linkedInUrl: true,
        notes: true,
        createdByUserId: true,
        createdAt: true,
        updatedAt: true,
        organization: { select: { id: true, name: true, slug: true } },
      },
    })

    const list = contacts.map((c) => ({
      id: c.id,
      organizationId: c.organizationId,
      organizationName: c.organization.name,
      organizationSlug: c.organization.slug,
      name: c.name,
      email: c.email,
      company: c.company,
      serviceOrRole: c.serviceOrRole,
      url: c.url,
      linkedInUrl: c.linkedInUrl,
      notes: c.notes,
      createdByUserId: c.createdByUserId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))

    return NextResponse.json(list)
  } catch (e) {
    console.error('Trusted contacts list error:', e)
    return NextResponse.json({ error: 'Failed to list' }, { status: 500 })
  }
}

/** Add a trusted contact. Partners add to their org only. */
export async function POST(request: NextRequest) {
  const session = await requireAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { name, email, company, serviceOrRole, url, linkedInUrl, notes, organizationId: bodyOrgId } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name and email are required' },
        { status: 400 }
      )
    }

    const currentUserId = (session.user as { id?: string }).id
    let organizationId: string | null = null

    if (isAdmin(session.user)) {
      organizationId = typeof bodyOrgId === 'string' && bodyOrgId.trim() ? bodyOrgId.trim() : null
    } else {
      const u = currentUserId
        ? await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { organizationId: true },
          })
        : null
      organizationId = u?.organizationId ?? null
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Partners must be in an organization to add trusted contacts' },
        { status: 403 }
      )
    }

    const contact = await prisma.trustedContact.create({
      data: {
        organizationId,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        company: company != null ? String(company).trim() || null : null,
        serviceOrRole: serviceOrRole != null ? String(serviceOrRole).trim() || null : null,
        url: url != null ? String(url).trim() || null : null,
        linkedInUrl: linkedInUrl != null ? String(linkedInUrl).trim() || null : null,
        notes: notes != null ? String(notes).trim() || null : null,
        createdByUserId: currentUserId ?? undefined,
      },
    })

    return NextResponse.json(contact)
  } catch (e) {
    console.error('Trusted contact create error:', e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
