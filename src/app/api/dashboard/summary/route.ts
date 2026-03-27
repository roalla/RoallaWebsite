import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email?.toLowerCase()
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [user, latestAccessRequest, latestPortalAccess, recentLogs, bundleStats, grantCount] = await Promise.all([
      prisma.user.findUnique({
        where: { email },
        select: { lastLoginAt: true, createdAt: true },
      }),
      prisma.accessRequest.findFirst({
        where: { email },
        orderBy: { updatedAt: 'desc' },
        select: { status: true, createdAt: true, updatedAt: true, fullAccess: true },
      }),
      prisma.portalAccessLog.findFirst({
        where: { email },
        orderBy: { accessedAt: 'desc' },
        select: { accessedAt: true, action: true },
      }),
      prisma.portalAccessLog.findMany({
        where: { email },
        orderBy: { accessedAt: 'desc' },
        take: 5,
        select: {
          action: true,
          accessedAt: true,
          resourceId: true,
          articleId: true,
        },
      }),
      prisma.userPortalBundle.aggregate({
        where: { email },
        _count: true,
        _max: { redeemedAt: true },
      }),
      prisma.portalItemGrant.count({
        where: { email },
      }),
    ])

    const resourceIds = recentLogs.map((l) => l.resourceId).filter(Boolean) as string[]
    const articleIds = recentLogs.map((l) => l.articleId).filter(Boolean) as string[]

    const [resourceTitles, articleTitles] = await Promise.all([
      resourceIds.length > 0
        ? prisma.portalResource.findMany({
            where: { id: { in: resourceIds } },
            select: { id: true, title: true },
          })
        : Promise.resolve([]),
      articleIds.length > 0
        ? prisma.portalArticle.findMany({
            where: { id: { in: articleIds } },
            select: { id: true, title: true },
          })
        : Promise.resolve([]),
    ])

    const resourceTitleMap = new Map(resourceTitles.map((r) => [r.id, r.title]))
    const articleTitleMap = new Map(articleTitles.map((a) => [a.id, a.title]))

    return NextResponse.json({
      email,
      access: latestAccessRequest
        ? {
            status: latestAccessRequest.status,
            fullAccess: latestAccessRequest.fullAccess,
            requestedAt: latestAccessRequest.createdAt,
            updatedAt: latestAccessRequest.updatedAt,
          }
        : null,
      activity: {
        lastLoginAt: user?.lastLoginAt ?? null,
        accountCreatedAt: user?.createdAt ?? null,
        lastPortalActionAt: latestPortalAccess?.accessedAt ?? null,
        lastPortalAction: latestPortalAccess?.action ?? null,
      },
      portal: {
        bundlesRedeemed: bundleStats._count,
        lastBundleRedeemedAt: bundleStats._max.redeemedAt ?? null,
        grantedItemsCount: grantCount,
      },
      recentActions: recentLogs.map((log) => ({
        action: log.action,
        at: log.accessedAt,
        resourceId: log.resourceId,
        articleId: log.articleId,
        itemTitle: log.resourceId
          ? resourceTitleMap.get(log.resourceId) ?? null
          : log.articleId
            ? articleTitleMap.get(log.articleId) ?? null
            : null,
      })),
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json({ error: 'Failed to load dashboard summary' }, { status: 500 })
  }
}
