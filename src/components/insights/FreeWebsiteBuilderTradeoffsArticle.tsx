import React from 'react'
import Image from 'next/image'
import { ArrowRight, Check, Gauge, SearchCheck, Workflow } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import InsightShare from '@/components/insights/InsightShare'
import {
  getFreeWebsiteBuilderTradeoffsInsight,
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
    const match = block.text.match(/^(\d+)\.\s(.+)$/)
    return (
      <h3 className="mt-9 flex items-start gap-3 font-serif text-xl font-bold leading-7 text-slate-950">
        {match ? (
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 font-sans text-sm font-bold text-white">
            {match[1]}
          </span>
        ) : null}
        <span className="pt-0.5">{match ? match[2] : block.text}</span>
      </h3>
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

export default function FreeWebsiteBuilderTradeoffsArticle({ locale, title, summary, readTime, category }: Props) {
  const french = locale === 'fr'
  const { intro, sections } = splitSections(getFreeWebsiteBuilderTradeoffsInsight(locale))
  const finalSection = sections[sections.length - 1]
  const bodySections = sections.slice(0, -1)

  const decisionLenses = french
    ? [
        [SearchCheck, 'Visibilité', 'Les moteurs de recherche et les systèmes d’IA peuvent-ils comprendre clairement l’entreprise?'],
        [Workflow, 'Adéquation opérationnelle', 'Le site se connecte-t-il aux outils et aux flux de travail qui font avancer les demandes?'],
        [Gauge, 'Capacité d’évoluer', 'La plateforme peut-elle soutenir la prochaine étape sans multiplier les contournements?'],
      ] as const
    : [
        [SearchCheck, 'Visibility', 'Can search engines and AI systems clearly understand the business?'],
        [Workflow, 'Operational fit', 'Does the site connect to the tools and workflows that move inquiries forward?'],
        [Gauge, 'Room to evolve', 'Can the platform support the next stage without multiplying workarounds?'],
      ] as const

  const related = french
    ? [
        ['is-your-website-builder-limiting-growth', 'Votre outil de création de sites vous coûte-t-il des clients?'],
        ['how-ai-systems-understand-websites', 'Comment les systèmes d’IA comprennent les sites Web d’entreprise'],
        ['structured-data-for-small-business', 'Les données structurées pour les petites entreprises'],
      ] as const
    : [
        ['is-your-website-builder-limiting-growth', 'Is your website builder costing you leads?'],
        ['how-ai-systems-understand-websites', 'How AI systems understand business websites'],
        ['structured-data-for-small-business', 'Structured data for small businesses'],
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
              src="/images/insights/website-builder-growth/website-builder-growth-hero.webp"
              alt={french
                ? 'Une propriétaire d’entreprise évalue les limites de visibilité et d’intégration de son site Web.'
                : 'A business owner evaluates the visibility and integration limits of a website builder.'}
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

      <aside className="mx-auto mt-12 max-w-5xl rounded-2xl bg-slate-950 px-6 py-8 text-white sm:px-8" aria-labelledby="decision-lens-title">
        <h2 id="decision-lens-title" className="font-serif text-2xl font-bold">
          {french ? 'Évaluez plus que le prix de lancement' : 'Evaluate more than the launch price'}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {decisionLenses.map(([Icon, label, text]) => (
            <div key={label} className="rounded-xl border border-white/15 bg-white/[0.06] p-5">
              <Icon className="h-6 w-6 text-primary-light" aria-hidden />
              <h3 className="mt-4 font-semibold text-white">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="mx-auto mt-12 max-w-3xl">
        {bodySections.map((section, sectionIndex) => {
          const highlighted = section.title.includes('seven trade-offs') || section.title.includes('sept compromis')
          return (
            <section
              key={section.title}
              aria-labelledby={`tradeoffs-section-${sectionIndex}`}
              className={`scroll-mt-28 border-t border-slate-200 py-11 ${highlighted ? 'my-8 rounded-2xl border border-primary/20 bg-primary/[0.035] px-6 sm:px-8' : ''}`}
            >
              <h2 id={`tradeoffs-section-${sectionIndex}`} className="font-serif text-3xl font-bold leading-tight text-slate-950">
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
        <section className="mx-auto mt-12 max-w-5xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-white to-slate-50 px-6 py-10 text-center sm:px-10 sm:py-12" aria-labelledby="tradeoffs-cta-title">
          <h2 id="tradeoffs-cta-title" className="font-serif text-3xl font-bold text-slate-950">{finalSection.title}</h2>
          <div className="mx-auto mt-5 max-w-2xl space-y-4">
            {finalSection.blocks.map((block, index) => <ArticleBlock key={index} block={block} />)}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={{ pathname: '/contact', query: { service: 'visibility', need: 'visibility-assessment', from_page: 'free-website-builder-tradeoffs' } }}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {french ? 'Demander une évaluation de visibilité' : 'Request a Visibility Assessment'}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <Link href="/services/digital" className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:text-primary-dark">
              {french ? 'Explorer l’activation numérique' : 'Explore Digital Enablement'}
            </Link>
            <Link href="/programs/technology-advisory" className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:text-primary-dark">
              {french ? 'Discuter de vos besoins technologiques' : 'Discuss Your Technology Requirements'}
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-16 max-w-5xl border-t border-slate-200 pt-10" aria-labelledby="tradeoffs-related-title">
        <h2 id="tradeoffs-related-title" className="font-serif text-2xl font-bold text-slate-950">
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

