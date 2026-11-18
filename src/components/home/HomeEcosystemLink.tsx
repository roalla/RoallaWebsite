'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

export default function HomeEcosystemLink() {
  const t = useTranslations('home.technologyEcosystem')

  return (
    <section className="border-y border-slate-200 bg-white py-8 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{t('homeLinkBody')}</p>
          <Link
            href="/partners"
            className="inline-flex shrink-0 items-center text-sm font-semibold text-primary-dark hover:underline"
          >
            {t('viewAllCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
