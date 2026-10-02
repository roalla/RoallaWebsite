'use client'

import React from 'react'
import { Layers, Network, RefreshCw, Workflow } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from './motion/Reveal'

const paths = [
  { key: 'buy', icon: Network, href: '/programs/technology-advisory' as const },
  { key: 'build', icon: Layers, href: '/services/digital-products' as const },
  { key: 'connect', icon: Workflow, href: '/services/automation' as const },
  { key: 'improve', icon: RefreshCw, href: '/services/managed-optimization' as const },
] as const

export default function TechnologyDecisionFramework({
  className = '',
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const t = useTranslations('technologyFramework')

  return (
    <Reveal className={`rounded-2xl border border-primary/20 bg-primary/[0.04] ${compact ? 'p-5 lg:p-6' : 'p-6 lg:p-8'} ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">
        {t('eyebrow')}
      </p>
      <h2 className="mt-2 text-2xl md:text-3xl font-serif font-bold text-slate-900">
        {t('title')}
      </h2>
      <p className={`${compact ? 'mt-2 text-sm' : 'mt-3'} max-w-3xl text-slate-700`}>{t('description')}</p>

      <ol className={`${compact ? 'mt-5' : 'mt-7'} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
        {paths.map(({ key, icon: Icon, href }, index) => (
          <li key={key}>
            <Link
              href={href}
              className={`group block h-full rounded-xl border border-slate-200 bg-white transition-all hover:border-primary hover:shadow-sm ${compact ? 'p-4' : 'p-5'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/10">
                  <Icon className="h-5 w-5 text-primary-dark" aria-hidden />
                </span>
                <span className="text-xs font-bold text-primary-dark">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-slate-900 group-hover:text-primary-dark">
                {t(`${key}Title`)}
              </h3>
              {!compact && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t(`${key}Description`)}
                </p>
              )}
              <span className={`${compact ? 'mt-2' : 'mt-4'} inline-flex text-xs font-bold text-primary-dark`}>
                {t(`${key}Link`)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}
