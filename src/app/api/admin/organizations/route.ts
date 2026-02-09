import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const list = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  })
  return NextResponse.json(list)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const slug = typeof body.slug === 'string' ? body.slug.trim() || null : null
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  const org = await prisma.organization.create({
    data: { name, slug },
  })
  return NextResponse.json(org)
}
