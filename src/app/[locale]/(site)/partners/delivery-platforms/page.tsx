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
import PartnersProcurementMatrix from '@/components/partners/PartnersProcurementMatrix'
import PartnersSectionHero from '@/components/partners/PartnersSectionHero'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import PartnersSoftPrompt from '@/components/partners/PartnersSoftPrompt'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const path = '/partners/delivery-platforms'
const ogImage = '/images/partners/partner-hero-delivery.jpg'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('deliveryPlatformsMetadataTitle'),
    description: t('deliveryPlatformsMetadataDescription'),
    ogImage,
    ogImageAlt: t('deliveryPlatformsTitle'),
  })
}

export default async function DeliveryPlatformsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })
  const tBreadcrumb = await getTranslations('breadcrumb')
  const tCommon = await getTranslations('common')

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tBreadcrumb('home'), path: '' },
            { name: t('breadcrumbTitle'), path: '/partners' },
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
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
        secondaryCta={{
          label: t('deliverySecondaryCta'),
          href: '/services/digital',
        }}
      />

      <PartnersSectionNav current={path} />

      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Breadcrumb
            items={[
              { label: tBreadcrumb('home'), href: '/' },
              { label: t('breadcrumbTitle'), href: '/partners' },
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
        <p className="mb-8 max-w-3xl text-base leading-7 text-slate-600">{t('deliveryPlatformsContrast')}</p>
        <PartnersDirectoryList groupId="delivery-platforms" showHeading={false} />
        <div className="mt-12">
          <PartnersProcurementMatrix groupId="delivery-platforms" />
        </div>
        <div className="mt-14 space-y-10 border-t border-slate-200 pt-12">
          <PartnersProofVignette imageSrc={ogImage} pagePath={path} />
          <PartnersOutcomeVignette imageSrc="/images/partners/partner-outcome-access.webp" pagePath={path} />
        </div>
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
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
        secondaryCta={{
          label: t('deliverySecondaryCta'),
          href: '/services/digital',
        }}
      />

      <StickyMobileCTA
        label={t('deliveryPrimaryCta')}
        sublabel={tCommon('ctaSubtext')}
        intent="consulting"
        focus="technology"
        brandMark
        analyticsEvent="partners_sticky_cta"
        analyticsParams={{ path }}
      />
    </div>
  )
}
