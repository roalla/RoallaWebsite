import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeRichText } from '@/lib/sanitize-html'
import { canManagePortal, canDeletePortalContent, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

async function requirePortalAccess() {
  const session = await getServerSession(authOptions)
  if (!session || !canManagePortal(session.user)) return null
  return session
}

async function requirePortalDelete() {
  const session = await getServerSession(authOptions)
  if (!session || !canDeletePortalContent(session.user)) return null
  return session
}

function partnerCanEditItem(createdByUserId: string | null, currentUserId: string | undefined): boolean {
  return createdByUserId == null || createdByUserId === currentUserId
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requirePortalAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const existing = await prisma.portalArticle.findUnique({ where: { id }, select: { createdByUserId: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!isAdmin(session.user) && !partnerCanEditItem(existing.createdByUserId, (session.user as { id?: string }).id)) {
    return NextResponse.json({ error: 'You can only edit content you created' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (body.title != null) data.title = String(body.title).trim()
    if (body.description != null) data.description = sanitizeRichText(String(body.description))
    if (body.readTime != null) data.readTime = body.readTime ? String(body.readTime).trim() : null
    if (body.category != null) data.category = body.category ? String(body.category).trim() : null
    if (body.url != null) data.url = body.url ? String(body.url).trim() : null
    if (typeof body.sortOrder === 'number') data.sortOrder = body.sortOrder
    if (typeof body.gated === 'boolean') data.gated = body.gated
    if (body.trustCategory !== undefined) data.trustCategory = body.trustCategory ? String(body.trustCategory).trim() : null
    if (isAdmin(session.user) && body.organizationId !== undefined)
      data.organizationId = body.organizationId === null || body.organizationId === '' ? null : String(body.organizationId).trim()
    const item = await prisma.portalArticle.update({
      where: { id },
      data,
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error('Portal article update error:', e)
    return NextResponse.json({ error: 'Not found or update failed' }, { status: 404 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requirePortalDelete())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  try {
    await prisma.portalArticle.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Portal article delete error:', e)
    return NextResponse.json({ error: 'Not found or delete failed' }, { status: 404 })
  }
}
