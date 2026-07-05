'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  BookOpen,
  ClipboardList,
  ExternalLink,
  Lightbulb,
  Plus,
  Users,
} from 'lucide-react'
import type { HubRole } from '@/lib/hub/roles'
import { canAccessModule, canManageCustomers, canManageLessons } from '@/lib/hub/permissions'

type Props = {
  role: HubRole
  stats: {
    activeCustomers: number
    openEngagements: number
    incompleteChecklistItems: number
    openRecommendations: number
  }
  isEmpty: boolean
}

export default function HubDashboardExtras({ role, stats, isEmpty }: Props) {
  const t = useTranslations('hub')

  const quickLinks = [
    { href: '/hub/customers' as const, labelKey: 'navCustomers', descKey: 'customersSubtitle', icon: Users, module: 'customers' as const },
    { href: '/hub/playbooks' as const, labelKey: 'navPlaybooks', descKey: 'playbooksSubtitle', icon: BookOpen, module: 'playbooks' as const },
    { href: '/hub/recommendations' as const, labelKey: 'navRecommendations', descKey: 'navRecommendationsSubtitle', icon: ClipboardList, module: 'recommendations' as const },
    { href: '/hub/lessons' as const, labelKey: 'navLessons', descKey: 'navLessonsSubtitle', icon: Lightbulb, module: 'lessons' as const },
    { href: '/hub/tools' as const, labelKey: 'navTools', descKey: 'toolsSubtitle', icon: ExternalLink, module: 'tools' as const },
  ].filter((l) => canAccessModule(role, l.module))

  return (
    <>
      {isEmpty && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 mb-8">
          <h2 className="font-semibold text-slate-900 mb-1">{t('dashboardEmptyTitle')}</h2>
          <p className="text-sm text-slate-600 mb-4">{t('dashboardEmptyHint')}</p>
          <div className="flex flex-wrap gap-2">
            {canManageCustomers(role) && (
              <Link href="/hub/customers" className="inline-flex items-center gap-1.5 rounded-lg bg-primary-dark text-white px-4 py-2 text-sm font-medium min-h-[44px]">
                <Plus className="h-4 w-4" />
                {t('addCustomer')}
              </Link>
            )}
            {canManageLessons(role) && (
              <Link href="/hub/lessons" className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-4 py-2 text-sm font-medium min-h-[44px] hover:border-primary/40">
                <Plus className="h-4 w-4" />
                {t('addLesson')}
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {canAccessModule(role, 'customers') && (
          <Link href="/hub/customers" className="rounded-xl border bg-white p-5 hover:border-primary/40 hover:shadow-sm transition group">
            <p className="text-2xl font-bold text-slate-900 group-hover:text-primary-dark">{stats.activeCustomers}</p>
            <p className="text-sm text-slate-600">{t('statActiveCustomers')}</p>
          </Link>
        )}
        {canAccessModule(role, 'playbooks') && (
          <Link href="/hub/playbooks" className="rounded-xl border bg-white p-5 hover:border-primary/40 hover:shadow-sm transition group">
            <p className="text-2xl font-bold text-slate-900 group-hover:text-primary-dark">{stats.incompleteChecklistItems}</p>
            <p className="text-sm text-slate-600">{t('statChecklistItems')}</p>
          </Link>
        )}
        {canAccessModule(role, 'recommendations') && (
          <Link href="/hub/recommendations" className="rounded-xl border bg-white p-5 hover:border-primary/40 hover:shadow-sm transition group">
            <p className="text-2xl font-bold text-slate-900 group-hover:text-primary-dark">{stats.openRecommendations}</p>
            <p className="text-sm text-slate-600">{t('statOpenRecommendations')}</p>
          </Link>
        )}
        {canAccessModule(role, 'customers') && (
          <Link href="/hub/customers" className="rounded-xl border bg-white p-5 hover:border-primary/40 hover:shadow-sm transition group">
            <p className="text-2xl font-bold text-slate-900 group-hover:text-primary-dark">{stats.openEngagements}</p>
            <p className="text-sm text-slate-600">{t('statOpenEngagements')}</p>
          </Link>
        )}
      </div>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold mb-4">{t('quickLinks')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map(({ href, labelKey, descKey, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 rounded-xl border p-4 hover:border-primary/40 hover:bg-primary/5 transition"
            >
              <Icon className="h-5 w-5 text-primary-dark shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">{t(labelKey)}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{t(descKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
