import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata } from '@/lib/page-metadata'
import { Globe2, Inbox, SearchCheck } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

const content = {
  en: {
    title: 'Package estimators | ROALLA',
    description:
      'Choose the right preliminary estimate: new website launch (includes search & AI baseline), visibility improvement for an existing site, or email reach and setup.',
    eyebrow: 'Package estimators',
    heading: 'What do you need to estimate?',
    lead: 'Each tool prices a different job. A new-site launch includes a search & AI baseline—like platform builders do. Improving an existing footprint is a separate retrofit program.',
    cards: [
      {
        href: '/website-estimate' as const,
        icon: Globe2,
        title: 'Website launch',
        body: 'New site, copy/booking, and included launch search & AI baseline—plus optional email, voice, social, and hosting.',
      },
      {
        href: '/visibility-improvement-estimate' as const,
        icon: SearchCheck,
        title: 'Visibility improvement',
        body: 'Retrofit work for an existing site or listings: foundation, optional Maps help, offer rewrite, and first-year check-ins.',
      },
      {
        href: '/email-reach-estimate' as const,
        icon: Inbox,
        title: 'Email reach',
        body: 'Professional mailbox setup and inbox-reach work so client email is more likely to arrive and stay trusted.',
      },
    ],
    cta: 'Open estimator',
  },
  fr: {
    title: 'Estimateurs de forfaits | ROALLA',
    description:
      'Choisissez la bonne estimation préliminaire: lancement de site (inclut la base recherche et IA), amélioration de visibilité pour un site existant, ou portée courriel.',
    eyebrow: 'Estimateurs de forfaits',
    heading: 'Que souhaitez-vous estimer?',
    lead: 'Chaque outil tarifie un travail différent. Un lancement de site inclut une base recherche et IA—comme les constructeurs de plateformes. Améliorer une présence existante est un programme de remise à niveau distinct.',
    cards: [
      {
        href: '/website-estimate' as const,
        icon: Globe2,
        title: 'Lancement Web',
        body: 'Nouveau site, rédaction/réservation et base de lancement recherche et IA incluse—plus courriel, voix, réseaux et hébergement en option.',
      },
      {
        href: '/visibility-improvement-estimate' as const,
        icon: SearchCheck,
        title: 'Amélioration de visibilité',
        body: 'Remise à niveau pour un site ou des fiches existants: fondation, aide Maps optionnelle, réécriture d’offre et suivis de première année.',
      },
      {
        href: '/email-reach-estimate' as const,
        icon: Inbox,
        title: 'Portée courriel',
        body: 'Configuration de boîte professionnelle et travail de portée pour que les courriels clients arrivent mieux et restent crédibles.',
      },
    ],
    cta: 'Ouvrir l’estimateur',
  },
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = content[locale === 'fr' ? 'fr' : 'en']
  return buildPageMetadata({
    locale,
    path: '/tools/estimates',
    title: page.title,
    description: page.description,
  })
}

export default async function EstimatesChooserPage({ params }: Props) {
  const { locale } = await params
  const page = content[locale === 'fr' ? 'fr' : 'en']

  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-dark">{page.eyebrow}</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{page.heading}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{page.lead}</p>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {page.cards.map(({ href, icon: Icon, title, body }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2 className="mt-4 font-serif text-xl font-bold text-slate-950">{title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-700">{body}</p>
                  <span className="mt-5 text-sm font-bold text-primary-dark">{page.cta} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
