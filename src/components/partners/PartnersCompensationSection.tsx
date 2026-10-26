import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

type Props = {
  asPageHeading?: boolean
}

export default async function PartnersCompensationSection({ asPageHeading = false }: Props) {
  const t = await getTranslations('partnersPlatforms')
  const Heading = asPageHeading ? 'h1' : 'h2'

  return (
    <section aria-labelledby="compensation-heading" className="max-w-3xl">
      <Heading id="compensation-heading" className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
        {t('compensationTitle')}
      </Heading>
      <p className="mt-5 leading-relaxed text-slate-700">{t('compensationBody')}</p>
      <p className="mt-4 text-base leading-relaxed text-slate-600">{t('compensationCommitment')}</p>
      <Link href="/terms" className="mt-6 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
        {t('termsLink')}
        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
      </Link>
    </section>
  )
}
