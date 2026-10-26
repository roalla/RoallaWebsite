import { CheckCircle2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const standardKeys = [
  'standard1',
  'standard2',
  'standard3',
  'standard4',
  'standard5',
  'standard6',
  'standard7',
  'standard8',
] as const

type Props = {
  asPageHeading?: boolean
}

export default async function PartnersEvaluationSection({ asPageHeading = false }: Props) {
  const t = await getTranslations('partnersPlatforms')
  const Heading = asPageHeading ? 'h1' : 'h2'

  return (
    <section aria-labelledby="evaluation-standard-heading">
      <Heading id="evaluation-standard-heading" className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
        {t('standardTitle')}
      </Heading>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{t('standardIntro')}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {standardKeys.map((key) => (
          <li key={key} className="flex items-start gap-2.5 text-sm text-slate-700 sm:text-base">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
            {t(key)}
          </li>
        ))}
      </ul>
    </section>
  )
}
