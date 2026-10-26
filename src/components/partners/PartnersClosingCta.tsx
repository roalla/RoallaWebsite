import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function PartnersClosingCta() {
  const t = await getTranslations('partnersPlatforms')

  return (
    <section
      data-header-tone="dark"
      className="bg-slate-950 px-4 py-14 text-center text-white sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-3xl font-bold text-white">{t('ctaTitle')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">{t('ctaBody')}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={{ pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } }}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary-light"
          >
            {t('ctaButton')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/services/digital"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t('digitalLink')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
