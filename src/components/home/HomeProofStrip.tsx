'use client'

import { useTranslations } from 'next-intl'
import Reveal from '../motion/Reveal'

const stats = ['stat1', 'stat2', 'stat3'] as const

export default function HomeProofStrip() {
  const t = useTranslations('home.proofStrip')

  return (
    <section className="border-b border-slate-200 bg-white py-10 lg:py-12" aria-label={t('ariaLabel')}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <ul className="mx-auto flex max-w-4xl flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            {stats.map((key, index) => (
              <li
                key={key}
                className={`flex flex-1 flex-col items-center text-center sm:items-start sm:text-left ${
                  index > 0 ? 'border-t border-slate-200 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0' : ''
                }`}
              >
                <p className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {t(`${key}Value`)}
                </p>
                <p className="mt-1 text-sm leading-snug text-slate-600">{t(`${key}Label`)}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
