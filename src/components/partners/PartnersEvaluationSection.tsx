import { getTranslations } from 'next-intl/server'
import PartnersEvaluationChecklist from '@/components/partners/PartnersEvaluationChecklist'

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

export default async function PartnersEvaluationSection() {
  const t = await getTranslations('partnersPlatforms')

  return (
    <>
      <h2 id="evaluation-standard-heading" className="sr-only">
        {t('standardTitle')}
      </h2>
      <PartnersEvaluationChecklist
        intro={t('standardIntro')}
        progressLabel={t('evaluationProgress')}
        criteria={standardKeys.map((key) => ({ key, label: t(key) }))}
        primaryCtaLabel={t('evaluationPrimaryCta')}
        secondaryCtaLabel={t('evaluationSecondaryCta')}
        compensationLinkLabel={t('evaluationCompensationLink')}
      />
    </>
  )
}
