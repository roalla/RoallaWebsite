import type { Metadata } from 'next'
import EmailReachEstimateBuilder from '@/components/EmailReachEstimateBuilder'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const french = locale === 'fr'
  return buildPageMetadata({
    locale,
    path: '/email-reach-estimate',
    title: french ? 'Estimation de portée courriel | ROALLA' : 'Email Reach Estimator | ROALLA',
    description: french
      ? 'Préparez une estimation préliminaire pour la configuration courriel et l’arrivée en boîte de réception.'
      : 'Build a preliminary estimate for email setup and inbox reach work.',
  })
}

export default async function EmailReachEstimatePage() {
  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <main className="mx-auto max-w-7xl">
          <EmailReachEstimateBuilder />
        </main>
      </div>
    </div>
  )
}
