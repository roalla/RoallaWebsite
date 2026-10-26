import Image from 'next/image'
import { ArrowRight, Bot, CloudCog, Network, PhoneCall, Radio, ShieldCheck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'
import { Link } from '@/i18n/navigation'
import { ecosystemLogos } from '@/lib/technologyEcosystem'

const categoryIcons = [CloudCog, ShieldCheck, Bot, PhoneCall, Network, Radio] as const
const categoryKeys = ['category1', 'category2', 'category3', 'category4', 'category5', 'category6'] as const

export default async function PartnersTelarusSection() {
  const t = await getTranslations('partnersPlatforms')
  const tEco = await getTranslations('home.technologyEcosystem')
  const tCommon = await getTranslations('common')
  const telarusLogo = ecosystemLogos.telarus

  return (
    <section aria-labelledby="telarus-heading">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <Reveal className="max-w-3xl">
          <div className="flex flex-col gap-5">
            <PartnersBrandLockup
              companyName={tCommon('companyName')}
              label={t('brandAdvisorLabel')}
              size="md"
              tone="light"
            />
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('strategicViaLabel')}
              </p>
              {telarusLogo ? (
                <div className="flex h-12 w-36 items-center justify-center rounded-xl bg-white px-3 ring-1 ring-slate-200">
                  <Image
                    src={telarusLogo.src}
                    alt=""
                    width={telarusLogo.width}
                    height={telarusLogo.height}
                    className={telarusLogo.className}
                    unoptimized
                  />
                </div>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('strategicRelationshipsTitle')}
              </p>
              <h2 id="telarus-heading" className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                {t('telarusTitle')}
              </h2>
            </div>
          </div>
          <p className="mt-5 leading-relaxed text-slate-700">{t('telarusBody')}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">{t('businessNeedLabel')}:</span> {tEco('telarus.need')}
          </p>
        </Reveal>
        <Reveal delayMs={80} className="max-w-sm border-l-2 border-primary/40 pl-5 lg:mt-2">
          <p className="text-sm font-semibold text-slate-900">{t('positioningTitle')}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('positioningBody')}</p>
        </Reveal>
      </div>

      <ul className="mt-8 flex flex-wrap gap-2">
        {categoryKeys.map((key, index) => {
          const Icon = categoryIcons[index]
          return (
            <Reveal as="li" key={key} delayMs={Math.min(index * 40, 200)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800">
                <Icon className="h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                {t(key)}
              </span>
            </Reveal>
          )
        })}
      </ul>

      <Reveal delayMs={120} className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-stretch sm:gap-0 sm:overflow-hidden sm:p-0">
        <Link
          href="/tools/communications-value-brief"
          className="flex flex-1 flex-col justify-center rounded-xl bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:bg-primary/[0.04] sm:rounded-none sm:border-r sm:border-slate-200"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
            {t('category4')} · {t('category5')}
          </p>
          <p className="mt-1 font-serif text-lg font-bold text-slate-950">{t('commsToolTitle')}</p>
          <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary-dark">
            {t('commsToolCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </span>
        </Link>
        <Link
          href="/tools/technology-decision-brief"
          className="flex flex-1 flex-col justify-center rounded-xl bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:bg-primary/[0.04] sm:rounded-none"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
          <p className="mt-1 font-serif text-lg font-bold text-slate-950">{t('techToolTitle')}</p>
          <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary-dark">
            {t('techToolCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </span>
        </Link>
      </Reveal>
    </section>
  )
}
