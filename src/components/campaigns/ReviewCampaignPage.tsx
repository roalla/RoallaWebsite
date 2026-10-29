import { ArrowRight, CheckCircle2, ClipboardCheck, Gauge, ShieldCheck } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import CampaignReviewCtas from '@/components/campaigns/CampaignReviewCtas'
import { breadcrumbJsonLd, servicePageJsonLd, webPageJsonLd } from '@/lib/structured-data'
import type { CampaignReviewId } from '@/lib/campaign-review-content'
import { getCampaignReview } from '@/lib/campaign-review-content'

export default function ReviewCampaignPage({ campaign, locale }: { campaign: CampaignReviewId; locale: string }) {
  const page = getCampaignReview(campaign, locale)
  if (!page) return null
  const language = locale === 'fr' ? 'fr' : 'en'
  const offer = page.offer ?? page.eyebrow
  const audience = page.audience ?? page.fitTitle
  const inquiryParams = new URLSearchParams({
    intent: page.intent,
    from_page: page.path,
    goal: page.title,
    campaign,
    offer,
    icp: audience,
    conversion_source: 'campaign_page',
  })
  if (page.focus) inquiryParams.set('focus', page.focus)
  if (page.need) inquiryParams.set('need', page.need)
  const inquiry = `/${language}/contact?${inquiryParams.toString()}`
  const primaryParams = new URLSearchParams({
    campaign,
    offer,
    icp: audience,
    conversion_source: 'campaign_page',
  })
  const primary = `/${language}${page.toolPath}?${primaryParams.toString()}`
  const steps = language === 'fr'
    ? [['1', 'Cadrez le besoin', 'Décrivez le résultat, la contrainte ou la décision qui motive la revue.'], ['2', 'Examinez les preuves', 'Passez en revue le travail, les systèmes, les risques et les signaux disponibles.'], ['3', 'Choisissez la suite', 'Utilisez le résultat à l’interne ou demandez un soutien ciblé à ROALLA.']]
    : [['1', 'Frame the need', 'Describe the outcome, constraint, or decision driving the review.'], ['2', 'Review the evidence', 'Examine the work, systems, risks, and available signals.'], ['3', 'Choose the next step', 'Use the result internally or request focused support from ROALLA.']]
  const communicationsCampaign = campaign === 'communications-modernization-review'

  return (
    <div className="page-shell bg-white">
      <JsonLd data={[
        breadcrumbJsonLd(language, [{ name: language === 'fr' ? 'Accueil' : 'Home', path: '' }, { name: page.eyebrow }]),
        webPageJsonLd(language, page.path, page.metadataTitle, page.metadataDescription),
        ...servicePageJsonLd({ locale: language, path: page.path, name: page.eyebrow, description: page.metadataDescription, serviceType: page.eyebrow, offers: page.outcomes.map(([name, description]) => ({ name, description })), faqs: page.faqs.map(([question, answer]) => ({ question, answer })) }),
      ]} />
      <main>
        <section data-header-tone="dark" className="relative overflow-hidden bg-slate-950 pb-20 pt-28 text-white lg:pb-28 lg:pt-36">
          <div className="absolute inset-0 opacity-60" aria-hidden><div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/30 blur-3xl" /><div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-gold/15 blur-3xl" /></div>
          <div className="container relative mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">{page.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{page.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{page.subtitle}</p>
              <div className="mt-8"><CampaignReviewCtas campaign={campaign} offer={offer} audience={audience} locale={language} primaryHref={primary} primaryLabel={page.primaryCta} inquiryHref={inquiry} inquiryLabel={page.inquiryCta} /></div>
            </div>
            <aside className="rounded-3xl border border-white/15 bg-white/[0.07] p-7 backdrop-blur sm:p-8">
              <Gauge className="h-8 w-8 text-brand-gold" aria-hidden />
              <h2 className="mt-4 font-serif text-2xl font-bold text-white">{page.signalsTitle}</h2>
              <ul className="mt-6 space-y-4">{page.signals.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-200"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary-light" aria-hidden />{item}</li>)}</ul>
            </aside>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center"><ClipboardCheck className="mx-auto h-9 w-9 text-primary-dark" aria-hidden /><h2 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{page.reviewTitle}</h2></div>
          <ul className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">{page.reviewItems.map((item) => <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}</ul>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8"><h2 className="mx-auto max-w-3xl text-center font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{page.outcomeTitle}</h2><div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-3">{page.outcomes.map(([title, body]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7"><h3 className="font-serif text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></article>)}</div></div>
        </section>

        {communicationsCampaign ? (
          <section className="border-y border-slate-200 bg-white py-20">
            <div className="container mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
              <article className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{language === 'fr' ? 'Commencez sans appel de vente' : 'Start before a sales call'}</p>
                <h2 className="mt-4 font-serif text-3xl font-bold text-slate-950">{language === 'fr' ? 'La fiche de valeur communications prépare la revue' : 'The Communications Value Brief prepares the review'}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{language === 'fr' ? 'En environ cinq minutes, estimez les coûts actuels, choisissez les principales frictions et obtenez une fiche privée avec priorités et plan 30-60-90. Utilisez-la à l’interne ou joignez-la à votre demande afin que la première conversation commence avec du contexte.' : 'In about five minutes, estimate current cost, choose the most important friction, and create a private brief with priorities and a 30-60-90 plan. Use it internally or attach it to your request so the first conversation starts with context.'}</p>
                <div className="mt-6 [&_a:nth-child(2)]:border-slate-300 [&_a:nth-child(2)]:text-slate-800 [&_a:nth-child(2)]:hover:bg-white"><CampaignReviewCtas campaign={campaign} offer={offer} audience={audience} locale={language} primaryHref={primary} primaryLabel={page.primaryCta} inquiryHref={inquiry} inquiryLabel={page.inquiryCta} /></div>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">{language === 'fr' ? 'Preuve de soutien, pas l’offre' : 'Supporting proof—not the offer'}</p>
                <h2 className="mt-4 font-serif text-3xl font-bold text-slate-950">{language === 'fr' ? 'Un accès plus large après la définition des exigences' : 'Broader access after requirements are clear'}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{language === 'fr' ? 'La relation non exclusive de conseiller technologique Telarus de ROALLA peut élargir l’accès aux fournisseurs, spécialistes et ingénieurs commerciaux. Elle ne remplace pas l’analyse des exigences, ne garantit pas qu’un fournisseur convient et ne retire pas votre décision finale.' : 'ROALLA’s non-exclusive Telarus Technology Advisor relationship can broaden access to suppliers, specialists, and sales engineering. It does not replace requirements analysis, guarantee that a supplier fits, or take away your final decision.'}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold"><a href={`/${language}/partners/evaluation-standard`} className="text-primary-dark underline underline-offset-4">{language === 'fr' ? 'Norme d’évaluation' : 'Evaluation standard'}</a><a href={`/${language}/partners/compensation`} className="text-primary-dark underline underline-offset-4">{language === 'fr' ? 'Divulgation de rémunération' : 'Compensation disclosure'}</a></div>
              </article>
            </div>
          </section>
        ) : null}

        <section className="container mx-auto grid gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <article className="rounded-2xl border border-slate-200 p-7 sm:p-9"><h2 className="font-serif text-3xl font-bold text-slate-950">{page.fitTitle}</h2><ul className="mt-6 grid gap-4 sm:grid-cols-2">{page.fit.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}</ul></article>
          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9"><ShieldCheck className="h-8 w-8 text-primary-light" aria-hidden /><h2 className="mt-4 font-serif text-2xl font-bold text-white">{page.caveatTitle}</h2><p className="mt-4 text-sm leading-6 text-slate-300">{page.caveat}</p><a href={`/${language}${page.servicePath}`} className="mt-6 inline-flex items-center font-semibold text-brand-gold underline underline-offset-4">{page.serviceCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></a></aside>
        </section>

        <section className="bg-slate-50 py-20"><div className="container mx-auto px-4 sm:px-6 lg:px-8"><h2 className="mx-auto max-w-3xl text-center font-serif text-3xl font-bold text-slate-950">{language === 'fr' ? 'De la question à une prochaine étape claire' : 'From the question to a clear next step'}</h2><ol className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-3">{steps.map(([number, title, body]) => <li key={number} className="rounded-2xl border border-slate-200 bg-white p-7"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-white">{number}</span><h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></li>)}</ol></div></section>

        <section className="container mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8"><h2 className="text-center font-serif text-3xl font-bold text-slate-950">{language === 'fr' ? 'Questions avant de commencer' : 'Questions before you begin'}</h2><div className="mt-10 space-y-3">{page.faqs.map(([question, answer]) => <details key={question} className="rounded-xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-semibold text-slate-950">{question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></section>

        <section className="bg-primary py-16 text-white"><div className="container mx-auto flex max-w-6xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><h2 className="font-serif text-3xl font-bold text-white">{language === 'fr' ? 'Commencez par une revue ciblée.' : 'Start with a focused review.'}</h2><p className="mt-3 max-w-3xl text-primary-lighter">{language === 'fr' ? 'Utilisez l’outil libre-service ou ajoutez votre contexte pour une réponse personnelle de ROALLA.' : 'Use the self-guided tool or add your context for a personal response from ROALLA.'}</p></div><CampaignReviewCtas campaign={campaign} offer={offer} audience={audience} locale={language} primaryHref={primary} primaryLabel={page.primaryCta} inquiryHref={inquiry} inquiryLabel={page.inquiryCta} /></div></section>
      </main>
    </div>
  )
}
