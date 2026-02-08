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
    const items = await prisma.portalArticle.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(items)
  } catch (e) {
    console.error('Portal articles list error:', e)
    return NextResponse.json({ error: 'Failed to list' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, description, readTime, category, url, sortOrder } = body
    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      )
    }
    const item = await prisma.portalArticle.create({
      data: {
        title: String(title).trim(),
        description: sanitizeRichText(String(description ?? '')),
        readTime: readTime != null ? String(readTime).trim() || null : null,
        category: category != null ? String(category).trim() || null : null,
        url: url != null ? String(url).trim() || null : null,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error('Portal article create error:', e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
