import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import UnifiedCommunicationsLanding from '@/components/UnifiedCommunicationsLanding'
import { buildPageMetadata } from '@/lib/page-metadata'
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from '@/lib/structured-data'

type Props = { params: Promise<{ locale: string }> }
const path = '/services/unified-communications-contact-centres-ai-employees'

const seo = {
  en: {
    title: 'Unified Communications, Contact Centres & AI Employees | ROALLA',
    description: 'Design and source UCaaS, CCaaS, cloud calling, omnichannel contact centres and governed AI Employees with vendor-neutral requirements and a staged adoption plan.',
    name: 'Unified Communications, Contact Centres & AI Employees',
  },
  fr: {
    title: 'Communications unifiées, centres de contact et employés IA | ROALLA',
    description: 'Concevez et sourcez UCaaS, CCaaS, téléphonie infonuagique, centres de contact omnicanaux et employés IA gouvernés avec des exigences neutres et un plan d’adoption graduelle.',
    name: 'Communications unifiées, centres de contact et employés IA',
  },
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const language = locale === 'fr' ? 'fr' : 'en'
  return buildPageMetadata({ locale: language, path, title: seo[language].title, description: seo[language].description })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const language = locale === 'fr' ? 'fr' : 'en'
  const content = seo[language]
  return (
    <>
      <JsonLd data={[
        webPageJsonLd(language, path, content.name, content.description),
        ...servicePageJsonLd({ locale: language, path, name: content.name, description: content.description, serviceType: content.name, offers: [
          { name: 'UCaaS', description: language === 'fr' ? 'Téléphonie infonuagique, réunions et collaboration.' : 'Cloud calling, meetings and collaboration.' },
          { name: 'CCaaS', description: language === 'fr' ? 'Centre de contact omnicanal, routage et analytique.' : 'Omnichannel contact centre, routing and analytics.' },
          { name: language === 'fr' ? 'Employés IA' : 'AI Employees', description: language === 'fr' ? 'Assistance de première ligne gouvernée avec relais humain.' : 'Governed frontline assistance with human handoff.' },
        ], faqs: [
          {
            question: language === 'fr' ? 'Quelle est la différence entre UCaaS et CCaaS?' : 'What is the difference between UCaaS and CCaaS?',
            answer: language === 'fr' ? 'UCaaS relie généralement la téléphonie, les réunions et la collaboration des employés. CCaaS orchestre les interactions clients, les files, les canaux, la qualité et l’analytique.' : 'UCaaS generally connects employee calling, meetings and collaboration. CCaaS orchestrates customer interactions, queues, channels, quality and analytics.',
          },
          {
            question: language === 'fr' ? 'Où un employé IA s’intègre-t-il?' : 'Where does an AI Employee fit?',
            answer: language === 'fr' ? 'Un employé IA peut répondre, qualifier, réserver ou relancer dans des limites approuvées, puis transférer à une personne avec le contexte.' : 'An AI Employee can answer, qualify, book or follow up within approved boundaries, then hand off to a person with context.',
          },
        ] }),
        breadcrumbJsonLd(language, [
          { name: language === 'fr' ? 'Accueil' : 'Home', path: '' },
          { name: language === 'fr' ? 'Services' : 'Services', path: '/services/technology-advisory' },
          { name: content.name },
        ]),
      ]} />
      <UnifiedCommunicationsLanding locale={language} />
    </>
  )
}

