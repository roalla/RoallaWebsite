import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'
import PartnersTrackLink from '@/components/partners/PartnersTrackLink'

type Props = {
  imageSrc?: string
  pagePath?: string
}

export default async function PartnersOutcomeVignette({
  imageSrc = '/images/partners/partner-outcome-access.webp',
  pagePath = '/partners',
}: Props) {
  const t = await getTranslations('partnersPlatforms')
  const tCommon = await getTranslations('common')

  return (
    <Reveal className="overflow-hidden border border-slate-200 bg-white">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <PartnersBrandLockup
              companyName={tCommon('companyName')}
              label={t('outcomeVignetteEyebrow')}
              size="sm"
              tone="light"
            />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 sm:pt-2">
              {t('outcomeVignetteLabel')}
            </p>
          </div>
          <p className="mt-5 max-w-3xl font-serif text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
            {t('outcomeVignetteHeadline')}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{t('outcomeVignetteBody')}</p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {(['outcomeVignetteStep1', 'outcomeVignetteStep2', 'outcomeVignetteStep3'] as const).map(
              (key, index) => (
                <li key={key} className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{t(key)}</p>
                </li>
              ),
            )}
          </ol>
          <PartnersTrackLink
            href="/tools/technology-decision-brief"
            event="partners_outcome_vignette_cta"
            eventParams={{ path: pagePath }}
            className="mt-6 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
          >
            {t('outcomeVignetteCta')}
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </PartnersTrackLink>
        </div>
        <div className="relative min-h-[14rem] bg-slate-900 lg:min-h-full">
          <Image
            src={imageSrc}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 1023px) 100vw, 45vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" aria-hidden />
        </div>
      </div>
    </Reveal>
  )
}
