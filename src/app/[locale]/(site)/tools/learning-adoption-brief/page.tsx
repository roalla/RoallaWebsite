import type { Metadata } from 'next'
import LearningAdoptionBrief from '@/components/tools/LearningAdoptionBrief'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    path: '/tools/learning-adoption-brief',
    title:
      locale === 'fr'
        ? 'Aperçu adoption et formation | ROALLA'
        : 'Learning & Adoption Brief | ROALLA',
    description:
      locale === 'fr'
        ? 'Clarifiez public, format (docs, vidéo, SCORM) et responsabilités avant de produire plus de contenu.'
        : 'Clarify audience, format (docs, video, SCORM), and ownership before producing more content.',
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
              ? 'Adoption client ou formation interne—par où commencer?'
              : 'Customer adoption or internal training—where should you start?'}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {fr
              ? 'Cinq questions pour choisir docs, courte vidéo, YouTube simple ou SCORM—et qui tient le contenu à jour.'
              : 'Five questions to choose docs, short video, simple YouTube hosting, or SCORM—and who keeps content current.'}
          </p>
        </header>
        <div className="mx-auto mt-10 max-w-3xl">
          <LearningAdoptionBrief locale={locale} />
        </div>
      </div>
    </div>
  )
}
