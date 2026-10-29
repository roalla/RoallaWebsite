'use client'

import OutcomeGroupPanel from '@/components/solutions/OutcomeGroupPanel'

type Props = {
  locale: 'en' | 'fr'
  highlighted?: boolean
}

/** @deprecated Prefer OutcomeGroupPanel with groupId="growth-visibility" */
export default function GrowthVisibilityPanel({ locale, highlighted = false }: Props) {
  return <OutcomeGroupPanel groupId="growth-visibility" locale={locale} highlighted={highlighted} />
}
