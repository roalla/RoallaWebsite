import { getLocale, getTranslations } from 'next-intl/server'
import {
  ecosystemGovernance,
  formatReviewedMonth,
} from '@/lib/ecosystem-governance'
import { ecosystemDirectoryGroups, type EcosystemKey } from '@/lib/technologyEcosystem'
import Reveal from '@/components/motion/Reveal'

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

  return (
    <Reveal className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">{t('matrixCaption')}</caption>
        <thead>
          <tr className="border-b border-slate-300 text-xs uppercase tracking-[0.12em] text-slate-500">
            <th scope="col" className="py-3 pr-4 font-bold">
              {t('matrixOrg')}
            </th>
            <th scope="col" className="py-3 pr-4 font-bold">
              {t('matrixAccess')}
            </th>
            <th scope="col" className="py-3 pr-4 font-bold">
              {t('matrixExclusivity')}
            </th>
            <th scope="col" className="py-3 pr-4 font-bold">
              {t('matrixGeography')}
            </th>
            <th scope="col" className="py-3 pr-4 font-bold">
              {t('matrixCompensation')}
            </th>
            <th scope="col" className="py-3 font-bold">
              {t('matrixReviewed')}
            </th>
          </tr>
        </thead>
        <tbody>
          {uniqueKeys.map((key) => {
            const gov = ecosystemGovernance[key]
            return (
              <tr key={key} className="border-b border-slate-200 align-top">
                <th scope="row" className="py-3.5 pr-4 font-semibold text-slate-950">
                  {tEco(`${key}.name`)}
                </th>
                <td className="py-3.5 pr-4 text-slate-700">{t(`access_${gov.accessType}`)}</td>
                <td className="py-3.5 pr-4 text-slate-700">{t('exclusivity_non_exclusive')}</td>
                <td className="py-3.5 pr-4 text-slate-700">{t(`geo_${gov.geography}`)}</td>
                <td className="py-3.5 pr-4 text-slate-700">{t(`comp_${gov.compensation}`)}</td>
                <td className="py-3.5 text-slate-700">{formatReviewedMonth(gov.reviewedAt, locale)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-4 text-xs leading-5 text-slate-500">{t('matrixNote')}</p>
    </Reveal>
  )
}
