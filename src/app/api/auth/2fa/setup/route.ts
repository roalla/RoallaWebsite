import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { authenticator } from 'otplib'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[]; id?: string; email?: string } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { twoFactorEnabled: true, twoFactorSecret: true },
  })
  if (dbUser?.twoFactorEnabled) {
    return NextResponse.json({ error: '2FA already enabled' }, { status: 400 })
  }

  const secret = authenticator.generateSecret()
  const appName = 'Roalla Admin'
  const account = user.email ?? user.id
  const otpauth = authenticator.keyuri(account, appName, secret)

  return NextResponse.json({ secret, otpauth })
}
