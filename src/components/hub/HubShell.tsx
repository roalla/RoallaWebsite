'use client'

import { useState } from 'react'
import Script from 'next/script'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  BookOpen,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Users,
  Handshake,
  Lightbulb,
} from 'lucide-react'
import type { HubRole } from '@/lib/hub/roles'
import { canAccessModule } from '@/lib/hub/permissions'
import { clientSignOut } from '@/lib/roalla-auth/client-sign-out'

type NavItem = {
  href:
    | '/hub'
    | '/hub/customers'
    | '/hub/playbooks'
    | '/hub/partners'
    | '/hub/lessons'
    | '/hub/recommendations'
    | '/hub/tools'
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  module: Parameters<typeof canAccessModule>[1]
}

const NAV_ITEMS: NavItem[] = [
  { href: '/hub', labelKey: 'navDashboard', icon: LayoutDashboard, module: 'dashboard' },
  { href: '/hub/customers', labelKey: 'navCustomers', icon: Users, module: 'customers' },
  { href: '/hub/playbooks', labelKey: 'navPlaybooks', icon: BookOpen, module: 'playbooks' },
  { href: '/hub/partners', labelKey: 'navPartners', icon: Handshake, module: 'partners' },
  { href: '/hub/lessons', labelKey: 'navLessons', icon: Lightbulb, module: 'lessons' },
  { href: '/hub/recommendations', labelKey: 'navRecommendations', icon: ClipboardList, module: 'recommendations' },
  { href: '/hub/tools', labelKey: 'navTools', icon: ExternalLink, module: 'tools' },
]

type Props = {
  children: React.ReactNode
  userName: string
  userEmail: string
  role: HubRole
  locale: string
}

export default function HubShell({ children, userName, userEmail, role, locale }: Props) {
  const t = useTranslations('hub')
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await clientSignOut()
    } finally {
      window.location.href = `/${locale}/hub/login`
    }
  }

  const visibleNav = NAV_ITEMS.filter((item) => canAccessModule(role, item.module))

  const signOutButton = (
    <button
      type="button"
      onClick={() => signOut()}
      disabled={signingOut}
      className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50 min-h-[44px]"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {signingOut ? t('signingOut') : t('signOut')}
    </button>
  )

  return (
    <>
      <Script src="/app-auth.js" strategy="afterInteractive" />
      <div className="min-h-screen bg-slate-50 flex">
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
          <div className="p-6 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Roalla</p>
            <h1 className="text-lg font-bold text-slate-900">{t('title')}</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {visibleNav.map(({ href, labelKey, icon: Icon }) => {
              const active = pathname === href || (href !== '/hub' && pathname?.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t(labelKey)}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-900 truncate">{userName || userEmail}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            <div className="mt-2">{signOutButton}</div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden flex items-center justify-between border-b bg-white px-4 py-3">
            <span className="font-semibold text-slate-900">{t('title')}</span>
            {signOutButton}
          </header>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </>
  )
}
