import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canAccessAdmin } from '@/lib/access'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const useSession = searchParams.get('session') === '1'

    if (useSession && !token) {
      const session = await getServerSession(authOptions)
      if (session?.user?.email && canAccessAdmin(session.user)) {
        return NextResponse.json({
          authenticated: true,
          email: session.user.email,
          session: true,
        })
      }
      return NextResponse.json(
        { error: 'Not logged in as admin or partner' },
        { status: 401 }
      )
    }

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required' },
        { status: 400 }
      )
    }

    const accessRequest = await prisma.accessRequest.findFirst({
      where: {
        token,
        email: email.toLowerCase(),
        status: 'approved',
      },
    })

    if (accessRequest) {
      return NextResponse.json({
        authenticated: true,
        email,
      })
    }

    return NextResponse.json(
      { error: 'Invalid or expired access token' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error verifying access:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
