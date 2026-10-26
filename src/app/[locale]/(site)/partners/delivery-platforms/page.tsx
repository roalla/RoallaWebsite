import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import PartnersClosingCta from '@/components/partners/PartnersClosingCta'
import PartnersDirectoryList from '@/components/partners/PartnersDirectoryList'
import PartnersHubContinue from '@/components/partners/PartnersHubContinue'
import PartnersOutcomeVignette from '@/components/partners/PartnersOutcomeVignette'
import PartnersPageActions from '@/components/partners/PartnersPageActions'
import PartnersProofVignette from '@/components/partners/PartnersProofVignette'
import PartnersRelationshipMatrix from '@/components/partners/PartnersRelationshipMatrix'
import PartnersSectionHero from '@/components/partners/PartnersSectionHero'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import PartnersSoftPrompt from '@/components/partners/PartnersSoftPrompt'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const path = '/partners/delivery-platforms'
const ogImage = '/images/partners/partner-outcome-access.webp'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('deliveryPlatformsMetadataTitle'),
    description: t('deliveryPlatformsMetadataDescription'),
    ogImage,
    ogImageAlt: t('outcome1Alt'),
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

      <PartnersSectionHero
        pagePath={path}
        eyebrow={t('organizationsEyebrow')}
        title={t('deliveryPlatformsTitle')}
        description={t('deliveryPlatformsDescription')}
        imageSrc={ogImage}
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

      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Breadcrumb
            items={[
              { label: tBreadcrumb('home'), href: '/' },
              { label: t('title'), href: '/partners' },
              { label: t('deliveryPlatformsTitle') },
            ]}
          />
          <PartnersPageActions pagePath={path} pageTitle={t('deliveryPlatformsTitle')} />
        </div>
        <div className="mt-6">
          <PartnersHubContinue />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <PartnersProofVignette />
        <div className="mt-10">
          <PartnersOutcomeVignette />
        </div>
        <div className="mb-10 mt-12">
          <h2 className="font-serif text-2xl font-bold text-slate-950">{t('matrixTitle')}</h2>
          <div className="mt-6">
            <PartnersRelationshipMatrix groupId="delivery-platforms" />
          </div>
        </div>
        <PartnersDirectoryList groupId="delivery-platforms" showHeading={false} />
      </div>

      <PartnersSoftPrompt
        title={t('softPromptTitle')}
        body={t('softPromptBody')}
        ctaLabel={t('softPromptCta')}
        dismissLabel={t('softPromptDismiss')}
      />

      <PartnersClosingCta
        pagePath={path}
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
        analyticsEvent="partners_sticky_cta"
        analyticsParams={{ path }}
      />
    </main>
  )
}
