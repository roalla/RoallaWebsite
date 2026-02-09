import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/** Returns JSON list of { title, url } for all documents the token holder has access to. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }
  const tc = await prisma.trustCenterToken.findUnique({ where: { token } })
  if (!tc || tc.expiresAt <= new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }
  const email = tc.email
  const grants = await prisma.gatedAccessGrant.findMany({
    where: { email, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
  })
  const resourceIds = grants.map((g) => g.resourceId).filter(Boolean) as string[]
  const articleIds = grants.map((g) => g.articleId).filter(Boolean) as string[]
  const [resources, articles] = await Promise.all([
    prisma.portalResource.findMany({ where: { id: { in: resourceIds } }, select: { id: true, title: true, downloadUrl: true, linkUrl: true } }),
    prisma.portalArticle.findMany({ where: { id: { in: articleIds } }, select: { id: true, title: true, url: true } }),
  ])
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.roalla.com'
  const links: { title: string; url: string }[] = []
  for (const r of resources) {
    if (r.downloadUrl) links.push({ title: r.title, url: `${baseUrl}/api/trust/download?type=resource&id=${r.id}&token=${encodeURIComponent(token)}` })
    else if (r.linkUrl) links.push({ title: r.title, url: r.linkUrl })
  }
  for (const a of articles) {
    links.push({ title: a.title, url: a.url ? a.url : `${baseUrl}/api/trust/download?type=article&id=${a.id}&token=${encodeURIComponent(token)}` })
  }
  return NextResponse.json({ links })
}
