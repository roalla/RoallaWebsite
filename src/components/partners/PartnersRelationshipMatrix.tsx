import { getLocale, getTranslations } from 'next-intl/server'
import {
  ecosystemGovernance,
  formatReviewedMonth,
  type EcosystemPortfolioTag,
} from '@/lib/ecosystem-governance'
import { ecosystemDirectoryGroups, type EcosystemKey } from '@/lib/technologyEcosystem'
import Reveal from '@/components/motion/Reveal'
import PartnersRelationshipMatrixView from '@/components/partners/PartnersRelationshipMatrixView'

type Props = {
  groupId?: (typeof ecosystemDirectoryGroups)[number]['id']
  /** When true and no groupId, show Telarus only. Overview should omit this and get the full matrix. */
  telarusOnly?: boolean
}

export default async function PartnersRelationshipMatrix({
  groupId,
  telarusOnly = false,
}: Props) {
  const t = await getTranslations('partnersPlatforms')
  const tEco = await getTranslations('home.technologyEcosystem')
  const locale = await getLocale()

  const keys: EcosystemKey[] = []
  if (groupId) {
    const group = ecosystemDirectoryGroups.find((entry) => entry.id === groupId)
    if (group) {
      for (const key of group.keys) keys.push(key)
    }
  } else if (telarusOnly) {
    keys.push('telarus')
  } else {
    keys.push('telarus')
    for (const group of ecosystemDirectoryGroups) {
      for (const key of group.keys) keys.push(key)
    }
  }

  const uniqueKeys = Array.from(new Set(keys))
  const portfolioLabel = (tag: EcosystemPortfolioTag) => t(`portfolio_${tag}`)

  const rows = uniqueKeys.map((key) => {
    const gov = ecosystemGovernance[key]
    return {
      key,
      name: tEco(`${key}.name`),
      portfolioLabels: gov.portfolio.map(portfolioLabel),
      access: t(`access_${gov.accessType}`),
      exclusivity: t('exclusivity_non_exclusive'),
      geography: t(`geo_${gov.geography}`),
      compensation: t(`comp_${gov.compensation}`),
      reviewed: formatReviewedMonth(gov.reviewedAt, locale),
    }
  })

  return (
    <Reveal>
      <PartnersRelationshipMatrixView
        caption={t('matrixCaption')}
        orgLabel={t('matrixOrg')}
        portfolioLabel={t('matrixPortfolio')}
        accessLabel={t('matrixAccess')}
        exclusivityLabel={t('matrixExclusivity')}
        geographyLabel={t('matrixGeography')}
        compensationLabel={t('matrixCompensation')}
        reviewedLabel={t('matrixReviewed')}
        note={t('matrixNote')}
        jumpHint={t('matrixJumpHint')}
        rows={rows}
      />
    </Reveal>
  )
}
