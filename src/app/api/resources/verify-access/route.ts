import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required' },
        { status: 400 }
      )
    }

    // Find matching access request in database
    const accessRequest = await prisma.accessRequest.findFirst({
      where: {
        token: token,
        email: email.toLowerCase(),
        status: 'approved'
      }
    })

    if (accessRequest) {
      return NextResponse.json({
        authenticated: true,
        email: email
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
