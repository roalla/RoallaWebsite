import type { HubRole } from '@/lib/hub/roles'

export type HubModule =
  | 'dashboard'
  | 'customers'
  | 'playbooks'
  | 'partners'
  | 'lessons'
  | 'tools'

const ROLE_MODULES: Record<HubRole, HubModule[]> = {
  admin: ['dashboard', 'customers', 'playbooks', 'partners', 'lessons', 'tools'],
  employee: ['dashboard', 'customers', 'playbooks', 'partners', 'lessons', 'tools'],
  contractor: ['dashboard', 'customers', 'playbooks', 'lessons'],
  partner: ['dashboard', 'partners', 'lessons'],
}

export function canAccessModule(role: HubRole, module: HubModule): boolean {
  return ROLE_MODULES[role]?.includes(module) ?? false
}

export function canWritePlaybooks(role: HubRole): boolean {
  return role === 'admin' || role === 'employee' || role === 'contractor'
}

export function canManageCustomers(role: HubRole): boolean {
  return role === 'admin' || role === 'employee'
}

export function canViewAllCustomers(role: HubRole): boolean {
  return role === 'admin' || role === 'employee'
}

export function canManageLessons(role: HubRole): boolean {
  return role === 'admin' || role === 'employee'
}

export function canManagePartners(role: HubRole): boolean {
  return role === 'admin' || role === 'employee'
}
