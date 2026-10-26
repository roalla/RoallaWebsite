import { getLocale, getTranslations } from 'next-intl/server'
import PartnersBrandLockup from '@/components/partners/PartnersBrandLockup'
import PartnersEnterpriseArtifacts from '@/components/partners/PartnersEnterpriseArtifacts'
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
  const tCommon = await getTranslations('common')
  const locale = await getLocale()
  const criteria = standardKeys.map((key) => t(key))

  return (
    <>
      <h2 id="evaluation-standard-heading" className="sr-only">
        {t('standardTitle')}
      </h2>
      <div className="mb-8">
        <PartnersBrandLockup
          companyName={tCommon('companyName')}
          label={t('brandStandardLabel')}
          size="md"
          tone="light"
        />
      </div>
      <PartnersEvaluationChecklist
        intro={t('standardIntro')}
        progressLabel={t('evaluationProgress')}
        criteria={standardKeys.map((key) => ({ key, label: t(key) }))}
        primaryCtaLabel={t('evaluationPrimaryCta')}
        secondaryCtaLabel={t('evaluationSecondaryCta')}
        compensationLinkLabel={t('evaluationCompensationLink')}
      />
      <PartnersEnterpriseArtifacts locale={locale} criteria={criteria} />
    </>
  )
}
