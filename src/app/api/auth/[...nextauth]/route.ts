import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

/** Wrap handler so session/config errors don't 500 the whole site (e.g. missing NEXTAUTH_SECRET in prod). */
async function wrappedGet(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    return await handler(req, context)
  } catch (err) {
    console.error('[NextAuth] GET error:', err)
    const url = req.url || ''
    if (url.includes('/api/auth/session')) {
      return NextResponse.json({ session: null })
    }
    return NextResponse.json(
      { error: 'Auth configuration error. Set NEXTAUTH_SECRET and NEXTAUTH_URL in production.' },
      { status: 500 }
    )
  }
}

async function wrappedPost(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    return await handler(req, context)
  } catch (err) {
    console.error('[NextAuth] POST error:', err)
    return NextResponse.json(
      { error: 'Auth configuration error. Set NEXTAUTH_SECRET and NEXTAUTH_URL in production.' },
      { status: 500 }
    )
  }
}

export { wrappedGet as GET, wrappedPost as POST }
