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
  return /^\/(en|fr)\/auth\/callback/.test(pathname) || pathname === '/auth/callback'
}

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Normalize /auth/callback → /en/auth/callback (preserve query — OAuth code)
  if (pathname === '/auth/callback') {
    const url = request.nextUrl.clone()
    url.pathname = '/en/auth/callback'
    return NextResponse.redirect(url)
  }

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

  const response = intlMiddleware(request)
  alignXDefaultHreflang(response)
  return response
}

/** next-intl sets x-default to the unprefixed path, which 307s to /en. Point it at the English URL. */
function alignXDefaultHreflang(response: NextResponse) {
  const link = response.headers.get('link')
  if (!link || !/hreflang="x-default"/i.test(link)) return

  const english = link.match(/<([^>]+)>;\s*rel="alternate";\s*hreflang="en"/i)
  if (!english) return

  const aligned = link.replace(
    /<[^>]+>;\s*rel="alternate";\s*hreflang="x-default"/i,
    `<${english[1]}>; rel="alternate"; hreflang="x-default"`,
  )
  if (aligned !== link) response.headers.set('link', aligned)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
