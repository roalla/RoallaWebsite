import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type')
  const id = request.nextUrl.searchParams.get('id')
  const token = request.nextUrl.searchParams.get('token')

  if (type !== 'resource' && type !== 'article') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  let email: string | null = null
  if (token) {
    const tc = await prisma.trustCenterToken.findUnique({
      where: { token },
    })
    if (tc && tc.expiresAt > new Date()) email = tc.email
  }

  if (!email) {
    return NextResponse.json({ error: 'Access token required or expired. Use the link from your approval email.' }, { status: 401 })
  }

  if (type === 'resource') {
    const resource = await prisma.portalResource.findUnique({ where: { id } })
    if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!resource.gated) {
      if (resource.downloadUrl) return NextResponse.redirect(resource.downloadUrl)
      return NextResponse.json({ error: 'No download URL' }, { status: 404 })
    }
    const grant = await prisma.gatedAccessGrant.findFirst({
      where: { email, resourceId: id, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    })
    if (!grant) return NextResponse.json({ error: 'Access not granted for this document' }, { status: 403 })
    if (resource.downloadUrl) return NextResponse.redirect(resource.downloadUrl)
    return NextResponse.json({ error: 'No download URL' }, { status: 404 })
  }

  const article = await prisma.portalArticle.findUnique({ where: { id } })
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!article.gated) {
    if (article.url) return NextResponse.redirect(article.url)
    return NextResponse.json({ error: 'No URL' }, { status: 404 })
  }
  const grant = await prisma.gatedAccessGrant.findFirst({
    where: { email, articleId: id, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
  })
  if (!grant) return NextResponse.json({ error: 'Access not granted for this document' }, { status: 403 })
  if (article.url) return NextResponse.redirect(article.url)
  return NextResponse.json({ error: 'No URL' }, { status: 404 })
}
