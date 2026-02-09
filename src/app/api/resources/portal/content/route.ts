import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgSlug = searchParams.get('org')?.trim() || null

    let organizationId: string | null = null
    let orgName: string | null = null
    if (orgSlug) {
      const org = await prisma.organization.findUnique({
        where: { slug: orgSlug },
        select: { id: true, name: true },
      })
      if (org) {
        organizationId = org.id
        orgName = org.name
      }
    }

    const resourceWhere = organizationId
      ? { OR: [{ organizationId: null }, { organizationId }] }
      : {}
    const articleWhere = organizationId
      ? { OR: [{ organizationId: null }, { organizationId }] }
      : {}

    const [resources, articles] = await Promise.all([
      prisma.portalResource.findMany({
        where: resourceWhere,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.portalArticle.findMany({
        where: articleWhere,
        orderBy: { sortOrder: 'asc' },
      }),
    ])

    const payload: { resources: typeof resources; articles: typeof articles; orgName?: string | null } = {
      resources,
      articles,
    }
    if (orgName) payload.orgName = orgName

    return NextResponse.json(payload)
  } catch (e) {
    console.error('Portal content error:', e)
    return NextResponse.json(
      { error: 'Failed to load portal content' },
      { status: 500 }
    )
  }
}
