'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import PartnersTrackLink from '@/components/partners/PartnersTrackLink'

const roles = [
  {
    key: 'roleEvaluator' as const,
    href: '/partners/evaluation-standard' as const,
  },
  {
    key: 'roleLegal' as const,
    href: '/partners/compensation' as const,
  },
  {
    key: 'roleOperator' as const,
    href: '/partners/technology-providers' as const,
  },
]

export default function PartnersRoleEntry() {
  const t = useTranslations('partnersPlatforms')

  return (
    <section className="border-b border-slate-200 py-12 lg:py-14" aria-labelledby="partners-role-entry-heading">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('roleEyebrow')}</p>
        <h2 id="partners-role-entry-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
          {t('roleTitle')}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{t('roleDescription')}</p>
      </div>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <li key={role.key}>
            <PartnersTrackLink
              href={role.href}
              event="partners_start_here"
              eventParams={{ choice: role.key, path: role.href }}
              className="group flex h-full flex-col border-t border-slate-200 pt-5 transition hover:border-primary"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{t(`${role.key}Label`)}</p>
              <p className="mt-2 font-serif text-xl font-bold text-slate-950 group-hover:text-primary-dark">
                {t(`${role.key}Title`)}
              </p>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{t(`${role.key}Body`)}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
                {t(`${role.key}Cta`)}
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </PartnersTrackLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
