import type { Metadata } from 'next'
import AiEmployeeFitBrief from '@/components/tools/AiEmployeeFitBrief'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    path: '/tools/ai-employee-fit-brief',
    title:
      locale === 'fr'
        ? 'Aperçu d’adéquation d’un employé IA | ROALLA'
        : 'AI Employee Fit Brief | ROALLA',
    description:
      locale === 'fr'
        ? 'Cinq questions courtes. Un plan de départ privé pour votre première ligne—avant de choisir une plateforme.'
        : 'Five short questions. A private starting plan for your front line—before you choose a platform.',
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const fr = locale === 'fr'
  return (
    <div className="page-shell bg-gradient-to-b from-cyan-50/60 via-white to-white">
      <div className="container mx-auto px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-dark">
            {fr ? 'Outil gratuit' : 'Free planning tool'}
          </p>
          <h1 className="mt-4 text-4xl font-serif font-bold text-slate-950 md:text-5xl">
            {fr
              ? 'Un employé IA convient-il à votre première ligne?'
              : 'Is an AI Employee a fit for your front line?'}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {fr
              ? 'Restez dans le contexte de votre industrie. Cinq questions courtes. Un plan de départ privé pour votre première ligne.'
              : 'Stay in the context of your industry. Five short questions. A private starting plan for your front line.'}
          </p>
        </header>
        <div className="mx-auto mt-10 max-w-3xl">
          <AiEmployeeFitBrief locale={locale} />
        </div>
      </div>
    </div>
  )
}
