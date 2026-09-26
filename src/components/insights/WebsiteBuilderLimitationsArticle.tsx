import React from 'react'
import Image from 'next/image'
import { ArrowRight, Check, Network, SearchCheck, Workflow } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getWebsiteBuilderInsight, type LongFormBlock } from '@/lib/website-builder-insight'

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
          <strong key={index} className="font-semibold text-slate-900">
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
      <blockquote className="my-8 rounded-r-xl border-l-4 border-primary bg-primary/[0.06] px-6 py-5 text-xl font-serif font-semibold leading-8 text-slate-900">
        {block.text}
      </blockquote>
    )
  }
  if (block.type === 'heading' && block.level === 3) {
    const match = block.text.match(/^(\d+)\.\s(.+)$/)
    return (
      <h3 className="mt-9 flex items-start gap-3 text-xl font-serif font-bold leading-7 text-slate-900">
        {match ? (
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-sans font-bold text-white">
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

export default function WebsiteBuilderLimitationsArticle({ locale, title, summary, readTime, category }: Props) {
  const french = locale === 'fr'
  const { intro, sections } = splitSections(getWebsiteBuilderInsight(locale))
  const finalSection = sections[sections.length - 1]
  const bodySections = sections.slice(0, -1)

  const services = french
    ? [
        ['/services/digital-visibility-optimization', 'Optimisation de la visibilité numérique', SearchCheck],
        ['/website-design', 'Conception de sites Web et présence de marque', Network],
        ['/services/automation', 'Intégrations et automatisation des flux', Workflow],
        ['/programs/technology-advisory', 'Conseil en technologie et préparation numérique', Network],
      ] as const
    : [
        ['/services/digital-visibility-optimization', 'Digital Visibility Optimization', SearchCheck],
        ['/website-design', 'Website Design & Brand Presence', Network],
        ['/services/automation', 'Integrations & Workflow Automation', Workflow],
        ['/programs/technology-advisory', 'Technology Advisory & Digital Readiness', Network],
      ] as const

  const related = french
    ? [
        ['how-ai-systems-understand-websites', 'Comment les systèmes d’IA comprennent les sites Web d’entreprise'],
        ['structured-data-for-small-business', 'Les données structurées pour les petites entreprises'],
        ['search-and-ai-visibility', 'Être trouvé en ligne : recherche, IA et visibilité'],
      ] as const
    : [
        ['how-ai-systems-understand-websites', 'How AI systems understand business websites'],
        ['structured-data-for-small-business', 'Structured data for small businesses'],
        ['search-and-ai-visibility', 'Getting found online: search, AI and visibility'],
      ] as const

  const quickCheck = french
    ? {
        working: {
          title: 'Votre site vous aide si…',
          items: ['les bons clients vous trouvent', 'les demandes arrivent au bon endroit', 'vous savez ce qui produit des ventes'],
        },
        limiting: {
          title: 'Votre site vous freine si…',
          items: ['chaque changement exige un contournement', 'votre équipe recopie les mêmes données', 'vous comptez les visites, mais pas les résultats'],
        },
      }
    : {
        working: {
          title: 'Your site is helping when…',
          items: ['the right customers find you', 'inquiries reach the right place', 'you know what produces sales'],
        },
        limiting: {
          title: 'Your site is limiting you when…',
          items: ['every change needs a workaround', 'your team copies the same data by hand', 'you count visits, but not results'],
        },
      }

  return (
    <article className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-12 pt-4">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-primary-dark">
              <span className="rounded-full bg-primary/[0.08] px-3 py-1">{category}</span>
              <span aria-hidden>·</span>
              <span>{readTime}</span>
            </div>
            <h1 className="mt-6 text-4xl font-serif font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-[3.4rem]">
              {title}
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-600">{summary}</p>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10">
            <Image
              src="/images/insights/website-builder-growth/website-builder-growth-hero.webp"
              alt={french
                ? 'Une propriétaire d’entreprise examine un beau site qui ne se connecte pas à ses outils essentiels.'
                : 'A business owner reviews a polished website that is not connecting to essential business tools.'}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </figure>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-3xl space-y-5">
        {intro.map((block, index) => <ArticleBlock key={index} block={block} />)}
      </div>

      <aside className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2" aria-label={french ? 'Vérification rapide du site Web' : 'Quick website check'}>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
          <h2 className="text-xl font-serif font-bold text-emerald-950">{quickCheck.working.title}</h2>
          <ul className="mt-4 space-y-3">
            {quickCheck.working.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-emerald-950/80">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
          <h2 className="text-xl font-serif font-bold text-amber-950">{quickCheck.limiting.title}</h2>
          <ul className="mt-4 space-y-3">
            {quickCheck.limiting.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-amber-950/80">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="mx-auto mt-12 max-w-3xl">
        {bodySections.map((section, sectionIndex) => {
          const isDecision = section.title.includes('replace') || section.title.includes('remplacer')
          const isCeiling = section.title.includes('ceiling') || section.title.includes('limites de la plateforme')
          return (
            <section
              key={section.title}
              aria-labelledby={`article-section-${sectionIndex}`}
              className={`scroll-mt-28 border-t border-slate-200 py-11 ${isDecision ? 'my-8 rounded-2xl border border-primary/20 bg-primary/[0.04] px-6 sm:px-8' : ''}`}
            >
              <h2 id={`article-section-${sectionIndex}`} className="text-3xl font-serif font-bold leading-tight text-slate-950">
                {section.title}
              </h2>
              <div className={isCeiling ? 'mt-6 space-y-5' : 'mt-5 space-y-5'}>
                {section.blocks.map((block, blockIndex) => <ArticleBlock key={blockIndex} block={block} />)}
              </div>
              {sectionIndex === 1 ? (
                <figure className="mt-9 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg shadow-slate-900/10">
                  <Image
                    src="/images/insights/website-builder-growth/connected-growth.webp"
                    alt={french
                      ? 'Une petite équipe utilise un site connecté aux demandes de clients et aux réservations.'
                      : 'A small team uses a website connected to customer inquiries and bookings.'}
                    width={1600}
                    height={900}
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="h-auto w-full object-cover"
                  />
                  <figcaption className="bg-slate-950 px-5 py-3 text-sm leading-6 text-slate-200">
                    {french
                      ? 'Le bon site ne crée pas plus de travail : il relie les demandes, les réservations et le suivi.'
                      : 'The right website does not create more work—it connects inquiries, bookings and follow-up.'}
                  </figcaption>
                </figure>
              ) : null}
            </section>
          )
        })}
      </div>

      <aside className="mx-auto my-6 max-w-5xl rounded-2xl bg-slate-950 px-6 py-9 text-white sm:px-9" aria-labelledby="related-services-title">
        <h2 id="related-services-title" className="text-2xl font-serif font-bold text-white">
          {french ? 'Évaluer le site dans son contexte d’affaires' : 'Assess the website in its business context'}
        </h2>
        <p className="mt-3 max-w-3xl text-slate-300">
          {french
            ? 'Reliez la visibilité, la conception, les intégrations et la préparation numérique avant de choisir entre optimiser, étendre ou migrer.'
            : 'Connect visibility, design, integrations and digital readiness before deciding whether to optimize, extend or migrate.'}
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {services.map(([href, label, Icon]) => (
            <Link key={href} href={href} className="group flex min-h-[56px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 font-semibold text-white transition-colors hover:border-primary-light hover:bg-white/[0.1]">
              <Icon className="h-5 w-5 shrink-0 text-primary-light" aria-hidden />
              <span>{label}</span>
              <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          ))}
        </div>
      </aside>

      {finalSection ? (
        <section className="mx-auto mt-14 max-w-4xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-white to-slate-50 px-6 py-10 text-center sm:px-10 sm:py-12" aria-labelledby="article-cta-title">
          <h2 id="article-cta-title" className="text-3xl font-serif font-bold text-slate-950">{finalSection.title}</h2>
          <div className="mx-auto mt-5 max-w-2xl space-y-4">
            {finalSection.blocks.map((block, index) => <ArticleBlock key={index} block={block} />)}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={{ pathname: '/contact', query: { service: 'visibility', need: 'visibility-assessment', from_page: 'website-builder-insight' } }}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {french ? 'Demander une évaluation de l’intelligence du site Web' : 'Request a Website Intelligence Assessment'}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <Link href="/services/digital-visibility-optimization" className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:text-primary-dark">
              {french ? 'Explorer l’optimisation de la visibilité numérique' : 'Explore Digital Visibility Optimization'}
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-16 max-w-5xl border-t border-slate-200 pt-10" aria-labelledby="related-insights-title">
        <h2 id="related-insights-title" className="text-2xl font-serif font-bold text-slate-950">
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
