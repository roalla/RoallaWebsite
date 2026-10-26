import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import PartnersTrackLink from '@/components/partners/PartnersTrackLink'

const modes = ['engage1', 'engage2', 'engage3'] as const

export default async function PartnersEnterpriseEngage() {
  const t = await getTranslations('partnersPlatforms')

  return (
    <section className="border-t border-slate-200 py-12 lg:py-16" aria-labelledby="partners-engage-heading">
      <Reveal className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{t('engageEyebrow')}</p>
        <h2 id="partners-engage-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 lg:text-4xl">
          {t('engageTitle')}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{t('engageDescription')}</p>
      </Reveal>

      <ul className="mt-8 grid gap-6 lg:grid-cols-3">
        {modes.map((key, index) => (
          <Reveal as="li" key={key} delayMs={index * 60} className="border-t border-slate-200 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{t(`${key}Label`)}</p>
            <h3 className="mt-2 font-serif text-xl font-bold text-slate-950">{t(`${key}Title`)}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              <span className="font-semibold text-slate-800">{t('engageBestFor')}:</span> {t(`${key}Best`)}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              <span className="font-semibold text-slate-800">{t('engageResult')}:</span> {t(`${key}Result`)}
            </p>
          </Reveal>
        ))}
      </ul>

      <Reveal delayMs={120} className="mt-8 border border-slate-200 bg-slate-50 px-5 py-5 sm:px-6">
        <p className="text-sm leading-6 text-slate-700">{t('engagePricingNote')}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PartnersTrackLink
            href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } }}
            event="partners_closing_cta"
            eventParams={{ slot: 'enterprise_engage' }}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-slate-950 hover:bg-primary-light"
          >
            {t('engagePrimaryCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </PartnersTrackLink>
          <PartnersTrackLink
            href="/programs/workshops/decision-hour"
            event="partners_closing_cta"
            eventParams={{ slot: 'decision_hour' }}
            className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold text-primary-dark underline-offset-4 hover:underline"
          >
            {t('engageDecisionHourCta')}
          </PartnersTrackLink>
          <PartnersTrackLink
            href="/services/technology-advisory"
            event="partners_closing_cta"
            eventParams={{ slot: 'technology_advisory' }}
            className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
          >
            {t('engageAdvisoryCta')}
          </PartnersTrackLink>
        </div>
      </Reveal>
    </section>
  )
}
