import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import PartnersClosingCta from '@/components/partners/PartnersClosingCta'
import PartnersDirectoryList from '@/components/partners/PartnersDirectoryList'
import PartnersSectionHero from '@/components/partners/PartnersSectionHero'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const path = '/partners/delivery-platforms'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('deliveryPlatformsMetadataTitle'),
    description: t('deliveryPlatformsMetadataDescription'),
  })
}

export default async function DeliveryPlatformsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })
  const tBreadcrumb = await getTranslations('breadcrumb')

  return (
    <main className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tBreadcrumb('home'), path: '' },
            { name: t('title'), path: '/partners' },
            { name: t('deliveryPlatformsTitle') },
          ]),
          webPageJsonLd(locale, path, t('deliveryPlatformsTitle'), t('deliveryPlatformsMetadataDescription')),
        ]}
      />

      <div className="sr-only">
        <Breadcrumb
          items={[
            { label: tBreadcrumb('home'), href: '/' },
            { label: t('title'), href: '/partners' },
            { label: t('deliveryPlatformsTitle') },
          ]}
        />
      </div>

      <div className="pt-20 lg:pt-24">
        <PartnersSectionNav current={path} />
      </div>

      <PartnersSectionHero
        eyebrow={t('organizationsEyebrow')}
        title={t('deliveryPlatformsTitle')}
        description={t('deliveryPlatformsDescription')}
      />

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <PartnersDirectoryList groupId="delivery-platforms" showHeading={false} />
      </div>

      <PartnersClosingCta />
    </main>
  )
}
