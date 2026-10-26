import { ArrowRight, Bot, CloudCog, Handshake, Network, PhoneCall, Radio, ShieldCheck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const categoryIcons = [CloudCog, ShieldCheck, Bot, PhoneCall, Network, Radio] as const
const categoryKeys = ['category1', 'category2', 'category3', 'category4', 'category5', 'category6'] as const

type Props = {
  asPageHeading?: boolean
}

export default async function PartnersTelarusSection({ asPageHeading = false }: Props) {
  const t = await getTranslations('partnersPlatforms')
  const tEco = await getTranslations('home.technologyEcosystem')
  const Heading = asPageHeading ? 'h1' : 'h2'

  return (
    <section aria-labelledby="telarus-heading">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Handshake className="h-5 w-5 text-primary-dark" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('strategicRelationshipsTitle')}
              </p>
              <Heading
                id="telarus-heading"
                className={
                  asPageHeading
                    ? 'font-serif text-3xl font-bold text-slate-900 sm:text-4xl'
                    : 'font-serif text-2xl font-bold text-slate-900 sm:text-3xl'
                }
              >
                {t('telarusTitle')}
              </Heading>
            </div>
          </div>
          <p className="mt-5 leading-relaxed text-slate-700">{t('telarusBody')}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">{t('businessNeedLabel')}:</span> {tEco('telarus.need')}
          </p>
        </div>
        <aside className="max-w-sm border-l-2 border-primary/40 pl-5 lg:mt-2">
          <p className="text-sm font-semibold text-slate-900">{t('positioningTitle')}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('positioningBody')}</p>
        </aside>
      </div>

      <ul className="mt-8 flex flex-wrap gap-2">
        {categoryKeys.map((key, index) => {
          const Icon = categoryIcons[index]
          return (
            <li
              key={key}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
              {t(key)}
            </li>
          )
        })}
      </ul>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-stretch sm:gap-0 sm:overflow-hidden sm:p-0">
        <Link
          href="/tools/communications-value-brief"
          className="flex flex-1 flex-col justify-center rounded-xl bg-white px-5 py-4 transition hover:bg-primary/[0.04] sm:rounded-none sm:border-r sm:border-slate-200"
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
          className="flex flex-1 flex-col justify-center rounded-xl bg-white px-5 py-4 transition hover:bg-primary/[0.04] sm:rounded-none"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{t('eyebrow')}</p>
          <p className="mt-1 font-serif text-lg font-bold text-slate-950">{t('techToolTitle')}</p>
          <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary-dark">
            {t('techToolCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </span>
        </Link>
      </div>
    </section>
  )
}
