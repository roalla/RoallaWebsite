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

const path = '/partners/technology-providers'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('technologyProvidersMetadataTitle'),
    description: t('technologyProvidersMetadataDescription'),
  })
}

export default async function TechnologyProvidersPage({ params }: Props) {
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
            { name: t('technologyProvidersTitle') },
          ]),
          webPageJsonLd(locale, path, t('technologyProvidersTitle'), t('technologyProvidersMetadataDescription')),
        ]}
      />

      <div className="sr-only">
        <Breadcrumb
          items={[
            { label: tBreadcrumb('home'), href: '/' },
            { label: t('title'), href: '/partners' },
            { label: t('technologyProvidersTitle') },
          ]}
        />
      </div>

      <PartnersSectionHero
        eyebrow={t('organizationsEyebrow')}
        title={t('technologyProvidersTitle')}
        description={t('technologyProvidersDescription')}
        imageSrc="/images/partners/partner-outcome-evaluate.webp"
        primaryCta={{
          label: t('providersPrimaryCta'),
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
        secondaryCta={{
          label: t('providersSecondaryCta'),
          href: '/partners/evaluation-standard',
        }}
      />

      <PartnersSectionNav current={path} />

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <PartnersDirectoryList groupId="technology-providers" showHeading={false} />
      </div>

      <PartnersClosingCta
        title={t('providersCloseTitle')}
        body={t('providersCloseBody')}
        primaryCta={{
          label: t('providersPrimaryCta'),
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
        secondaryCta={{
          label: t('providersSecondaryCta'),
          href: '/partners/evaluation-standard',
        }}
      />

      <StickyMobileCTA
        label={t('providersPrimaryCta')}
        sublabel={tCommon('ctaSubtext')}
        intent="consulting"
        focus="technology"
      />
    </main>
  )
}
