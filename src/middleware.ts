import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const REFRESH_COOKIE = 'roalla_refresh'
const ACCESS_COOKIE = 'roalla_access'

function hasAuthSession(request: NextRequest): boolean {
  return !!(
    request.cookies.get(REFRESH_COOKIE)?.value || request.cookies.get(ACCESS_COOKIE)?.value
  )
}

function isHubProtectedPath(pathname: string): boolean {
  return /^\/(en|fr)\/hub(\/|$)/.test(pathname) && !pathname.includes('/hub/login')
}

function isAuthCallbackPath(pathname: string): boolean {
  return /^\/(en|fr)\/auth\/callback/.test(pathname)
}

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Stray OAuth code → auth callback
  if (searchParams.has('code') && !isAuthCallbackPath(pathname)) {
    const localeMatch = pathname.match(/^\/(en|fr)/)
    const locale = localeMatch?.[1] || routing.defaultLocale
    const callback = new URL(`/${locale}/auth/callback`, request.url)
    searchParams.forEach((value, key) => callback.searchParams.set(key, value))
    if (!callback.searchParams.has('return')) {
      callback.searchParams.set('return', `/${locale}/hub`)
    }
    return NextResponse.redirect(callback)
  }

  // Protect hub routes
  if (isHubProtectedPath(pathname) && !hasAuthSession(request)) {
    const localeMatch = pathname.match(/^\/(en|fr)/)
    const locale = localeMatch?.[1] || routing.defaultLocale
    const login = new URL(`/${locale}/hub/login`, request.url)
    login.searchParams.set('return', pathname)
    return NextResponse.redirect(login)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
