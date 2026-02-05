import { NextRequest, NextResponse } from 'next/server'
import { accessRequests } from '@/lib/access-requests'

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

    // Find matching access request
    let found = false
    for (const [requestId, request] of accessRequests.entries()) {
      if (request.token === token && request.email.toLowerCase() === email.toLowerCase() && request.status === 'approved') {
        found = true
        break
      }
    }

    if (found) {
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
