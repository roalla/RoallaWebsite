import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import PartnersClosingCta from '@/components/partners/PartnersClosingCta'
import PartnersEnterpriseEngage from '@/components/partners/PartnersEnterpriseEngage'
import PartnersEnterpriseFaq, { partnersEnterpriseFaqJsonLd } from '@/components/partners/PartnersEnterpriseFaq'
import PartnersEvaluationSection from '@/components/partners/PartnersEvaluationSection'
import PartnersHubContinue from '@/components/partners/PartnersHubContinue'
import PartnersPageActions from '@/components/partners/PartnersPageActions'
import PartnersSectionHero from '@/components/partners/PartnersSectionHero'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const path = '/partners/evaluation-standard'
const ogImage = '/images/partners/partner-outcome-evaluate.webp'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('evaluationMetadataTitle'),
    description: t('evaluationMetadataDescription'),
    ogImage,
    ogImageAlt: t('outcome2Alt'),
  })
}

export default async function EvaluationStandardPage({ params }: Props) {
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
            { name: t('standardTitle') },
          ]),
          webPageJsonLd(locale, path, t('standardTitle'), t('evaluationMetadataDescription')),
          partnersEnterpriseFaqJsonLd((key) => t(key)),
        ]}
      />

      <PartnersSectionHero
        pagePath={path}
        eyebrow={t('eyebrow')}
        title={t('standardTitle')}
        description={t('evaluationHeroDescription')}
        imageSrc={ogImage}
        primaryCta={{
          label: t('evaluationPrimaryCta'),
          href: '/tools/technology-decision-brief',
        }}
        secondaryCta={{
          label: t('evaluationSecondaryCta'),
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
      />

      <PartnersSectionNav current={path} />

      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Breadcrumb
            items={[
              { label: tBreadcrumb('home'), href: '/' },
              { label: t('title'), href: '/partners' },
              { label: t('standardTitle') },
            ]}
          />
          <PartnersPageActions pagePath={path} pageTitle={t('standardTitle')} />
        </div>
        <div className="mt-6">
          <PartnersHubContinue />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <PartnersEvaluationSection />
        <PartnersEnterpriseFaq />
        <PartnersEnterpriseEngage />
      </div>

      <PartnersClosingCta
        pagePath={path}
        title={t('evaluationCloseTitle')}
        body={t('evaluationCloseBody')}
        primaryCta={{
          label: t('evaluationPrimaryCta'),
          href: '/tools/technology-decision-brief',
        }}
        secondaryCta={{
          label: t('evaluationSecondaryCta'),
          href: { pathname: '/contact', query: { intent: 'consulting', focus: 'technology' } },
        }}
      />

      <StickyMobileCTA
        label={t('evaluationPrimaryCta')}
        sublabel={tCommon('ctaSubtext')}
        href="/tools/technology-decision-brief"
        brandMark
        analyticsEvent="partners_sticky_cta"
        analyticsParams={{ path }}
      />
    </main>
  )
}
