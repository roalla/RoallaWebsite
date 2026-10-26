import { getLocale, getTranslations } from 'next-intl/server'
import PartnersDirectoryExplorer from '@/components/partners/PartnersDirectoryExplorer'
import { buildPartnersDirectoryItems } from '@/lib/partners-directory'
import { ecosystemDirectoryGroups } from '@/lib/technologyEcosystem'

type GroupId = (typeof ecosystemDirectoryGroups)[number]['id']

type Props = {
  groupId: GroupId
  showHeading?: boolean
}

export default async function PartnersDirectoryList({ groupId, showHeading = true }: Props) {
  const t = await getTranslations('partnersPlatforms')
  const tEco = await getTranslations('home.technologyEcosystem')
  const locale = await getLocale()
  const group = ecosystemDirectoryGroups.find((entry) => entry.id === groupId)
  if (!group) return null

  const items = buildPartnersDirectoryItems(groupId, (key) => tEco(key), locale)

  return (
    <PartnersDirectoryExplorer
      headingId={`${group.id}-heading`}
      heading={t(group.titleKey)}
      showHeading={showHeading}
      businessNeedLabel={t('businessNeedLabel')}
      fitLabel={t('fitLabel')}
      reviewedLabel={t('matrixReviewed')}
      organizationsNote={t('organizationsNote')}
      filterAllLabel={t('directoryFilterAll')}
      emptyLabel={t('directoryFilterEmpty')}
      curatorLabel={t('brandCuratorLabel')}
      searchLabel={t('directorySearchLabel')}
      searchPlaceholder={t('directorySearchPlaceholder')}
      audienceAllLabel={t('audienceFilterAll')}
      exclusivityLabel={t('exclusivity_non_exclusive')}
      accessLabels={{
        advisor: t('access_advisor'),
        verified_supplier: t('access_verified_supplier'),
        service_partner: t('access_service_partner'),
        independent_reseller: t('access_independent_reseller'),
        provider: t('access_provider'),
      }}
      geoLabels={{
        canada: t('geo_canada'),
        north_america: t('geo_north_america'),
        global: t('geo_global'),
      }}
      compLabels={{
        advisor_channel: t('comp_advisor_channel'),
        referral_possible: t('comp_referral_possible'),
        reseller_possible: t('comp_reseller_possible'),
        none_listed: t('comp_none_listed'),
      }}
      audienceLabels={{
        mid_market: t('audience_mid_market'),
        multi_site: t('audience_multi_site'),
        operations_heavy: t('audience_operations_heavy'),
      }}
      items={items}
    />
  )
}
