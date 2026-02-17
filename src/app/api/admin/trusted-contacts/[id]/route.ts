import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { SessionUser } from '@/lib/access'
import { canAccessAdmin, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

async function requireAdminAccess() {
  const session = await getServerSession(authOptions)
  if (!session || !canAccessAdmin(session.user)) return null
  return session
}

/** Partner can only edit/delete contacts in their org. */
async function canModifyContact(contactId: string, session: { user: SessionUser }) {
  const contact = await prisma.trustedContact.findUnique({
    where: { id: contactId },
    select: { organizationId: true },
  })
  if (!contact) return null
  if (isAdmin(session.user)) return contact
  const currentUserId = (session.user as { id?: string }).id
  const u = currentUserId
    ? await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { organizationId: true },
      })
    : null
  if (u?.organizationId !== contact.organizationId) return null
  return contact
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const allowed = await canModifyContact(id, session)
  if (!allowed) {
    return NextResponse.json({ error: 'Not found or you cannot edit this contact' }, { status: 404 })
  }
  try {
    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (body.name != null) data.name = String(body.name).trim()
    if (body.email != null) data.email = String(body.email).trim().toLowerCase()
    if (body.company !== undefined) data.company = body.company ? String(body.company).trim() : null
    if (body.serviceOrRole !== undefined) data.serviceOrRole = body.serviceOrRole ? String(body.serviceOrRole).trim() : null
    if (body.url !== undefined) data.url = body.url ? String(body.url).trim() : null
    if (body.linkedInUrl !== undefined) data.linkedInUrl = body.linkedInUrl ? String(body.linkedInUrl).trim() : null
    if (body.notes !== undefined) data.notes = body.notes ? String(body.notes).trim() : null
    if (body.tags !== undefined) {
      const tagsArr = Array.isArray(body.tags) ? body.tags.filter((t: unknown): t is string => typeof t === 'string').map((t) => t.trim()).filter(Boolean) : []
      data.tags = tagsArr
    }
    const contact = await prisma.trustedContact.update({
      where: { id },
      data,
    })
    return NextResponse.json(contact)
  } catch (e) {
    console.error('Trusted contact update error:', e)
    return NextResponse.json({ error: 'Not found or update failed' }, { status: 404 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const allowed = await canModifyContact(id, session)
  if (!allowed) {
    return NextResponse.json({ error: 'Not found or you cannot delete this contact' }, { status: 404 })
  }
  try {
    await prisma.trustedContact.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Trusted contact delete error:', e)
    return NextResponse.json({ error: 'Not found or delete failed' }, { status: 404 })
  }
}
