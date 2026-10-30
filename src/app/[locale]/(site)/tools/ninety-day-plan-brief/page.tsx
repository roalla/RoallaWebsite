import type { Metadata } from 'next'
import PlainLanguageBrief from '@/components/tools/PlainLanguageBrief'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    path: '/tools/ninety-day-plan-brief',
    title:
      locale === 'fr'
        ? 'Plan sur 90 jours pour votre équipe | ROALLA'
        : '90-day plan for your team | ROALLA',
    description:
      locale === 'fr'
        ? 'Transformez trop de priorités en un plan que votre équipe peut suivre—questions simples, aperçu privé.'
        : 'Turn too many priorities into a plan your team can follow—plain questions, private brief.',
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'
  return (
    <div className="page-shell">
      <div className="container mx-auto px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-dark">
            {fr ? 'Outil gratuit' : 'Free planning tool'}
          </p>
          <h1 className="mt-4 text-4xl font-serif font-bold text-slate-950 md:text-5xl">
            {fr
              ? 'Transformez trop de priorités en un plan que votre équipe peut suivre.'
              : 'Turn too many priorities into a plan your team can follow.'}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {fr
              ? 'Quatre questions. Vous obtiendrez un aperçu privé avec un rythme de 90 jours—sans jargon de stratégie.'
              : 'Four questions. You get a private brief with a 90-day rhythm—without strategy jargon.'}
          </p>
        </header>
        <main className="mx-auto mt-10 max-w-3xl">
          <PlainLanguageBrief briefId="ninety-day-plan" locale={locale} />
        </main>
      </div>
    </div>
  )
}
