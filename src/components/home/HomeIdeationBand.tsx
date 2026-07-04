'use client'

import React from 'react'
import Image from 'next/image'
import { Lightbulb, Target, Hammer } from 'lucide-react'
import { useTranslations } from 'next-intl'

const PILL_KEYS = ['pill1', 'pill2', 'pill3'] as const
const PILL_ICONS = [Target, Lightbulb, Hammer] as const

export default function HomeIdeationBand() {
  const t = useTranslations('home.ideationBand')
  const tCommon = useTranslations('common')

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-darker text-white border-y border-primary/25"
      aria-labelledby="ideation-band-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,180,197,0.18),transparent_55%)] pointer-events-none"
        aria-hidden
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.svg"
              alt={`${tCommon('companyName')} logo`}
              width={48}
              height={48}
              className="w-11 h-11 sm:w-12 sm:h-12"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light mb-4">
            {t('eyebrow')}
          </p>
          <h2
            id="ideation-band-heading"
            className="text-xl sm:text-2xl lg:text-[1.75rem] font-serif font-bold leading-snug text-white"
          >
            {t('headline')}
          </h2>

          <ul className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 list-none p-0 m-0">
            {PILL_KEYS.map((key, index) => {
              const Icon = PILL_ICONS[index]
              return (
                <li
                  key={key}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-sm font-medium text-white/95"
                >
                  <Icon className="w-4 h-4 text-primary-light shrink-0" aria-hidden />
                  {t(key)}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
