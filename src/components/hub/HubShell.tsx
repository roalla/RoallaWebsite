'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  BookOpen,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Handshake,
  Lightbulb,
  X,
} from 'lucide-react'
import type { HubRole } from '@/lib/hub/roles'
import { canAccessModule } from '@/lib/hub/permissions'
import { clientSignOut } from '@/lib/roalla-auth/client-sign-out'
import HubSearchDialog, { HubSearchButton } from '@/components/hub/HubSearch'

type NavHref =
  | '/hub'
  | '/hub/customers'
  | '/hub/playbooks'
  | '/hub/partners'
  | '/hub/lessons'
  | '/hub/recommendations'
  | '/hub/tools'

type NavItem = {
  href: NavHref
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  module: Parameters<typeof canAccessModule>[1]
}

type NavGroup = {
  labelKey: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: 'navGroupOverview',
    items: [{ href: '/hub', labelKey: 'navDashboard', icon: LayoutDashboard, module: 'dashboard' }],
  },
  {
    labelKey: 'navGroupDelivery',
    items: [
      { href: '/hub/customers', labelKey: 'navCustomers', icon: Users, module: 'customers' },
      { href: '/hub/playbooks', labelKey: 'navPlaybooks', icon: BookOpen, module: 'playbooks' },
    ],
  },
  {
    labelKey: 'navGroupKnowledge',
    items: [
      { href: '/hub/lessons', labelKey: 'navLessons', icon: Lightbulb, module: 'lessons' },
      { href: '/hub/recommendations', labelKey: 'navRecommendations', icon: ClipboardList, module: 'recommendations' },
    ],
  },
  {
    labelKey: 'navGroupNetwork',
    items: [{ href: '/hub/partners', labelKey: 'navPartners', icon: Handshake, module: 'partners' }],
  },
  {
    labelKey: 'navGroupApps',
    items: [{ href: '/hub/tools', labelKey: 'navTools', icon: ExternalLink, module: 'tools' }],
  },
]

type Props = {
  children: React.ReactNode
  userName: string
  userEmail: string
  role: HubRole
  locale: string
}

function NavLinks({
  role,
  pathname,
  onNavigate,
}: {
  role: HubRole
  pathname: string | null
  onNavigate?: () => void
}) {
  const t = useTranslations('hub')

  return (
    <>
      {NAV_GROUPS.map((group) => {
        const items = group.items.filter((item) => canAccessModule(role, item.module))
        if (items.length === 0) return null
        return (
          <div key={group.labelKey} className="mb-4 last:mb-0">
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {t(group.labelKey)}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, labelKey, icon: Icon }) => {
                const active = pathname === href || (href !== '/hub' && pathname?.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px] ${
                      active
                        ? 'bg-primary-dark text-white'
                        : 'text-slate-700 hover:bg-primary/10 hover:text-primary-darker'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {t(labelKey)}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default function HubShell({ children, userName, userEmail, role, locale }: Props) {
  const t = useTranslations('hub')
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !(e.target as HTMLElement)?.isContentEditable) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  async function signOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await clientSignOut()
    } finally {
      window.location.href = `/${locale}/hub/login`
    }
  }

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
      <HubSearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="min-h-screen bg-slate-50 flex">
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white shrink-0">
          <div className="p-5 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">Roalla</p>
            <h1 className="text-lg font-bold text-slate-900">{t('title')}</h1>
          </div>
          <div className="p-3 border-b border-slate-100">
            <HubSearchButton onClick={() => setSearchOpen(true)} />
          </div>
          <nav className="flex-1 p-3 overflow-y-auto">
            <NavLinks role={role} pathname={pathname} />
          </nav>
          <div className="p-4 border-t border-slate-100">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wide rounded-full bg-primary/10 text-primary-darker px-2 py-0.5 mb-2">
              {t(`role_${role}`)}
            </span>
            <p className="text-sm font-medium text-slate-900 truncate">{userName || userEmail}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            <div className="mt-2">{signOutButton}</div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden flex items-center gap-3 border-b bg-white px-4 py-3 sticky top-0 z-40">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('openMenu')}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-semibold text-slate-900 flex-1 truncate">{t('title')}</span>
            {signOutButton}
          </header>

          {mobileOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-hidden />
              <aside className="relative w-[min(100%,280px)] bg-white h-full flex flex-col shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-bold text-slate-900">{t('title')}</span>
                  <button type="button" onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100" aria-label={t('cancel')}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-3 border-b">
                  <HubSearchButton onClick={() => { setSearchOpen(true); setMobileOpen(false) }} />
                </div>
                <nav className="flex-1 p-3 overflow-y-auto">
                  <NavLinks role={role} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                </nav>
                <div className="p-4 border-t">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wide rounded-full bg-primary/10 text-primary-darker px-2 py-0.5 mb-2">
                    {t(`role_${role}`)}
                  </span>
                  <p className="text-sm font-medium truncate">{userName || userEmail}</p>
                  <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                </div>
              </aside>
            </div>
          )}

          <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </>
  )
}
