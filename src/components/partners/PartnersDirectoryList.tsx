import { getTranslations } from 'next-intl/server'
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
  const group = ecosystemDirectoryGroups.find((entry) => entry.id === groupId)
  if (!group) return null

  const items = buildPartnersDirectoryItems(groupId, (key) => tEco(key))

  return (
    <PartnersDirectoryExplorer
      headingId={`${group.id}-heading`}
      heading={t(group.titleKey)}
      showHeading={showHeading}
      businessNeedLabel={t('businessNeedLabel')}
      organizationsNote={t('organizationsNote')}
      filterAllLabel={t('directoryFilterAll')}
      emptyLabel={t('directoryFilterEmpty')}
      items={items}
    />
  )
}
