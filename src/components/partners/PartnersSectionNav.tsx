'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { partnersSectionNav, type PartnersSectionPath } from '@/lib/partners-sections'

const STORAGE_KEY = 'roalla-partners-visited'

type Props = {
  current: PartnersSectionPath | '/partners'
}

function readVisited(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

export default function PartnersSectionNav({ current }: Props) {
  const t = useTranslations('partnersPlatforms')
  const router = useRouter()
  const [visited, setVisited] = useState<string[]>([])

  useEffect(() => {
    const next = new Set(readVisited())
    next.add(current)
    const list = Array.from(next)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    setVisited(list)
  }, [current])

  useEffect(() => {
    for (const item of partnersSectionNav) {
      router.prefetch(item.path)
    }
    router.prefetch('/partners')
  }, [router])

  return (
    <nav
      aria-label={t('sectionNavLabel')}
      className="sticky top-16 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75 lg:top-[4.25rem]"
    >
      <div className="container mx-auto flex gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <Link
          href="/partners"
          prefetch
          onClick={() => trackAnalyticsEvent('partners_section_nav', { path: '/partners' })}
          className={
            current === '/partners'
              ? 'shrink-0 border-b-2 border-slate-900 px-3 py-2 text-sm font-semibold text-slate-900'
              : 'shrink-0 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900'
          }
          aria-current={current === '/partners' ? 'page' : undefined}
        >
          {t('sectionNavOverview')}
          {visited.includes('/partners') && current !== '/partners' ? (
            <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary-dark" aria-hidden />
          ) : null}
        </Link>
        {partnersSectionNav.map((item) => {
          const active = current === item.path
          const seen = visited.includes(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              prefetch
              onMouseEnter={() => router.prefetch(item.path)}
              onClick={() => trackAnalyticsEvent('partners_section_nav', { path: item.path })}
              className={
                active
                  ? 'shrink-0 border-b-2 border-slate-900 px-3 py-2 text-sm font-semibold text-slate-900'
                  : 'shrink-0 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900'
              }
              aria-current={active ? 'page' : undefined}
            >
              {t(item.labelKey)}
              {seen && !active ? (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary-dark" aria-hidden />
              ) : null}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
