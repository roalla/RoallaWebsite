import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { ButterflyAccent } from '@/components/brand/BrandAccents'
import type { PartnersHeroCta } from '@/components/partners/PartnersSectionHero'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'
import PartnersTrackLink from '@/components/partners/PartnersTrackLink'

type Props = {
  title?: string
  body?: string
  primaryCta?: PartnersHeroCta
  secondaryCta?: PartnersHeroCta
  pagePath?: string
}

export default async function PartnersClosingCta({
  title,
  body,
  primaryCta,
  secondaryCta,
  pagePath = '/partners',
}: Props) {
  const t = await getTranslations('partnersPlatforms')
  const tCommon = await getTranslations('common')

  const resolvedPrimary: PartnersHeroCta = primaryCta ?? {
    label: t('ctaButton'),
    href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
  }
  const resolvedSecondary: PartnersHeroCta = secondaryCta ?? {
    label: t('digitalLink'),
    href: '/services/digital',
  }

  return (
    <section
      data-header-tone="dark"
      className="bg-slate-950 px-4 py-14 text-center text-white sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex justify-center">
          <ButterflyAccent className="h-10 w-10 text-primary/55" />
        </div>
        <div className="mb-6 flex justify-center">
          <PartnersBrandLockup
            companyName={tCommon('companyName')}
            label={t('brandAdvisorLabel')}
            size="md"
            tone="dark"
          />
        </div>
        <h2 className="font-serif text-3xl font-bold text-white">{title ?? t('ctaTitle')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">{body ?? t('ctaBody')}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PartnersTrackLink
            href={resolvedPrimary.href}
            event="partners_closing_cta"
            eventParams={{ path: pagePath, slot: 'primary' }}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary-light"
          >
            {resolvedPrimary.label}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </PartnersTrackLink>
          <PartnersTrackLink
            href={resolvedSecondary.href}
            event="partners_closing_cta"
            eventParams={{ path: pagePath, slot: 'secondary' }}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {resolvedSecondary.label}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </PartnersTrackLink>
        </div>
      </div>
    </section>
  )
}
