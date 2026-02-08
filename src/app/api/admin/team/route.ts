import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcrypt'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const VALID_ROLES = ['admin', 'partner', 'business', 'member'] as const
const MIN_PASSWORD_LENGTH = 8

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      roles: { select: { role: true } },
    },
  })

  const list = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image,
    primaryRole: u.role,
    roles: u.roles.map((r) => r.role),
    createdAt: u.createdAt,
  }))

  return NextResponse.json(list)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { roles?: string[] } | undefined
  if (!session || !currentUser?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const name = typeof body.name === 'string' ? body.name.trim() || null : null
  const password = typeof body.password === 'string' ? body.password : ''
  const roles = Array.isArray(body.roles) ? body.roles.filter((r: string) => VALID_ROLES.includes(r as (typeof VALID_ROLES)[number])) : ['member']

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const primaryRole = roles[0] ?? 'member'

  const user = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: primaryRole,
      },
    })
    for (const role of roles) {
      await tx.userRole.create({ data: { userId: u.id, role } })
    }
    return u
  })

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    roles,
    createdAt: user.createdAt,
  })
}
