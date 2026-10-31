import type { Metadata } from 'next'
import WebsiteEstimateBuilder from '@/components/WebsiteEstimateBuilder'
import WebsiteApproachComparison from '@/components/WebsiteApproachComparison'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const french = locale === 'fr'
  return buildPageMetadata({
    locale,
    path: '/website-estimate',
    title: french ? 'Estimation de forfait Web | ROALLA' : 'Website Package Estimator | ROALLA',
    description: french
      ? 'Préparez une estimation préliminaire pour un site Web, un domaine, un courriel professionnel, les médias sociaux et l’hébergement.'
      : 'Build a preliminary estimate for a website, domain, professional email, social setup, and hosting.',
  })
}

export default async function WebsiteEstimatePage({ params }: Props) {
  const { locale } = await params
  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <main className="mx-auto max-w-7xl">
          <WebsiteEstimateBuilder />
          <WebsiteApproachComparison locale={locale} />
        </main>
      </div>
    </div>
  )
}
