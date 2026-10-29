'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { outcomePageCopy } from '@/lib/solution-outcome-pages'
import Reveal from '../motion/Reveal'

export default function HomeOutcomeProcess() {
  const locale = useLocale() === 'fr' ? 'fr' : 'en'
  const content = outcomePageCopy[locale]

  return (
    <section className="relative bg-slate-950 py-14 text-white lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light">{content.processEyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">{content.processTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">{content.processDescription}</p>
        </Reveal>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {content.steps.map((step, index) => (
            <Reveal key={step.title} delayMs={index * 50} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary-light" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-light">0{index + 1}</p>
              </div>
              <h3 className="mt-4 font-serif text-2xl font-bold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link href="/assessment" className="inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-slate-950 hover:bg-primary/90">
            {locale === 'fr' ? 'Trouver mon point de départ' : 'Find my starting point'}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
