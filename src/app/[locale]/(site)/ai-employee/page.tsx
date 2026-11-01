import type { Metadata } from 'next'
import AiEmployeeLanding from '@/components/AiEmployeeLanding'
import JsonLd from '@/components/JsonLd'
import { aiEmployeeContent } from '@/lib/ai-employee-content'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = { params: Promise<{ locale: string }> }

const path = '/ai-employee'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const content = aiEmployeeContent[locale === 'fr' ? 'fr' : 'en']
  return buildPageMetadata({
    locale,
    path,
    title: content.metadataTitle,
    description: content.metadataDescription,
  })
}

export default async function AiEmployeePage({ params }: Props) {
  const { locale } = await params
  const language = locale === 'fr' ? 'fr' : 'en'
  const content = aiEmployeeContent[language]

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(language, path, content.eyebrow, content.metadataDescription),
          ...servicePageJsonLd({
            locale: language,
            path,
            name: content.eyebrow,
            description: content.metadataDescription,
            serviceType: language === 'fr' ? 'Employé IA par industrie' : 'AI Employee by industry',
            offers: content.industries.flatMap((item) =>
              item.audiences.flatMap((audience) =>
                audience.uses.slice(0, 2).map((use) => ({
                  name: `${item.shortLabel}: ${use.title}`,
                  description: use.description,
                })),
              ),
            ),
            faqs: content.faqs,
          }),
          breadcrumbJsonLd(language, [
            { name: language === 'fr' ? 'Accueil' : 'Home', path: '' },
            { name: content.eyebrow },
          ]),
        ]}
      />
      <AiEmployeeLanding locale={language} content={content} />
    </>
  )
}
