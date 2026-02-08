import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function requireAdmin() {
  return getServerSession(authOptions).then((session) => {
    const user = session?.user as { roles?: string[] } | undefined
    if (!session || !user?.roles?.includes('admin')) return null
    return session
  })
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const agreement = await prisma.ndaAgreement.findFirst({
    orderBy: { effectiveAt: 'desc' },
  })
  return NextResponse.json(agreement ?? { agreement: null })
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const title = typeof body.title === 'string' ? body.title.trim() : 'NDA'
  const bodyText = typeof body.body === 'string' ? body.body : ''
  const version = typeof body.version === 'string' ? body.version.trim() : '1.0'
  const agreement = await prisma.ndaAgreement.create({
    data: { title, body: bodyText, version },
  })
  return NextResponse.json(agreement)
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const id = typeof body.id === 'string' ? body.id : null
  if (!id) return NextResponse.json({ error: 'Agreement ID required' }, { status: 400 })
  const title = typeof body.title === 'string' ? body.title.trim() : undefined
  const bodyText = typeof body.body === 'string' ? body.body : undefined
  const version = typeof body.version === 'string' ? body.version.trim() : undefined
  const agreement = await prisma.ndaAgreement.update({
    where: { id },
    data: { ...(title != null && { title }), ...(bodyText != null && { body: bodyText }), ...(version != null && { version }) },
  })
  return NextResponse.json(agreement)
}
