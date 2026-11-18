import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import PartnersTrackLink from '@/components/partners/PartnersTrackLink'

const outcomes = [
  {
    key: 'outcome1' as const,
    href: '/partners/strategic-relationships' as const,
    image: '/images/partners/partner-outcome-access.webp',
  },
  {
    key: 'outcome2' as const,
    href: '/partners/evaluation-standard' as const,
    image: '/images/partners/partner-outcome-evaluate.webp',
  },
  {
    key: 'outcome3' as const,
    href: '/partners/compensation' as const,
    image: '/images/partners/partner-outcome-disclose.webp',
  },
] as const

export default async function PartnersOutcomesStrip() {
  const t = await getTranslations('partnersPlatforms')

  return (
    <section className="border-b border-slate-200 py-12 lg:py-14" aria-labelledby="partner-outcomes-heading">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('outcomesEyebrow')}</p>
        <h2 id="partner-outcomes-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
          {t('outcomesTitle')}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{t('outcomesDescription')}</p>
      </div>

      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {outcomes.map((item, index) => (
          <Reveal as="li" key={item.key} delayMs={index * 50} className="flex h-full flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <Image
                src={item.image}
                alt={t(`${item.key}Alt`)}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden />
              <p className="absolute bottom-3 left-3 text-xs font-bold uppercase tracking-[0.16em] text-white">
                {String(index + 1).padStart(2, '0')} · {t(`${item.key}Label`)}
              </p>
            </div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">{t(`${item.key}Title`)}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{t(`${item.key}Body`)}</p>
            <PartnersTrackLink
              href={item.href}
              event="partners_section_nav"
              eventParams={{ path: item.href, location: 'outcomes_strip' }}
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
            >
              {t(`${item.key}Link`)}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </PartnersTrackLink>
          </Reveal>
        ))}
      </ol>

      <p className="mt-8 max-w-3xl text-sm leading-6 text-slate-600">
        <span className="font-semibold text-slate-900">{t('outcomesInsightTitle')}</span> {t('outcomesInsightBody')}
      </p>
    </section>
  )
}
