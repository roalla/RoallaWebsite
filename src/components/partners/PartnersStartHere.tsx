'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import PartnersTrackLink from '@/components/partners/PartnersTrackLink'

const paths = [
  {
    key: 'startCompare' as const,
    href: '/partners/evaluation-standard' as const,
  },
  {
    key: 'startAccess' as const,
    href: '/partners/strategic-relationships' as const,
  },
  {
    key: 'startWho' as const,
    href: '/partners/technology-providers' as const,
  },
]

export default function PartnersStartHere() {
  const t = useTranslations('partnersPlatforms')

  return (
    <section
      className="scroll-mt-28 border-b border-slate-200 py-12 lg:py-14"
      aria-labelledby="partners-start-here-heading"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('startHereEyebrow')}</p>
        <h2 id="partners-start-here-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
          {t('startHereTitle')}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{t('startHereDescription')}</p>
      </div>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {paths.map((item) => (
          <li key={item.key}>
            <PartnersTrackLink
              href={item.href}
              event="partners_start_here"
              eventParams={{ path: item.href, choice: item.key }}
              className="group flex h-full flex-col border-t border-slate-200 pt-5 transition hover:border-primary"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                {t(`${item.key}Label`)}
              </p>
              <p className="mt-2 font-serif text-xl font-bold text-slate-950 group-hover:text-primary-dark">
                {t(`${item.key}Title`)}
              </p>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{t(`${item.key}Body`)}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
                {t(`${item.key}Cta`)}
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </PartnersTrackLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
