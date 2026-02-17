import type { Session } from 'next-auth'

export type SessionUser = Session['user'] & { roles?: string[] }

export function getRoles(user: SessionUser | null | undefined): string[] {
  if (!user) return []
  const u = user as { roles?: string[]; role?: string }
  if (Array.isArray(u.roles)) return u.roles
  if (u.role) return [u.role]
  return []
}

export function isAdmin(user: SessionUser | null | undefined): boolean {
  return getRoles(user).includes('admin')
}

export function isPartner(user: SessionUser | null | undefined): boolean {
  return getRoles(user).includes('partner')
}

/** Can access /admin area (dashboard, portal, team as per nav). */
export function canAccessAdmin(user: SessionUser | null | undefined): boolean {
  const roles = getRoles(user)
  return roles.includes('admin') || roles.includes('partner')
}

/** Can manage portal content (resources + links): view, create, edit. Admins and partners only; business users cannot add content. */
export function canManagePortal(user: SessionUser | null | undefined): boolean {
  return isAdmin(user) || isPartner(user)
}

/** Only admins may delete portal items (resources/links). */
export function canDeletePortalContent(user: SessionUser | null | undefined): boolean {
  return isAdmin(user)
}

/** Can view team and add/edit users (and roles). Delete user is separate. */
export function canManageTeam(user: SessionUser | null | undefined): boolean {
  return canAccessAdmin(user)
}

/** Only admins may delete/remove users. */
export function canDeleteUser(user: SessionUser | null | undefined): boolean {
  return isAdmin(user)
}

/** Partners cannot assign the admin role. */
export function canAssignRole(user: SessionUser | null | undefined, role: string): boolean {
  if (role === 'admin') return isAdmin(user)
  return canManageTeam(user)
}
