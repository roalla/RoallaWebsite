import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeRichText } from '@/lib/sanitize-html'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return null
  }
  return session
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const items = await prisma.portalResource.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(items)
  } catch (e) {
    console.error('Portal resources list error:', e)
    return NextResponse.json({ error: 'Failed to list' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, description, type, downloadUrl, linkUrl, color, sortOrder, gated } = body
    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'title, description, and type are required' },
        { status: 400 }
      )
    }
    const item = await prisma.portalResource.create({
      data: {
        title: String(title).trim(),
        description: sanitizeRichText(String(description ?? '')),
        type: String(type).trim(),
        downloadUrl: downloadUrl != null ? String(downloadUrl).trim() || null : null,
        linkUrl: linkUrl != null ? String(linkUrl).trim() || null : null,
        color: color != null ? String(color).trim() : 'from-blue-500 to-blue-600',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        gated: typeof gated === 'boolean' ? gated : false,
      },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error('Portal resource create error:', e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
