import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReviewCampaignPage from '@/components/campaigns/ReviewCampaignPage'
import { buildPageMetadata } from '@/lib/page-metadata'
import { campaignReviewIds, getCampaignReview, type CampaignReviewId } from '@/lib/campaign-review-content'

type Props = { params: Promise<{ locale: string; campaign: string }> }

export function generateStaticParams() {
  return campaignReviewIds.map((campaign) => ({ campaign }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, campaign } = await params
  const page = getCampaignReview(campaign, locale)
  if (!page) return {}
  return buildPageMetadata({ locale, path: page.path, title: page.metadataTitle, description: page.metadataDescription })
}

export default async function CampaignPage({ params }: Props) {
  const { locale, campaign } = await params
  const page = getCampaignReview(campaign, locale)
  if (!page) notFound()
  return <ReviewCampaignPage campaign={campaign as CampaignReviewId} locale={locale} />
}
