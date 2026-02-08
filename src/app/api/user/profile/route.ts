import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { id?: string } | undefined
  if (!session || !user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() || null : undefined
    const image = typeof body.image === 'string' ? body.image.trim() || null : undefined

    const data: { name?: string | null; image?: string | null } = {}
    if (name !== undefined) data.name = name
    if (image !== undefined) data.image = image

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    })

    return NextResponse.json({
      name: updated.name,
      image: updated.image,
    })
  } catch (e) {
    console.error('Profile update error:', e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
