'use client'

const COOKIE_NAME = 'admin_view_as'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

export type ViewAsRole = '' | 'partner' | 'business'

export function getViewAsCookie(): ViewAsRole {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`))
  const value = match ? decodeURIComponent(match[1]).toLowerCase() : ''
  if (value === 'partner' || value === 'business') return value
  return ''
}

export function setViewAsCookie(role: ViewAsRole) {
  if (typeof document === 'undefined') return
  if (role === '') {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
    return
  }
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(role)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}
