import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd } from '@/lib/structured-data'
import { ecosystemCtas, ecosystemKeys, ecosystemLogos } from '@/lib/technologyEcosystem'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'providersPage' })

  return buildPageMetadata({
    locale,
    path: '/providers',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function ProvidersPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'providersPage' })
  const tEco = await getTranslations({ locale, namespace: 'home.technologyEcosystem' })
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

        <header className="mx-auto max-w-3xl py-10 text-center lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{t('eyebrow')}</p>
          <h1 className="mt-3 text-4xl font-serif font-extrabold text-slate-900 md:text-5xl">{t('title')}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{t('subtitle')}</p>
        </header>

        <ul className="mx-auto grid max-w-5xl gap-5" aria-label={t('listLabel')}>
          {ecosystemKeys.map((key) => {
            const logo = ecosystemLogos[key]
            const cta = ecosystemCtas[key]

            return (
              <li
                key={key}
                id={key}
                className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex h-16 w-44 shrink-0 items-center justify-center rounded-xl bg-white px-3 ring-1 ring-slate-200">
                      {logo ? (
                        <Image
                          src={logo.src}
                          alt=""
                          width={logo.width}
                          height={logo.height}
                          className={logo.className}
                        />
                      ) : (
                        <span className="text-lg font-extrabold tracking-tight text-slate-900">
                          {tEco(`${key}.wordmark`)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
                        {tEco(`${key}.relationship`)}
                      </p>
                      <h2 className="mt-1 text-2xl font-serif font-bold text-slate-950">{tEco(`${key}.name`)}</h2>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{tEco(`${key}.description`)}</p>
                      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {tEco('valueLabel')}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-800">{tEco(`${key}.value`)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {cta ? (
                  cta.type === 'external' ? (
                    <a
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:text-primary-darker hover:underline"
                    >
                      {tEco(`${key}.cta`)}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </a>
                  ) : (
                    <Link
                      href={cta.href}
                      className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:text-primary-darker hover:underline"
                    >
                      {tEco(`${key}.cta`)}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                  )
                ) : null}
              </li>
            )
          })}
        </ul>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-6 text-slate-500">{t('note')}</p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/services/technology-advisory"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {t('advisoryCta')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </main>
  )
}
