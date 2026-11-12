import type { Metadata } from 'next'
import WorkshopEstimateBuilder from '@/components/WorkshopEstimateBuilder'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const french = locale === 'fr'
  return buildPageMetadata({
    locale,
    path: '/workshop-estimate',
    title: french ? 'Estimation d’atelier | ROALLA' : 'Workshop Estimator | ROALLA',
    description: french
      ? 'Estimez une séance d’atelier facilitée: 1 heure, demi-journée ou journée complète, avec options et zone de déplacement incluse.'
      : 'Estimate a facilitated workshop session: 1 hour, half day, or full day, with add-ons and included travel zone.',
  })
}

export default async function WorkshopEstimatePage() {
  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-7xl">
          <WorkshopEstimateBuilder />
        </div>
      </div>
    </div>
  )
}
