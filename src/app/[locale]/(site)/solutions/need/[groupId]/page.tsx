import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import OutcomeGroupNeedPage from '@/components/solutions/OutcomeGroupNeedPage'
import { buildPageMetadata } from '@/lib/page-metadata'
import {
  OUTCOME_GROUP_IDS,
  isOutcomeGroupId,
  outcomeGroups,
} from '@/lib/solution-outcome-pages'
import { solutionsByNeedContent } from '@/lib/solutions-by-need'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = { params: Promise<{ locale: string; groupId: string }> }

export function generateStaticParams() {
  return OUTCOME_GROUP_IDS.flatMap((groupId) => [
    { locale: 'en', groupId },
    { locale: 'fr', groupId },
  ])
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, groupId } = await params
  if (!isOutcomeGroupId(groupId)) return {}
  const language = locale === 'fr' ? 'fr' : 'en'
  const group = outcomeGroups[language].find((item) => item.id === groupId)
  if (!group) return {}

  return buildPageMetadata({
    locale: language,
    path: `/solutions/need/${groupId}`,
    title: `${group.title} | ROALLA`,
    description: group.description,
  })
}

export default async function OutcomeGroupNeedRoute({ params }: Props) {
  const { locale, groupId } = await params
  if (!isOutcomeGroupId(groupId)) notFound()

  const language = locale === 'fr' ? 'fr' : 'en'
  const group = outcomeGroups[language].find((item) => item.id === groupId)
  if (!group) notFound()

  const solutions = solutionsByNeedContent[language]
  const path = `/solutions/need/${groupId}`

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(language, path, group.title, group.description),
          breadcrumbJsonLd(language, [
            { name: language === 'fr' ? 'Accueil' : 'Home', path: '' },
            { name: solutions.navLabel, path: '/solutions' },
            { name: group.title },
          ]),
        ]}
      />
      <OutcomeGroupNeedPage
        groupId={groupId}
        locale={language}
        title={group.title}
        description={group.description}
        browseLabel={solutions.pathwaysEyebrow}
        assessmentLabel={solutions.assessmentLabel}
        assessmentDescription={solutions.assessmentDescription}
        assessmentCta={solutions.heroPrimary}
      />
    </>
  )
}
