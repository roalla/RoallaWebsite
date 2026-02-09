import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeRichText } from '@/lib/sanitize-html'
import { canManagePortal, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

async function requirePortalAccess() {
  const session = await getServerSession(authOptions)
  if (!session || !canManagePortal(session.user)) return null
  return session
}

export async function GET() {
  const session = await requirePortalAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const items = await prisma.portalArticle.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, description: true, readTime: true, category: true, url: true, sortOrder: true, gated: true, createdByUserId: true, createdAt: true, updatedAt: true },
    })
    const currentUserId = (session.user as { id?: string }).id
    const list = items.map((item) => ({
      ...item,
      canEdit: isAdmin(session.user) || item.createdByUserId == null || item.createdByUserId === currentUserId,
    }))
    return NextResponse.json(list)
  } catch (e) {
    console.error('Portal articles list error:', e)
    return NextResponse.json({ error: 'Failed to list' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePortalAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, description, readTime, category, url, sortOrder, gated } = body
    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      )
    }
    const currentUserId = (session.user as { id?: string }).id
    const item = await prisma.portalArticle.create({
      data: {
        title: String(title).trim(),
        description: sanitizeRichText(String(description ?? '')),
        readTime: readTime != null ? String(readTime).trim() || null : null,
        category: category != null ? String(category).trim() || null : null,
        url: url != null ? String(url).trim() || null : null,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        gated: typeof gated === 'boolean' ? gated : false,
        createdByUserId: currentUserId ?? undefined,
      },
    })
    return NextResponse.json({ ...item, canEdit: true })
  } catch (e) {
    console.error('Portal article create error:', e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
