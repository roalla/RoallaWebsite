import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CloudCog,
  Handshake,
  Network,
  PhoneCall,
  Radio,
  ShieldCheck,
} from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const categoryIcons = [CloudCog, ShieldCheck, Bot, PhoneCall, Network, Radio] as const
const categoryKeys = ['category1', 'category2', 'category3', 'category4', 'category5', 'category6'] as const
const standardKeys = ['standard1', 'standard2', 'standard3', 'standard4', 'standard5', 'standard6', 'standard7', 'standard8'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path: '/partners',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })
  const tBreadcrumb = await getTranslations('breadcrumb')

  return (
    <main className="page-shell">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tBreadcrumb('home'), path: '' },
          { name: t('title') },
        ])}
      />
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16 lg:pb-24">
        <Breadcrumb items={[{ label: tBreadcrumb('home'), href: '/' }, { label: t('title') }]} />

        <header className="max-w-4xl py-10 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{t('eyebrow')}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif font-extrabold text-slate-900">{t('title')}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">{t('subtitle')}</p>
        </header>

        <section className="rounded-2xl border border-primary/25 bg-white p-6 lg:p-9" aria-labelledby="telarus-heading">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Handshake className="h-5 w-5 text-primary-dark" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('verifiedLabel')}</p>
                  <h2 id="telarus-heading" className="text-2xl font-serif font-bold text-slate-900">{t('telarusTitle')}</h2>
                </div>
              </div>
              <p className="mt-5 leading-relaxed text-slate-700">{t('telarusBody')}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 lg:max-w-xs">
              <p className="text-sm font-semibold text-slate-900">{t('positioningTitle')}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('positioningBody')}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryKeys.map((key, index) => {
              const Icon = categoryIcons[index]
              return (
                <div key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <Icon className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
                  <span className="text-sm font-medium text-slate-800">{t(key)}</span>
                </div>
              )
            })}
          </div>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900">{t('standardTitle')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t('standardIntro')}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {standardKeys.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 lg:p-8">
            <h2 className="text-2xl font-serif font-bold text-amber-950">{t('compensationTitle')}</h2>
            <p className="mt-4 leading-relaxed text-amber-950/85">{t('compensationBody')}</p>
            <p className="mt-4 text-sm leading-relaxed text-amber-950/80">{t('compensationCommitment')}</p>
            <Link href="/terms" className="mt-5 inline-flex items-center text-sm font-semibold text-amber-950 hover:underline">
              {t('termsLink')}
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            </Link>
          </section>
        </div>

        <section className="mt-12 rounded-2xl bg-slate-950 px-6 py-10 text-center text-white lg:px-10 lg:py-12">
          <h2 className="text-3xl font-serif font-bold">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">{t('ctaBody')}</p>
          <Link
            href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } }}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {t('ctaButton')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </section>
      </div>
    </main>
  )
}
