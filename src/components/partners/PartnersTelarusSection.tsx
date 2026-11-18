import Image from 'next/image'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Cloud,
  CloudCog,
  Cog,
  Headset,
  Layers,
  LayoutGrid,
  Network,
  PhoneCall,
  Radio,
  Shield,
  ShieldCheck,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Reveal from '@/components/motion/Reveal'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'
import { Link } from '@/i18n/navigation'
import { ecosystemLogos } from '@/lib/technologyEcosystem'

const categoryIcons = [CloudCog, ShieldCheck, Bot, PhoneCall, Network, Radio] as const
const categoryKeys = ['category1', 'category2', 'category3', 'category4', 'category5', 'category6'] as const

const allianceIcons = [Cog, Layers, Headset, Cloud, Bot, LayoutGrid, Shield, BarChart3] as const
const allianceCategories = [
  { key: 'allianceCategory1' as const, href: '/services/digital' as const },
  { key: 'allianceCategory2' as const, href: '/services/managed-optimization' as const },
  {
    key: 'allianceCategory3' as const,
    href: '/services/unified-communications-contact-centres-ai-employees' as const,
  },
  { key: 'allianceCategory4' as const, href: '/services/technology-advisory' as const },
  { key: 'allianceCategory5' as const, href: '/ai-employee' as const },
  { key: 'allianceCategory6' as const, href: '/services/digital-products' as const },
  { key: 'allianceCategory7' as const, href: '/services/security-risk-compliance' as const },
  { key: 'allianceCategory8' as const, href: '/services/managed-optimization' as const },
]

export default async function PartnersTelarusSection() {
  const t = await getTranslations('partnersPlatforms')
  const tEco = await getTranslations('home.technologyEcosystem')
  const tCommon = await getTranslations('common')
  const telarusLogo = ecosystemLogos.telarus

  return (
    <section aria-labelledby="telarus-heading">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <Reveal className="max-w-3xl">
          <div className="flex flex-col gap-4">
            <PartnersBrandLockup
              companyName={tCommon('companyName')}
              label={t('brandAdvisorLabel')}
              size="md"
              tone="light"
            />
            <div className="flex flex-wrap items-center gap-3">
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
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('strategicViaLabel')}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('strategicRelationshipsTitle')}
              </p>
              <h2 id="telarus-heading" className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                {t('strategicClientLeadTitle')}
              </h2>
            </div>
            <p className="text-base leading-7 text-slate-700">{t('strategicClientLeadBody')}</p>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <span className="font-semibold text-slate-900">{t('businessNeedLabel')}:</span>{' '}
              {tEco('telarus.need')}
            </p>
          </div>
        </Reveal>
      </div>

      <ul className="mt-7 flex flex-wrap gap-2">
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

      <Reveal delayMs={60} className="mt-8">
        <div
          id="alliance-network"
          className="scroll-mt-28 rounded-xl border border-slate-200 bg-white px-4 py-5 sm:px-5"
          aria-labelledby="alliance-network-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('allianceEyebrow')}
          </p>
          <h3
            id="alliance-network-heading"
            className="mt-1 font-serif text-xl font-bold text-slate-900 sm:text-2xl"
          >
            {t('allianceTitle')}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">{t('allianceBody')}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-800 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:space-y-0">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-dark" aria-hidden />
              <span className="font-medium">{t('allianceProof1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-dark" aria-hidden />
              <span className="font-medium">{t('allianceProof2')}</span>
            </li>
          </ul>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('allianceServicesLabel')}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {allianceCategories.map((item, index) => {
              const Icon = allianceIcons[index]
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-800 transition hover:border-primary hover:bg-white hover:text-primary-dark"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                    {t(item.key)}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } }}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {t('allianceCta')}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/tools/technology-decision-brief"
              className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
            >
              {t('allianceBriefCta')}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delayMs={80} className="mt-6">
        <details className="group/details rounded-xl border border-slate-200 bg-white open:shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden sm:px-5">
            <span>{t('telarusDetailsSummary')}</span>
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition group-open/details:rotate-45"
              aria-hidden
            >
              +
            </span>
          </summary>
          <div className="space-y-4 border-t border-slate-200 px-4 py-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('telarusTitle')}</p>
            <p className="leading-relaxed text-slate-700">{t('telarusBody')}</p>
            <div className="border-l-2 border-primary/40 pl-4">
              <p className="text-sm font-semibold text-slate-900">{t('positioningTitle')}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('positioningBody')}</p>
            </div>
          </div>
        </details>
      </Reveal>

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
