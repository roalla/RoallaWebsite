import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import PartnersClosingCta from '@/components/partners/PartnersClosingCta'
import PartnersHubContinue from '@/components/partners/PartnersHubContinue'
import PartnersPageActions from '@/components/partners/PartnersPageActions'
import PartnersProcurementMatrix from '@/components/partners/PartnersProcurementMatrix'
import PartnersProofVignette from '@/components/partners/PartnersProofVignette'
import PartnersRelationshipModel from '@/components/partners/PartnersRelationshipModel'
import PartnersSectionHero from '@/components/partners/PartnersSectionHero'
import PartnersSectionNav from '@/components/partners/PartnersSectionNav'
import PartnersSoftPrompt from '@/components/partners/PartnersSoftPrompt'
import PartnersTelarusSection from '@/components/partners/PartnersTelarusSection'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

const path = '/partners/strategic-relationships'
const ogImage = '/images/partners/partner-hero-strategic.jpg'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPlatforms' })

  return buildPageMetadata({
    locale,
    path,
    title: t('strategicMetadataTitle'),
    description: t('strategicMetadataDescription'),
    ogImage,
    ogImageAlt: t('strategicRelationshipsTitle'),
  })
}

export default async function StrategicRelationshipsPage({ params }: Props) {
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
            { name: t('strategicRelationshipsTitle') },
          ]),
          webPageJsonLd(locale, path, t('strategicRelationshipsTitle'), t('strategicMetadataDescription')),
        ]}
      />

      <PartnersSectionHero
        pagePath={path}
        eyebrow={t('strategicRelationshipsTitle')}
        title={t('strategicHeroTitle')}
        description={t('strategicHeroDescription')}
        imageSrc={ogImage}
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

      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Breadcrumb
            items={[
              { label: tBreadcrumb('home'), href: '/' },
              { label: t('breadcrumbTitle'), href: '/partners' },
              { label: t('strategicRelationshipsTitle') },
            ]}
          />
          <PartnersPageActions pagePath={path} pageTitle={t('strategicRelationshipsTitle')} />
        </div>
        <div className="mt-6">
          <PartnersHubContinue />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <section className="mb-10 max-w-3xl" aria-labelledby="strategic-lead-heading">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('strategicLeadEyebrow')}</p>
          <h2 id="strategic-lead-heading" className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
            {t('strategicLeadTitle')}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">{t('strategicLeadBody')}</p>
        </section>
        <PartnersRelationshipModel />
        <PartnersTelarusSection />
        <div className="mt-10">
          <PartnersProcurementMatrix telarusOnly />
        </div>
        <PartnersProofVignette imageSrc={ogImage} pagePath={path} />
      </div>

      <PartnersSoftPrompt
        title={t('softPromptTitle')}
        body={t('softPromptBody')}
        ctaLabel={t('softPromptCta')}
        dismissLabel={t('softPromptDismiss')}
      />

      <PartnersClosingCta
        pagePath={path}
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
        analyticsEvent="partners_sticky_cta"
        analyticsParams={{ path }}
      />
    </div>
  )
}
