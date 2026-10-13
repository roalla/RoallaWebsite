import Image from "next/image";
import {
  ArrowRight,
  ArrowDown,
  Check,
  ChevronDown,
  ExternalLink,
  FileCheck2,
  SearchCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import DeferredOutcomeContactForm from "@/components/solutions/DeferredOutcomeContactForm";
import OutcomePageAnalytics from "@/components/solutions/OutcomePageAnalytics";
import type { ConsultationIntent, ConsultingFocus } from "@/lib/consultation-request";
import type { SolutionPathId, SolutionPathway } from "@/lib/solutions-by-need";
import {
  outcomeDeliveryModels,
  outcomeVisuals,
  type OutcomeEvidence,
  type OutcomePageCopy,
  type OutcomeVisual,
} from "@/lib/solution-outcome-pages";

type Props = {
  locale: "en" | "fr";
  pathway: SolutionPathway;
  related: readonly SolutionPathway[];
  evidence: readonly OutcomeEvidence[];
  visual: OutcomeVisual;
  showSupplierContext: boolean;
  copy: OutcomePageCopy;
};

type ContactContext = { intent: ConsultationIntent; focus?: ConsultingFocus };

function contactQuery(pathwayId: SolutionPathId): ContactContext {
  if (pathwayId === "strategy") return { intent: "consulting" };
  if (pathwayId === "visibility") return { intent: "visibility" };
  if (pathwayId === "automation-ai") return { intent: "ai-support" };
  if (pathwayId === "digital-experience") return { intent: "platform" };
  return { intent: "consulting", focus: "technology" };
}

export default function OutcomeLandingPage({
  locale,
  pathway,
  related,
  evidence,
  visual,
  showSupplierContext,
  copy,
}: Props) {
  const contact = contactQuery(pathway.id);
  const deliveryModel = outcomeDeliveryModels[pathway.id][locale];
  const sourcePage = `/solutions/${pathway.id}`;
  const fullFormQuery = {
    intent: contact.intent,
    ...(contact.focus ? { focus: contact.focus } : {}),
    outcome: pathway.id,
    from_page: sourcePage,
  };

  return (
    <div className="page-shell bg-white">
      <OutcomePageAnalytics outcome={pathway.id} />
      <section
        data-header-tone="dark"
        className="relative overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-32"
      >
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -right-20 top-12 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <Link href="/solutions" data-outcome-track="hero_breadcrumb|solutions" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline">
              {copy.breadcrumb}
            </Link>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {copy.eyebrow} · {visual.focus[locale]}
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">{pathway.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">{pathway.description}</p>
            <div className="mt-6 max-w-3xl border-l-2 border-primary bg-white/[0.06] px-4 py-3 sm:px-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{copy.plainAnswer}</p>
              <p className="mt-2 leading-7 text-slate-100">{pathway.result}</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#outcome-contact" data-outcome-track="hero|embedded-contact" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {copy.ctaPrimary}<ArrowDown className="ml-2 h-4 w-4" aria-hidden />
              </a>
              <Link href={pathway.href} data-outcome-track={`hero|${pathway.href}`} className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {copy.serviceCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <figure className="group relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl">
            <div className="relative aspect-[4/3]">
              <Image
                src={visual.src}
                alt={visual.alt[locale]}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(100vw - 3rem), 528px"
                className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" aria-hidden />
            </div>
            <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-sm font-semibold text-white sm:p-6">{visual.focus[locale]}</figcaption>
          </figure>
        </div>
      </section>

      <aside className="border-b border-slate-200 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" aria-label={copy.credibilityLabel}>
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-3">
          {copy.credibilityPoints.map((point) => (
            <div key={point} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <Check className="h-5 w-5 shrink-0 text-primary-dark" aria-hidden />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </aside>

      <main>
        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="outcome-journey-title">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.journeyEyebrow}</p>
            <h2 id="outcome-journey-title" className="mt-3 max-w-3xl font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{copy.journeyTitle}</h2>
            <div className="mt-9 grid gap-5 lg:grid-cols-3">
              <details open className="outcome-card group rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 marker:content-none">
                  <span><span className="text-sm font-bold text-primary-dark">01</span><span className="mt-3 block font-serif text-2xl font-bold text-slate-950">{copy.fitTitle}</span></span>
                  <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-primary-dark transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="mt-5 space-y-3">
                  {pathway.signals.map((signal) => (
                    <li key={signal} className="flex gap-3 leading-7 text-slate-700"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden /><span>{signal}</span></li>
                  ))}
                </ul>
              </details>
              <details open className="outcome-card group rounded-2xl border border-primary/25 bg-primary/[0.045] p-6 sm:p-7">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 marker:content-none">
                  <span><span className="text-sm font-bold text-primary-dark">02</span><span className="mt-3 block font-serif text-2xl font-bold text-slate-950">{copy.includesTitle}</span></span>
                  <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-primary-dark transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="mt-5 space-y-3">
                  {pathway.examples.map((example) => (
                    <li key={example} className="flex gap-3 leading-7 text-slate-700"><Check className="mt-1 h-5 w-5 shrink-0 text-primary-dark" aria-hidden /><span>{example}</span></li>
                  ))}
                </ul>
              </details>
              <article className="outcome-card rounded-2xl bg-slate-950 p-6 text-white sm:p-7">
                <span className="text-sm font-bold text-primary">03</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-white">{copy.resultTitle}</h3>
                <p className="mt-5 text-lg leading-8 text-slate-200">{pathway.result}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="outcome-defer bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.processEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{copy.processTitle}</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">{copy.processDescription}</p>
              <div className="mt-7 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.deliveryModelLabel}</p>
                <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">{deliveryModel.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{deliveryModel.description}</p>
              </div>
            </div>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="outcome-card rounded-2xl border border-slate-200 bg-white p-6">
                  <span className="text-sm font-bold text-primary-dark">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-serif text-2xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
                </li>
              ))}
            </ol>
            <div className="mt-9 flex flex-col items-start gap-3 rounded-2xl border border-primary/20 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-3xl font-medium leading-7 text-slate-800">{copy.ctaDescription}</p>
              <a href="#outcome-contact" data-outcome-track="guided_steps|embedded-contact" className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-lg bg-primary-dark px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-darker">{copy.ctaPrimary}<ArrowDown className="ml-2 h-4 w-4" aria-hidden /></a>
            </div>
          </div>
        </section>

        {evidence.length > 0 ? (
          <section className="outcome-defer px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-6xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.proofEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">{copy.proofTitle}</h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">{copy.proofDescription}</p>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {evidence.map((item) => (
                  <article key={item.slug} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <FileCheck2 className="h-6 w-6 text-primary-dark" aria-hidden />
                    <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">{item.title[locale]}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{item.description[locale]}</p>
                    <Link
                      href={{ pathname: "/services/portfolio/[slug]", params: { slug: item.slug } }}
                      data-outcome-track={`published_evidence|case-study:${item.slug}`}
                      className="mt-5 inline-flex min-h-[44px] items-center font-semibold text-primary-dark underline-offset-4 hover:underline"
                    >
                      {copy.proofCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {showSupplierContext ? (
          <section className="outcome-defer px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
            <div className="mx-auto max-w-6xl rounded-2xl border border-primary/25 bg-primary/[0.05] p-6 sm:p-8">
              <SearchCheck className="h-7 w-7 text-primary-dark" aria-hidden />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.supplierEyebrow}</p>
              <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold text-slate-950">{copy.supplierTitle}</h2>
              <p className="mt-4 max-w-4xl leading-7 text-slate-700">{copy.supplierDescription}</p>
              <Link
                href="/providers"
                data-outcome-track="supplier_context|providers"
                className="mt-5 inline-flex min-h-[44px] items-center font-semibold text-primary-dark underline-offset-4 hover:underline"
              >
                {copy.supplierCta}<ExternalLink className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </section>
        ) : null}

        <section className="outcome-defer bg-slate-50 px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="outcome-faq-title">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.faqEyebrow}</p>
            <h2 id="outcome-faq-title" className="mt-3 font-serif text-3xl font-bold text-slate-950">{copy.faqTitle}</h2>
            <div className="mt-7 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
              {[
                [copy.faqOutcomeQuestion, pathway.result],
                [copy.faqFitQuestion, pathway.signals.join("; ")],
                [copy.faqScopeQuestion, pathway.examples.join("; ")],
              ].map(([question, answer], index) => (
                <details key={question} open={index === 0} className="group py-5">
                  <summary className="cursor-pointer list-none pr-8 font-serif text-lg font-bold text-slate-950 marker:content-none">{question}</summary>
                  <p className="mt-3 leading-7 text-slate-600">{answer}.</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="outcome-defer px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.relatedEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">{copy.relatedTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {related.map((item) => {
                const relatedVisual = outcomeVisuals[item.id];
                return (
                  <Link
                    key={item.id}
                    href={{ pathname: "/solutions/[slug]", params: { slug: item.id } }}
                    data-outcome-selection={item.id}
                    className="group grid overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-primary/40 hover:shadow-md sm:grid-cols-[160px_1fr]"
                  >
                    <div className="relative min-h-40 overflow-hidden">
                      <Image
                        src={relatedVisual.src}
                        alt=""
                        fill
                        loading="lazy"
                        fetchPriority="low"
                        sizes="(max-width: 639px) calc(100vw - 2rem), 160px"
                        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-bold text-slate-950 group-hover:text-primary-dark">{item.shortTitle}</h3>
                      <p className="mt-2 leading-7 text-slate-600">{item.navDescription}</p>
                      <span className="mt-4 inline-flex items-center font-semibold text-primary-dark">{copy.relatedCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <section id="outcome-contact" className="scroll-mt-24 bg-slate-950 px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20" aria-labelledby="outcome-contact-title">
        <div className="mx-auto grid max-w-6xl items-start gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{copy.ctaEyebrow}</p>
            <h2 id="outcome-contact-title" className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">{copy.formTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">{copy.formDescription}</p>
            <p className="mt-6 text-sm text-slate-400">
              {copy.formAlternative}{" "}
              <Link href={{ pathname: "/contact", query: fullFormQuery }} data-outcome-track="embedded_form_alternative|contact" className="font-semibold text-white underline underline-offset-4 hover:text-primary">
                {copy.formAlternativeCta}
              </Link>
            </p>
          </div>
          <DeferredOutcomeContactForm
            initialIntent={contact.intent}
            initialFocus={contact.focus ?? null}
            initialGoal={`${copy.formPrefill} ${pathway.shortTitle}.`}
            initialSourcePage={sourcePage}
            initialOutcome={pathway.id}
            initialQuickMode
            loadLabel={copy.ctaPrimary}
          />
        </div>
      </section>
    </div>
  );
}
