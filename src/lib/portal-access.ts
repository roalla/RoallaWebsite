/**
 * Portal access: verify token+email and compute which resource/article IDs the user can see.
 * Used by portal content API and file serving.
 * Also supports session-based access for admins and partners (view portal when logged in).
 */
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canAccessAdmin } from '@/lib/access'
import { prisma } from '@/lib/prisma'

export interface PortalViewer {
  email: string
  fullAccess: boolean
  grantedResourceIds: Set<string>
  grantedArticleIds: Set<string>
  bundleResourceIds: Set<string>
  bundleArticleIds: Set<string>
}

async function buildPortalViewerByEmail(
  email: string
): Promise<{ viewer: PortalViewer } | { error: string; status: number }> {
  const normalizedEmail = email.trim().toLowerCase()
  const accessRequest = await prisma.accessRequest.findFirst({
    where: {
      email: normalizedEmail,
      status: 'approved',
    },
    select: { email: true, fullAccess: true },
  })
  if (!accessRequest) {
    return { error: 'Access not approved', status: 401 }
  }

  const [itemGrants, userBundles] = await Promise.all([
    prisma.portalItemGrant.findMany({
      where: { email: normalizedEmail },
      select: { resourceId: true, articleId: true },
    }),
    prisma.userPortalBundle.findMany({
      where: { email: normalizedEmail },
      select: { bundleId: true },
    }),
  ])

  const grantedResourceIds = new Set<string>()
  const grantedArticleIds = new Set<string>()
  for (const g of itemGrants) {
    if (g.resourceId) grantedResourceIds.add(g.resourceId)
    if (g.articleId) grantedArticleIds.add(g.articleId)
  }

  const bundleIds = userBundles.map((b) => b.bundleId)
  const bundleResourceIds = new Set<string>()
  const bundleArticleIds = new Set<string>()
  if (bundleIds.length > 0) {
    const items = await prisma.portalBundleItem.findMany({
      where: { bundleId: { in: bundleIds } },
      select: { resourceId: true, articleId: true },
    })
    for (const i of items) {
      if (i.resourceId) bundleResourceIds.add(i.resourceId)
      if (i.articleId) bundleArticleIds.add(i.articleId)
    }
  }

  return {
    viewer: {
      email: accessRequest.email.toLowerCase(),
      fullAccess: accessRequest.fullAccess ?? false,
      grantedResourceIds,
      grantedArticleIds,
      bundleResourceIds,
      bundleArticleIds,
    },
  }
}

export async function verifyPortalViewer(
  token: string | null,
  email: string | null
): Promise<{ viewer: PortalViewer } | { error: string; status: number }> {
  if (!token?.trim() || !email?.trim()) {
    return { error: 'Token and email are required', status: 400 }
  }
  const accessRequest = await prisma.accessRequest.findFirst({
    where: {
      token: token.trim(),
      email: email.trim().toLowerCase(),
      status: 'approved',
    },
    select: { email: true, fullAccess: true },
  })
  if (!accessRequest) {
    return { error: 'Invalid or expired access token', status: 401 }
  }
  return buildPortalViewerByEmail(accessRequest.email)
}

/** Verify via session. Admin/partner gets full access; approved users get their granted access. */
export async function verifyPortalViewerFromSession(): Promise<
  { viewer: PortalViewer } | { error: string; status: number }
> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  if (canAccessAdmin(session.user)) {
    const email = session.user.email.toLowerCase()
    return {
      viewer: {
        email,
        fullAccess: true,
        grantedResourceIds: new Set(),
        grantedArticleIds: new Set(),
        bundleResourceIds: new Set(),
        bundleArticleIds: new Set(),
      },
    }
  }

  return buildPortalViewerByEmail(session.user.email)
}

/** Verify portal viewer from token+email OR session. Session works for admin/partner. */
export async function verifyPortalViewerFromRequest(
  request: NextRequest
): Promise<{ viewer: PortalViewer } | { error: string; status: number }> {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')?.trim() || null
  const email = searchParams.get('email')?.trim() || null
  const useSession = searchParams.get('session') === '1'

  if (token && email && !useSession) {
    return verifyPortalViewer(token, email)
  }
  if (useSession) {
    return verifyPortalViewerFromSession()
  }
  return { error: 'Token and email are required', status: 400 }
}

/** User can see this resource if: not locked, or has full access, or has grant, or in redeemed bundle */
export function canSeeResource(
  resource: { id: string; lockedByAdmin: boolean },
  viewer: PortalViewer
): boolean {
  if (!resource.lockedByAdmin) return true
  if (viewer.fullAccess) return true
  if (viewer.grantedResourceIds.has(resource.id)) return true
  if (viewer.bundleResourceIds.has(resource.id)) return true
  return false
}

/** User can see this article if: not locked, or has full access, or has grant, or in redeemed bundle */
export function canSeeArticle(
  article: { id: string; lockedByAdmin: boolean },
  viewer: PortalViewer
): boolean {
  if (!article.lockedByAdmin) return true
  if (viewer.fullAccess) return true
  if (viewer.grantedArticleIds.has(article.id)) return true
  if (viewer.bundleArticleIds.has(article.id)) return true
  return false
}
