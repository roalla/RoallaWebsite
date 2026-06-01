'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

export default function HomeHowWeBuild() {
  const t = useTranslations('home.howWeBuild')

  return (
    <section id="how-we-build" className="py-10 lg:py-12 bg-slate-50 relative scroll-mt-24">
      <div className="section-divider" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl rounded-xl border border-slate-200 bg-white px-6 py-5 lg:px-8">
          <p className="text-sm text-slate-700 leading-relaxed">
            {t('buildStripDescShort')}{' '}
            <Link href="/services/digital" className="link-action font-semibold inline-flex items-center gap-1">
              {t('howWeDeliver')}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
