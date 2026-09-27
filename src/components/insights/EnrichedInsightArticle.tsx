import Image from 'next/image'
import { ArrowRight, Check, Lightbulb, SearchCheck } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getEnrichedInsight, type EnrichedInsightSlug } from '@/lib/enriched-insights'

type Props = {
  slug: EnrichedInsightSlug
  locale: string
  title: string
  summary: string
  readTime: string
}

export default function EnrichedInsightArticle({ slug, locale, title, summary, readTime }: Props) {
  const french = locale === 'fr'
  const { image, copy } = getEnrichedInsight(slug, locale)
  const advisory = ['fractional-coo', 'strategic-planning', 'process-optimization'].includes(slug)
  const technology = slug === 'professional-email-avoid-spam-phishing'
  const serviceHref = copy.serviceHref ?? (technology ? '/programs/technology-advisory' : advisory ? '/programs/business-enablement' : '/services/digital')
  const serviceLabel = copy.serviceLabel ?? (technology
    ? (french ? 'Explorer le conseil technologique' : 'Explore Technology Advisory')
    : advisory
    ? (french ? 'Explorer l’accompagnement d’affaires' : 'Explore Business Enablement')
    : (french ? 'Explorer l’accompagnement numérique' : 'Explore Digital Enablement'))

  return (
    <article className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-12 pt-4">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-primary-dark">
              <span className="rounded-full bg-primary/[0.08] px-3 py-1">{copy.category}</span>
              <span aria-hidden>·</span>
              <span>{readTime}</span>
            </div>
            <h1 className="mt-6 text-4xl font-serif font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-[3.35rem]">
              {title}
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-600">{summary}</p>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10">
            <Image
              src={image}
              alt={copy.imageAlt}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </figure>
        </div>
      </header>

      <section className="mx-auto mt-10 max-w-4xl rounded-2xl border border-primary/20 bg-primary/[0.06] px-6 py-7 sm:px-8" aria-labelledby="plain-answer-title">
        <div className="flex items-start gap-4">
          <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Lightbulb className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 id="plain-answer-title" className="text-sm font-bold uppercase tracking-[0.16em] text-primary-dark">
              {french ? 'La réponse simple' : 'The simple answer'}
            </h2>
            <p className="mt-2 text-xl font-serif font-bold leading-8 text-slate-950">{copy.plainAnswer}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-3xl space-y-5">
        {copy.intro.map((paragraph) => (
          <p key={paragraph} className="text-[1.0625rem] leading-8 text-slate-700">{paragraph}</p>
        ))}
      </div>

      <section className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl bg-slate-950 px-6 py-8 text-white sm:px-9" aria-labelledby="example-title">
        <div className="flex items-center gap-3 text-white">
          <SearchCheck className="h-5 w-5 text-primary-light" aria-hidden />
          <span className="text-sm font-bold uppercase tracking-[0.16em]">{french ? 'Exemple réel' : 'Real-world example'}</span>
        </div>
        <h2 id="example-title" className="mt-4 text-3xl font-serif font-bold text-white">{copy.exampleTitle}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{copy.example}</p>
      </section>

      <section className="mx-auto mt-14 max-w-4xl" aria-labelledby="signs-title">
        <h2 id="signs-title" className="text-3xl font-serif font-bold text-slate-950">{copy.signsTitle}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {copy.signs.map((sign) => (
            <li key={sign} className="flex gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 leading-7 text-slate-700 shadow-sm">
              <Check className="mt-1 h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
              <span>{sign}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-14 max-w-5xl border-t border-slate-200 pt-12" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-center text-3xl font-serif font-bold text-slate-950">{copy.stepsTitle}</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {copy.steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</span>
              <h3 className="mt-5 text-xl font-serif font-bold text-slate-950">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <blockquote className="mx-auto my-14 max-w-4xl border-l-4 border-primary bg-primary/[0.05] px-6 py-6 text-xl font-serif font-semibold leading-8 text-slate-900">
        {copy.takeaway}
      </blockquote>

      <section className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.09] via-white to-slate-50 px-6 py-10 text-center sm:px-10 sm:py-12" aria-labelledby="insight-cta-title">
        <h2 id="insight-cta-title" className="text-3xl font-serif font-bold text-slate-950">{copy.ctaTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">{copy.ctaText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={{ pathname: '/contact', query: { from_page: `insight-${slug}` } }} className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            {french ? 'Parler de votre situation' : 'Talk through your situation'}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
          <Link href={serviceHref} className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:text-primary-dark">
            {serviceLabel}
          </Link>
        </div>
      </section>
    </article>
  )
}
