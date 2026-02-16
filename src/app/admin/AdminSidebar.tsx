'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileStack,
  ChevronRight,
  Contact,
  Lock,
  Shield,
  FolderOpen,
  UserCog,
  Gift,
} from 'lucide-react'
import { useViewAs } from './AdminViewAsContext'

export type NavItem = {
  href: string
  label: string
  group: string
  icon: React.ComponentType<{ className?: string }>
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', group: 'Overview', icon: LayoutDashboard },
  { href: '/admin/team', label: 'Team & roles', group: 'People & access', icon: Users },
  { href: '/admin/partner-guide', label: 'Partner guide', group: 'People & access', icon: BookOpen },
  { href: '/admin/portal', label: 'Portal content', group: 'Content', icon: FileStack },
  { href: '/admin/portal-content', label: 'Resources & links', group: 'Content', icon: FolderOpen },
  { href: '/admin/portal-access', label: 'Portal access', group: 'Content', icon: UserCog },
  { href: '/admin/portal-bundles', label: 'Bundles & codes', group: 'Content', icon: Gift },
  { href: '/admin/trusted-contacts', label: 'Trusted contacts', group: 'Trust & compliance', icon: Contact },
  { href: '/admin/trust', label: 'Trust Centre', group: 'Trust & compliance', icon: Lock },
  { href: '/admin/security', label: 'Security', group: 'Settings', icon: Shield },
]

function getNavLinksForRoles(roles: string[]): NavItem[] {
  const isAdmin = roles.includes('admin')
  const isPartner = roles.includes('partner')
  if (roles.length === 0) {
    return ALL_NAV_ITEMS.filter((item) => item.href === '/admin')
  }
  return ALL_NAV_ITEMS.filter((item) => {
    if (item.href === '/admin/partner-guide') return isPartner && !isAdmin
    if (item.href === '/admin/trust' || item.href === '/admin/security') return isAdmin
    if (item.href === '/admin/portal-content' || item.href === '/admin/portal-access' || item.href === '/admin/portal-bundles') return isAdmin
    return true
  })
}

function getGroups(items: NavItem[]): Map<string, NavItem[]> {
  const map = new Map<string, NavItem[]>()
  for (const item of items) {
    const list = map.get(item.group) ?? []
    list.push(item)
    map.set(item.group, list)
  }
  return map
}

export default function AdminSidebar({
  roles = [],
}: {
  roles?: string[]
}) {
  const pathname = usePathname()
  const { viewAsRole } = useViewAs()
  const effectiveRoles = viewAsRole === 'partner' ? ['partner'] : viewAsRole === 'business' ? [] : roles
  const navItems = getNavLinksForRoles(effectiveRoles)
  const groups = getGroups(navItems)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || (href !== '/admin/portal' && pathname.startsWith(href))
  }

  return (
    <aside
      className="hidden lg:flex lg:flex-col w-56 xl:w-64 flex-shrink-0 border-r border-gray-200 bg-white"
      aria-label="Admin navigation"
    >
      <nav className="flex-1 overflow-y-auto py-4">
        {Array.from(groups.entries()).map(([groupName, items]) => (
          <div key={groupName} className="px-3 mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {groupName}
            </h3>
            <ul className="space-y-0.5">
              {items.map((link) => {
                const active = isActive(link.href)
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 opacity-70" />
                      <span className="flex-1 truncate">{link.label}</span>
                      <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-50" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
