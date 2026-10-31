import type { Metadata } from 'next'
import VisibilityImprovementEstimateBuilder from '@/components/VisibilityImprovementEstimateBuilder'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const french = locale === 'fr'
  return buildPageMetadata({
    locale,
    path: '/visibility-improvement-estimate',
    title: french
      ? 'Estimation d’amélioration de visibilité | ROALLA'
      : 'Visibility Improvement Estimator | ROALLA',
    description: french
      ? 'Préparez une estimation préliminaire pour améliorer la façon dont la recherche et l’IA décrivent votre site existant.'
      : 'Build a preliminary estimate for improving how search and AI describe your existing website.',
  })
}

export default async function VisibilityImprovementEstimatePage() {
  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <main className="mx-auto max-w-7xl">
          <VisibilityImprovementEstimateBuilder />
        </main>
      </div>
    </div>
  )
}
