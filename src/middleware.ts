import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import {
  buildContentSecurityPolicy,
  createNonce,
  CROSS_ORIGIN_OPENER_POLICY,
  STRICT_TRANSPORT_SECURITY,
} from '@/lib/security-headers'

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

function withSecurityHeaders(response: NextResponse, csp: string) {
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('Cross-Origin-Opener-Policy', CROSS_ORIGIN_OPENER_POLICY)
  // Browsers ignore HSTS on plain HTTP, including localhost.
  response.headers.set('Strict-Transport-Security', STRICT_TRANSPORT_SECURITY)
  return response
}

export default function middleware(request: NextRequest) {
  const nonce = createNonce()
  const csp = buildContentSecurityPolicy(nonce, {
    development: process.env.NODE_ENV === 'development',
  })
  const { pathname, searchParams } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('x-pathname', pathname)
  requestHeaders.set('Content-Security-Policy', csp)
  const secureRequest = new NextRequest(request, { headers: requestHeaders })

  // Normalize /auth/callback → /en/auth/callback (preserve query — OAuth code)
  if (pathname === '/auth/callback') {
    const url = secureRequest.nextUrl.clone()
    url.pathname = '/en/auth/callback'
    return withSecurityHeaders(NextResponse.redirect(url), csp)
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
    return withSecurityHeaders(NextResponse.redirect(callback), csp)
  }

  // Protect hub routes
  if (isHubProtectedPath(pathname) && !hasAuthSession(secureRequest)) {
    const localeMatch = pathname.match(/^\/(en|fr)/)
    const locale = localeMatch?.[1] || routing.defaultLocale
    const login = new URL(`/${locale}/hub/login`, secureRequest.url)
    login.searchParams.set('return', pathname)
    return withSecurityHeaders(NextResponse.redirect(login), csp)
  }

  const response = intlMiddleware(secureRequest)
  alignXDefaultHreflang(response)
  return withSecurityHeaders(response, csp)
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
