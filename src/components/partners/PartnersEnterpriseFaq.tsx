import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'

const FAQ_KEYS = ['enterpriseFaq1', 'enterpriseFaq2', 'enterpriseFaq3', 'enterpriseFaq4'] as const

export function partnersEnterpriseFaqJsonLd(t: (key: string) => string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`${key}Q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`${key}A`),
      },
    })),
  }
}

export default async function PartnersEnterpriseFaq() {
  const t = await getTranslations('partnersPlatforms')

  return (
    <section className="mt-12 border-t border-slate-200 pt-10" aria-labelledby="partners-enterprise-faq-heading">
      <Reveal>
        <h2 id="partners-enterprise-faq-heading" className="font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
          {t('enterpriseFaqTitle')}
        </h2>
      </Reveal>
      <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {FAQ_KEYS.map((key, index) => (
          <Reveal as="div" key={key} delayMs={index * 40} className="py-5">
            <dt className="font-serif text-lg font-bold text-slate-950">{t(`${key}Q`)}</dt>
            <dd className="mt-2 text-sm leading-6 text-slate-600">{t(`${key}A`)}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}
