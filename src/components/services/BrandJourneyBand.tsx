'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'
import { BRAND_PILLARS, PILLAR_SECTION_IDS, PILLAR_TITLE_KEYS, type BrandPillar } from '@/lib/brand-journey'
import { ButterflyAccent, PyramidAccent } from '../brand/BrandAccents'

const PILLAR_DESC_KEYS: Record<
  BrandPillar,
  'pillarPrepareDesc' | 'pillarTransformDesc' | 'pillarEmergeDesc' | 'pillarSoarDesc'
> = {
  prepare: 'pillarPrepareDesc',
  transform: 'pillarTransformDesc',
  emerge: 'pillarEmergeDesc',
  soar: 'pillarSoarDesc',
}

type PillarCardProps = {
  index: number
  label: string
  description: string
  hash?: string
  useLink?: boolean
}

function PillarCard({ index, label, description, hash, useLink }: PillarCardProps) {
  const className =
    'group flex flex-col h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-primary hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300'

  const content = (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-dark mb-1">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="font-serif font-bold text-slate-900 group-hover:text-primary-dark transition-colors">{label}</span>
      <span className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{description}</span>
      <span className="mt-3 text-xs font-medium text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity">
        → {label}
      </span>
    </>
  )

  if (useLink && hash) {
    return (
      <Link href={{ pathname: '/programs/business-enablement', hash }} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <a href={hash ? `#${hash}` : '#'} className={className}>
      {content}
    </a>
  )
}

type BrandJourneyBandProps = {
  /** Hash anchors on the current page (services/digital). */
  linkMode?: 'hash' | 'services'
}

export default function BrandJourneyBand({ linkMode = 'hash' }: BrandJourneyBandProps) {
  const t = useTranslations('brandJourney')

  const hashFor = (pillar: BrandPillar) => PILLAR_SECTION_IDS[pillar]

  return (
    <Reveal className="mb-10 rounded-2xl border border-slate-300 bg-gradient-to-br from-white via-slate-50/80 to-primary/[0.04] px-6 py-8 lg:px-10 lg:py-10 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
        <div className="flex items-start gap-4 lg:max-w-xs shrink-0">
          <div className="flex items-center gap-3">
            <PyramidAccent />
            <ButterflyAccent />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-slate-900 tracking-tight">{t('bandTitle')}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('bandSubtitle')}</p>
          </div>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 list-none p-0 m-0">
          {BRAND_PILLARS.map((pillar, i) => (
            <li key={pillar}>
              <PillarCard
                index={i}
                label={t(PILLAR_TITLE_KEYS[pillar])}
                description={t(PILLAR_DESC_KEYS[pillar])}
                hash={hashFor(pillar)}
                useLink={linkMode === 'services'}
              />
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
