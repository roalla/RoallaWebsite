import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)
const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => {
      const roles = (token?.roles as string[] | undefined) ?? (token?.role ? [token.role as string] : [])
      return roles.includes('admin') || roles.includes('partner')
    },
  },
  pages: { signIn: '/login' },
})

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/admin')) {
    const result = await authMiddleware(req as NextRequestWithAuth, event)
    // Use /dashboard as callback so role-based redirect happens there (avoids
    // business users being sent to /admin and bouncing back to login).
    if (result instanceof NextResponse && result.status === 307) {
      const loc = result.headers.get('location')
      if (loc?.includes('/login')) {
        const signInUrl = new URL(loc, req.url)
        signInUrl.searchParams.set('callbackUrl', '/dashboard')
        return NextResponse.redirect(signInUrl)
      }
    }
    return result
  }

  // Skip i18n for API, auth, login, profile, password flows
  const skipLocale =
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/p/')

  if (skipLocale) {
    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/admin/:path*'],
}
