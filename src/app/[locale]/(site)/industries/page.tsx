import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import IndustryIndexPage from '@/components/industries/IndustryIndexPage'
import { getIndustryHubIndex } from '@/lib/industry-hub-content'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = { params: Promise<{ locale: string }> }

const path = '/industries'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getIndustryHubIndex(locale)
  return buildPageMetadata({
    locale,
    path,
    title: locale === 'fr' ? 'Secteurs | ROALLA' : 'Industries | ROALLA',
    description: copy.lead,
  })
}

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params
  const language = locale === 'fr' ? 'fr' : 'en'
  const copy = getIndustryHubIndex(language)

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(language, path, copy.title, copy.lead),
          breadcrumbJsonLd(language, [
            { name: language === 'fr' ? 'Accueil' : 'Home', path: '' },
            { name: language === 'fr' ? 'Secteurs' : 'Industries' },
          ]),
        ]}
      />
      <IndustryIndexPage locale={language} copy={copy} />
    </>
  )
}
