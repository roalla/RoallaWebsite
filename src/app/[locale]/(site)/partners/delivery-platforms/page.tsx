import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import StickyMobileCTA from '@/components/StickyMobileCTA'
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
  const tCommon = await getTranslations('common')

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

      <PartnersSectionHero
        eyebrow={t('organizationsEyebrow')}
        title={t('deliveryPlatformsTitle')}
        description={t('deliveryPlatformsDescription')}
        imageSrc="/images/partners/partner-outcome-evaluate.webp"
        tone="slate"
        primaryCta={{
          label: t('deliveryPrimaryCta'),
          href: '/services/digital',
        }}
        secondaryCta={{
          label: t('deliverySecondaryCta'),
          href: '/services/technology-advisory',
        }}
      />

      <PartnersSectionNav current={path} />

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <PartnersDirectoryList groupId="delivery-platforms" showHeading={false} />
      </div>

      <PartnersClosingCta
        title={t('deliveryCloseTitle')}
        body={t('deliveryCloseBody')}
        primaryCta={{
          label: t('deliveryPrimaryCta'),
          href: '/services/digital',
        }}
        secondaryCta={{
          label: t('deliverySecondaryCta'),
          href: '/services/technology-advisory',
        }}
      />

      <StickyMobileCTA
        label={t('deliveryPrimaryCta')}
        sublabel={tCommon('ctaSubtext')}
        href="/services/digital"
        brandMark
      />
    </main>
  )
}
