import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import PartnersClosingCta from '@/components/partners/PartnersClosingCta'
import PartnersCompensationSection from '@/components/partners/PartnersCompensationSection'
import PartnersEnterpriseFaq, { partnersEnterpriseFaqJsonLd } from '@/components/partners/PartnersEnterpriseFaq'
import PartnersGovernanceBands from '@/components/partners/PartnersGovernanceBands'
import PartnersHubContinue from '@/components/partners/PartnersHubContinue'
import PartnersPageActions from '@/components/partners/PartnersPageActions'
import PartnersSectionHero from '@/components/partners/PartnersSectionHero'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const path = '/partners/compensation'
const ogImage = '/images/partners/partner-outcome-disclose.webp'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('compensationMetadataTitle'),
    description: t('compensationMetadataDescription'),
    ogImage,
    ogImageAlt: t('outcome3Alt'),
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
          partnersEnterpriseFaqJsonLd((key) => t(key)),
        ]}
      />

      <PartnersSectionHero
        pagePath={path}
        eyebrow={t('eyebrow')}
        title={t('compensationTitle')}
        description={t('compensationHeroDescription')}
        imageSrc={ogImage}
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

      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Breadcrumb
            items={[
              { label: tBreadcrumb('home'), href: '/' },
              { label: t('title'), href: '/partners' },
              { label: t('compensationTitle') },
            ]}
          />
          <PartnersPageActions pagePath={path} pageTitle={t('compensationTitle')} />
        </div>
        <div className="mt-6">
          <PartnersHubContinue />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <PartnersCompensationSection />
        <div className="mt-12">
          <PartnersGovernanceBands />
        </div>
        <PartnersEnterpriseFaq />
      </div>

      <PartnersClosingCta
        pagePath={path}
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
        analyticsEvent="partners_sticky_cta"
        analyticsParams={{ path }}
      />
    </main>
  )
}
