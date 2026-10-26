import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import PartnersClosingCta from '@/components/partners/PartnersClosingCta'
import PartnersSectionHero from '@/components/partners/PartnersSectionHero'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import PartnersTelarusSection from '@/components/partners/PartnersTelarusSection'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const path = '/partners/strategic-relationships'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('strategicMetadataTitle'),
    description: t('strategicMetadataDescription'),
  })
}

export default async function StrategicRelationshipsPage({ params }: Props) {
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
            { name: t('strategicRelationshipsTitle') },
          ]),
          webPageJsonLd(locale, path, t('strategicRelationshipsTitle'), t('strategicMetadataDescription')),
        ]}
      />

      <div className="sr-only">
        <Breadcrumb
          items={[
            { label: tBreadcrumb('home'), href: '/' },
            { label: t('title'), href: '/partners' },
            { label: t('strategicRelationshipsTitle') },
          ]}
        />
      </div>

      <PartnersSectionHero
        eyebrow={t('strategicRelationshipsTitle')}
        title={t('telarusTitle')}
        description={t('strategicHeroDescription')}
        imageSrc="/images/partners/partner-outcome-access.webp"
        primaryCta={{
          label: t('strategicPrimaryCta'),
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
        secondaryCta={{
          label: t('strategicSecondaryCta'),
          href: '/tools/technology-decision-brief',
        }}
      />

      <PartnersSectionNav current={path} />

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <PartnersTelarusSection />
      </div>

      <PartnersClosingCta
        title={t('strategicCloseTitle')}
        body={t('strategicCloseBody')}
        primaryCta={{
          label: t('strategicPrimaryCta'),
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
        secondaryCta={{
          label: t('strategicSecondaryCta'),
          href: '/tools/technology-decision-brief',
        }}
      />

      <StickyMobileCTA
        label={t('strategicPrimaryCta')}
        sublabel={tCommon('ctaSubtext')}
        intent="consulting"
        focus="technology"
        brandMark
      />
    </main>
  )
}
