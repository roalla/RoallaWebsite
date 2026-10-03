'use client'

import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '../motion/Reveal'

const statKeys = ['experience', 'projects', 'examples', 'accountability'] as const
const FOUNDER_PORTRAIT_SRC = '/images/team/steven-robin.webp'

export default function HomeTrustBand() {
  const t = useTranslations('home.trustBand')

  return (
    <section aria-labelledby="home-trust-title" className="relative bg-slate-950 py-10 text-white lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-5 border-b border-white/10 pb-9 lg:grid-cols-4">
          {statKeys.map((key, index) => (
            <Reveal key={key} delayMs={index * 35} className="text-center lg:text-left">
              <p className="text-2xl font-extrabold text-brand-gold sm:text-3xl">{t(`${key}Value`)}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm">{t(`${key}Label`)}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-9 grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/50 bg-slate-800 shadow-lg">
            <Image src={FOUNDER_PORTRAIT_SRC} alt={t('photoAlt')} fill sizes="80px" className="object-cover object-top" />
          </div>
          <div>
            <p id="home-trust-title" className="font-serif text-xl font-bold">{t('title')}</p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">{t('description')}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary-light">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              {t('commitment')}
            </p>
          </div>
          <Link href="/about" className="inline-flex items-center text-sm font-semibold text-white hover:text-primary-light hover:underline">
            {t('cta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
