import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import PartnersClosingCta from '@/components/partners/PartnersClosingCta'
import PartnersCompensationSection from '@/components/partners/PartnersCompensationSection'
import PartnersSectionHero from '@/components/partners/PartnersSectionHero'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const path = '/partners/compensation'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('compensationMetadataTitle'),
    description: t('compensationMetadataDescription'),
  })
}

export default async function CompensationPage({ params }: Props) {
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
            { name: t('compensationTitle') },
          ]),
          webPageJsonLd(locale, path, t('compensationTitle'), t('compensationMetadataDescription')),
        ]}
      />

      <div className="sr-only">
        <Breadcrumb
          items={[
            { label: tBreadcrumb('home'), href: '/' },
            { label: t('title'), href: '/partners' },
            { label: t('compensationTitle') },
          ]}
        />
      </div>

      <PartnersSectionHero
        eyebrow={t('eyebrow')}
        title={t('compensationTitle')}
        description={t('compensationHeroDescription')}
        imageSrc="/images/partners/partner-outcome-disclose.webp"
        tone="slate"
        primaryCta={{
          label: t('compensationPrimaryCta'),
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
        secondaryCta={{
          label: t('compensationSecondaryCta'),
          href: '/terms',
        }}
      />

      <PartnersSectionNav current={path} />

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <PartnersCompensationSection />
      </div>

      <PartnersClosingCta
        title={t('compensationCloseTitle')}
        body={t('compensationCloseBody')}
        primaryCta={{
          label: t('compensationPrimaryCta'),
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
        secondaryCta={{
          label: t('compensationSecondaryCta'),
          href: '/terms',
        }}
      />

      <StickyMobileCTA
        label={t('compensationPrimaryCta')}
        sublabel={tCommon('ctaSubtext')}
        intent="consulting"
        focus="technology"
        brandMark
      />
    </main>
  )
}
