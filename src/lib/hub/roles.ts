export type HubRole = 'employee' | 'contractor' | 'partner' | 'admin'

const ROALLA_DOMAIN = '@roalla.com'

/** Comma-separated list from HUB_ADMIN_EMAIL env var. */
export function getHubAdminEmails(): string[] {
  const raw = process.env.HUB_ADMIN_EMAIL || ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isHubAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return false
  const admins = getHubAdminEmails()
  return admins.length > 0 && admins.includes(normalized)
}

export function defaultRoleForEmail(email: string): HubRole {
  if (isHubAdminEmail(email)) return 'admin'
  const normalized = email.trim().toLowerCase()
  if (normalized.endsWith(ROALLA_DOMAIN)) return 'employee'
  return 'contractor'
}

export function isRoallaEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(ROALLA_DOMAIN)
}

export function getHubAdminEmailDisplay(): string {
  return getHubAdminEmails()[0] || ''
}
