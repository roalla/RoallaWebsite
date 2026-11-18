import type { Metadata } from 'next'
import PciDssEstimateBuilder from '@/components/PciDssEstimateBuilder'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const french = locale === 'fr'
  return buildPageMetadata({
    locale,
    path: '/pci-dss-readiness-estimate',
    title: french ? 'Estimateur de préparation PCI DSS | ROALLA' : 'PCI DSS Readiness Estimator | ROALLA',
    description: french
      ? 'Estimez une revue de préparation PCI DSS selon vos canaux de paiement, votre intégration, vos preuves et le soutien requis.'
      : 'Estimate a PCI DSS readiness review based on payment channels, integration, evidence, and required support.',
  })
}

export default function PciDssReadinessEstimatePage() {
  return <div className="page-shell"><div className="container mx-auto px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28"><div className="mx-auto max-w-7xl"><PciDssEstimateBuilder /></div></div></div>
}
