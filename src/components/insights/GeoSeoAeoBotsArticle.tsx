import React from 'react'
import Image from 'next/image'
import { ArrowRight, Bot, Check, MessageSquareText, Search, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import InsightShare from '@/components/insights/InsightShare'
import {
  getGeoSeoAeoBotsInsight,
  type LongFormBlock,
} from '@/lib/website-builder-insight'

type Props = {
  locale: string
  title: string
  summary: string
  readTime: string
  category: string
}

function InlineEmphasis({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={index} className="font-semibold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

function ArticleBlock({ block }: { block: LongFormBlock }) {
  if (block.type === 'paragraph') {
    return (
      <p className="text-[1.0625rem] leading-8 text-slate-700">
        <InlineEmphasis text={block.text} />
      </p>
    )
  }

  if (block.type === 'blockquote') {
    return (
      <blockquote className="my-8 rounded-r-xl border-l-4 border-primary bg-primary/[0.06] px-6 py-5 font-serif text-xl font-semibold leading-8 text-slate-950">
        {block.text}
      </blockquote>
    )
  }

  if (block.type === 'heading' && block.level === 3) {
    return (
      <h3 className="mt-9 font-serif text-xl font-bold leading-7 text-slate-950">{block.text}</h3>
    )
  }

  if (block.type === 'unordered-list') {
    return (
      <ul className="my-6 grid gap-3 sm:grid-cols-2">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[0.98rem] leading-6 text-slate-700">
            <Check className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
            <span><InlineEmphasis text={item} /></span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === 'ordered-list') {
    return (
      <ol className="my-7 grid gap-3">
        {block.items.map((item, index) => (
          <li key={item} className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-[1rem] leading-7 text-slate-700">
            <span className="font-serif text-xl font-bold text-primary-dark">{index + 1}</span>
            <span><InlineEmphasis text={item} /></span>
          </li>
        ))}
      </ol>
    )
  }

  return null
}

function splitSections(blocks: LongFormBlock[]) {
  const intro: LongFormBlock[] = []
  const sections: { title: string; blocks: LongFormBlock[] }[] = []
  let current: { title: string; blocks: LongFormBlock[] } | null = null

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      current = { title: block.text, blocks: [] }
      sections.push(current)
    } else if (current) {
      current.blocks.push(block)
    } else {
      intro.push(block)
    }
  }

  return { intro, sections }
}

export default function GeoSeoAeoBotsArticle({ locale, title, summary, readTime, category }: Props) {
  const french = locale === 'fr'
  const { intro, sections } = splitSections(getGeoSeoAeoBotsInsight(locale))
  const finalSection = sections[sections.length - 1]
  const bodySections = sections.slice(0, -1)

  const jobs = french
    ? [
        [Search, 'SEO', 'Résultats de recherche', 'Aider la bonne page à obtenir une place lorsqu’une personne cherche.'],
        [MessageSquareText, 'AEO', 'Réponses directes', 'Rendre une réponse précise facile à extraire et à lire à voix haute.'],
        [Sparkles, 'GEO', 'Réponses rédigées', 'Rendre l’entreprise facile à décrire lorsqu’une IA compose une réponse.'],
        [Bot, 'Robots', 'Récupération des pages', 'Savoir quels visiteurs automatisés sont les bienvenus, et lesquels ne sont pas des clients.'],
      ] as const
    : [
        [Search, 'SEO', 'Search results', 'Help the right page earn a place when someone searches.'],
        [MessageSquareText, 'AEO', 'Direct answers', 'Make one specific reply easy to extract and read aloud.'],
        [Sparkles, 'GEO', 'Written answers', 'Make the business easy to describe when an AI composes a response.'],
        [Bot, 'Bots', 'Page fetches', 'Know which automated visitors you welcome, and which hits are not customers.'],
      ] as const

  const related = french
    ? [
        ['search-and-ai-visibility', 'Vos clients et l’IA peuvent-ils vraiment trouver votre entreprise?'],
        ['how-ai-systems-understand-websites', 'Ce que l’IA voit vraiment lorsqu’elle lit votre site Web'],
        ['structured-data-for-small-business', 'Les données structurées expliquées sans brouillard technique'],
      ] as const
    : [
        ['search-and-ai-visibility', 'Can Customers and AI Actually Find Your Business?'],
        ['how-ai-systems-understand-websites', 'What AI Really Sees When It Reads Your Website'],
        ['structured-data-for-small-business', 'Structured Data Explained Without the Technical Fog'],
      ] as const

  return (
    <article className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-12 pt-4">
        <div className="grid items-center gap-10 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-primary-dark">
              <span className="rounded-full bg-primary/[0.08] px-3 py-1">{category}</span>
              <span aria-hidden>·</span>
              <span>{readTime}</span>
            </div>
            <h1 className="mt-6 font-serif text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-600">{summary}</p>
            <InsightShare title={title} />
          </div>
          <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10">
            <Image
              src="/images/insights/library/search-and-ai-visibility.webp"
              alt={french
                ? 'Une cliente compare des résultats de recherche, une carte, un assistant et la fiche d’une entreprise locale.'
                : 'A customer compares search results, a map, an assistant and a local business listing.'}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </figure>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-3xl space-y-5">
        {intro.map((block, index) => <ArticleBlock key={index} block={block} />)}
      </div>

      <aside className="mx-auto mt-12 max-w-5xl" aria-labelledby="visibility-jobs-title">
        <h2 id="visibility-jobs-title" className="font-serif text-2xl font-bold text-slate-950">
          {french ? 'Quatre tâches, pas quatre campagnes' : 'Four jobs, not four campaigns'}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map(([Icon, label, role, text]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-primary-dark" aria-hidden />
              <p className="mt-4 font-serif text-2xl font-bold text-slate-950">{label}</p>
              <p className="mt-1 text-sm font-semibold text-primary-dark">{role}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="mx-auto mt-12 max-w-3xl">
        {bodySections.map((section, sectionIndex) => {
          const highlighted = section.title.includes('What to do first') || section.title.includes('Par où commencer')
          return (
            <section
              key={section.title}
              aria-labelledby={`visibility-jobs-section-${sectionIndex}`}
              className={`scroll-mt-28 border-t border-slate-200 py-11 ${highlighted ? 'my-8 rounded-2xl border border-primary/20 bg-primary/[0.035] px-6 sm:px-8' : ''}`}
            >
              <h2 id={`visibility-jobs-section-${sectionIndex}`} className="font-serif text-3xl font-bold leading-tight text-slate-950">
                {section.title}
              </h2>
              <div className="mt-5 space-y-5">
                {section.blocks.map((block, blockIndex) => <ArticleBlock key={blockIndex} block={block} />)}
              </div>
            </section>
          )
        })}
      </div>

      {finalSection ? (
        <section className="mx-auto mt-12 max-w-5xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-white to-slate-50 px-6 py-10 text-center sm:px-10 sm:py-12" aria-labelledby="visibility-jobs-cta-title">
          <h2 id="visibility-jobs-cta-title" className="font-serif text-3xl font-bold text-slate-950">{finalSection.title}</h2>
          <div className="mx-auto mt-5 max-w-2xl space-y-4 text-left sm:text-center">
            {finalSection.blocks.map((block, index) => <ArticleBlock key={index} block={block} />)}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={{ pathname: '/contact', query: { service: 'visibility', need: 'visibility-assessment', from_page: 'geo-seo-aeo-bots' } }}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {french ? 'Demander une évaluation de visibilité' : 'Request a Visibility Assessment'}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <Link href="/services/digital-visibility-optimization" className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:text-primary-dark">
              {french ? 'Voir l’optimisation de la visibilité' : 'See visibility optimization'}
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-16 max-w-5xl border-t border-slate-200 pt-10" aria-labelledby="visibility-jobs-related-title">
        <h2 id="visibility-jobs-related-title" className="font-serif text-2xl font-bold text-slate-950">
          {french ? 'Perspectives connexes' : 'Related insights'}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {related.map(([slug, label]) => (
            <Link key={slug} href={{ pathname: '/insights/[slug]', params: { slug } }} className="group rounded-xl border border-slate-200 bg-white p-5 font-semibold leading-6 text-slate-900 shadow-sm transition-all hover:border-primary/40 hover:shadow-card">
              {label}
              <ArrowRight className="mt-4 h-4 w-4 text-primary-dark transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
