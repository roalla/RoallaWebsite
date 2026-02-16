'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileStack,
  ChevronRight,
  ChevronLeft,
  Contact,
  Lock,
  Shield,
  UserCog,
  Gift,
} from 'lucide-react'
import { useViewAs } from './AdminViewAsContext'

const COLLAPSED_KEY = 'admin-sidebar-collapsed'

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
  { href: '/admin/portal-access', label: 'Portal access', group: 'People & access', icon: UserCog },
  { href: '/admin/portal', label: 'Portal', group: 'Content', icon: FileStack },
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
    if (item.href === '/admin/portal-access' || item.href === '/admin/portal-bundles') return isAdmin
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
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_KEY)
      if (stored !== null) setCollapsed(stored === 'true')
    } catch {
      /* ignore */
    }
  }, [])

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(COLLAPSED_KEY, String(next))
    } catch {
      /* ignore */
    }
  }

  const effectiveRoles = viewAsRole === 'partner' ? ['partner'] : viewAsRole === 'business' ? [] : roles
  const navItems = getNavLinksForRoles(effectiveRoles)
  const groups = getGroups(navItems)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    if (href === '/admin/portal') return pathname === '/admin/portal'
    if (href === '/admin/trust') return pathname === '/admin/trust' || pathname.startsWith('/admin/trust/')
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside
      className={`hidden lg:flex lg:flex-col flex-shrink-0 border-r border-gray-200 bg-white transition-[width] duration-200 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-56 xl:w-64'
      }`}
      aria-label="Admin navigation"
    >
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        {Array.from(groups.entries()).map(([groupName, items]) => (
          <div key={groupName} className={`px-3 mb-6 ${collapsed ? 'px-0' : ''}`}>
            {!collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                {groupName}
              </h3>
            )}
            <ul className="space-y-0.5">
              {items.map((link) => {
                const active = isActive(link.href)
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      title={collapsed ? link.label : undefined}
                      className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                        collapsed ? 'justify-center px-0 py-2.5 mx-2' : 'gap-3 px-3 py-2.5'
                      } ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 opacity-70" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{link.label}</span>
                          <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-50" />
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <button
        type="button"
        onClick={toggleCollapsed}
        className="flex items-center justify-center w-full py-3 border-t border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  )
}
