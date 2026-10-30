import type { Metadata } from 'next'
import PlainLanguageBrief from '@/components/tools/PlainLanguageBrief'
import { buildPageMetadata } from '@/lib/page-metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    path: '/tools/email-reach-brief',
    title:
      locale === 'fr'
        ? 'Vos courriels atteignent-ils vos clients? | ROALLA'
        : 'Are your emails reaching customers? | ROALLA',
    description:
      locale === 'fr'
        ? 'Répondez à quelques questions simples et obtenez un aperçu privé pour améliorer la portée de vos courriels—sans jargon technique.'
        : 'Answer a few plain questions and get a private brief to improve email reach—without technical jargon.',
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
              ? 'Vos courriels atteignent-ils vos clients—ou la boîte indésirable?'
              : 'Are your emails reaching customers—or the junk folder?'}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {fr
              ? 'Quatre questions en langage simple. Vous obtiendrez un aperçu privé avec priorités et prochaines étapes—sans pitch.'
              : 'Four plain-language questions. You get a private brief with priorities and next steps—no sales pitch.'}
          </p>
        </header>
        <main className="mx-auto mt-10 max-w-3xl">
          <PlainLanguageBrief briefId="email-reach" locale={locale} />
        </main>
      </div>
    </div>
  )
}
