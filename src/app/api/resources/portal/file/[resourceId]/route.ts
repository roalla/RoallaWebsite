import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPortalViewerFromRequest, canSeeResource } from '@/lib/portal-access'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params
    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 })
    }
    const { searchParams } = new URL(request.url)
    const disposition = searchParams.get('disposition') === 'attachment' ? 'attachment' : 'inline'

    const verified = await verifyPortalViewerFromRequest(request)
    if ('error' in verified) {
      return NextResponse.json({ error: verified.error }, { status: verified.status })
    }
    const { viewer } = verified

    const resource = await prisma.portalResource.findUnique({
      where: { id: resourceId },
      select: {
        id: true,
        title: true,
        downloadUrl: true,
        lockedByAdmin: true,
        viewOnly: true,
      },
    })
    if (!resource || !resource.downloadUrl) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    if (!canSeeResource({ id: resource.id, lockedByAdmin: resource.lockedByAdmin ?? false }, viewer)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    if (resource.viewOnly && disposition === 'attachment') {
      return NextResponse.json({ error: 'This resource is view-only' }, { status: 403 })
    }

    await prisma.portalAccessLog.create({
      data: {
        email: viewer.email,
        resourceId: resource.id,
        action: disposition === 'attachment' ? 'download' : 'view',
      },
    })

    const url = resource.downloadUrl.trim()
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const res = await fetch(url, { redirect: 'follow' })
      if (!res.ok) {
        return NextResponse.json({ error: 'File unavailable' }, { status: 502 })
      }
      const contentType = res.headers.get('content-type') || 'application/octet-stream'
      const headers = new Headers()
      headers.set('Content-Type', contentType)
      headers.set('Content-Disposition', `${disposition}; filename="${encodeURIComponent(resource.title || 'file')}"`)
      headers.set('Cache-Control', 'private, no-store')
      const blob = await res.blob()
      return new NextResponse(blob, { status: 200, headers })
    }

    const relativePath = url.startsWith('/') ? url.slice(1) : url
    const publicDir = path.join(process.cwd(), 'public')
    const filePath = path.resolve(publicDir, relativePath)
    if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    const buf = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const mime: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    const contentType = mime[ext] || 'application/octet-stream'
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Disposition', `${disposition}; filename="${encodeURIComponent(resource.title || path.basename(filePath))}"`)
    headers.set('Cache-Control', 'private, no-store')
    return new NextResponse(buf, { status: 200, headers })
  } catch (e) {
    console.error('Portal file serve error:', e)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
