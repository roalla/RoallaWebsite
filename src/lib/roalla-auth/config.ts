function trimEnv(value: string | undefined): string {
  let v = (value || '').trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim()
  }
  return v.replace(/\/$/, '')
}

export function publicAppOriginUrl(): string {
  const url =
    trimEnv(process.env.APP_URL) ||
    trimEnv(process.env.LOCAL_DEV_URL) ||
    trimEnv(process.env.NEXT_PUBLIC_APP_URL) ||
    'http://localhost:3000'
  return url.replace(/\/$/, '')
}

export function roallaAuthHubUrl(): string {
  return trimEnv(process.env.AUTH_HUB_URL) || trimEnv(process.env.AUTH_URL)
}

export function roallaAuthClientId(): string {
  return trimEnv(process.env.AUTH_CLIENT_ID)
}

export function authConfigured(): boolean {
  return !!(roallaAuthHubUrl() && roallaAuthClientId())
}

/** Safe diagnostics for admin UI when auth is not configured (no secret values). */
export function authConfigStatus() {
  return {
    hasAuthUrl: !!(process.env.AUTH_HUB_URL?.trim() || process.env.AUTH_URL?.trim()),
    hasAuthClientId: !!process.env.AUTH_CLIENT_ID?.trim(),
    hasAppUrl: !!(
      process.env.APP_URL?.trim() ||
      process.env.LOCAL_DEV_URL?.trim() ||
      process.env.NEXT_PUBLIC_APP_URL?.trim()
    ),
  }
}
