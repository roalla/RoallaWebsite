export function publicAppOriginUrl(): string {
  const url = process.env.APP_URL || process.env.LOCAL_DEV_URL || 'http://localhost:3000'
  return url.replace(/\/$/, '')
}

export function roallaAuthHubUrl(): string {
  return (process.env.AUTH_URL || '').replace(/\/$/, '')
}

export function roallaAuthClientId(): string {
  return process.env.AUTH_CLIENT_ID || ''
}

export function authConfigured(): boolean {
  return !!(roallaAuthHubUrl() && roallaAuthClientId())
}
