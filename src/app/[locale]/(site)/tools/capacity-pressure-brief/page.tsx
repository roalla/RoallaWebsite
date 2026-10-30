import type { Metadata } from 'next'
import PlainLanguageBrief from '@/components/tools/PlainLanguageBrief'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    path: '/tools/capacity-pressure-brief',
    title:
      locale === 'fr'
        ? 'Trop de travail pour trop peu de gens? | ROALLA'
        : 'Too much work for too few people? | ROALLA',
    description:
      locale === 'fr'
        ? 'Repérez où le travail s’accumule et ce qui peut être aidé sans perdre le contrôle humain—aperçu privé en langage simple.'
        : 'Find where work piles up and what can be helped without losing human control—private brief in plain language.',
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
            {fr ? 'Trop de travail pour trop peu de gens?' : 'Too much work for too few people?'}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {fr
              ? 'Quatre questions. Vous obtiendrez un aperçu privé sur où libérer de la capacité tout en gardant une personne sur les exceptions.'
              : 'Four questions. You get a private brief on where to free capacity while keeping a person on the exceptions.'}
          </p>
        </header>
        <main className="mx-auto mt-10 max-w-3xl">
          <PlainLanguageBrief briefId="capacity-pressure" locale={locale} />
        </main>
      </div>
    </div>
  )
}
