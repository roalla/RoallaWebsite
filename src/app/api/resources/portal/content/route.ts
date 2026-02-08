import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [resources, articles] = await Promise.all([
      prisma.portalResource.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.portalArticle.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    ])
    return NextResponse.json({ resources, articles })
  } catch (e) {
    console.error('Portal content error:', e)
    return NextResponse.json(
      { error: 'Failed to load portal content' },
      { status: 500 }
    )
  }
}
