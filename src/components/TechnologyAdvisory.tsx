"use client";

import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Compass, ExternalLink, Layers3, Network, Scale, ShieldCheck } from "lucide-react";
import Reveal from "./motion/Reveal";
import ServiceMiniFAQ from "./services/ServiceMiniFAQ";
import StickyMobileCTA from "./StickyMobileCTA";
import { TECHNOLOGY_PAGE_FAQ_KEYS } from "@/lib/service-faq-jsonld";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { getTechnologyAdvisoryCopy, type AdvisorNeedId, type AdvisorPriorityId } from "@/lib/technology-advisory-content";

const deliverableKeys = ["technologyDeliverable1", "technologyDeliverable2", "technologyDeliverable3", "technologyDeliverable4", "technologyDeliverable5"] as const;
const capabilityKeys = ["technologyF1", "technologyF2", "technologyF3", "technologyF4", "technologyF5", "technologyF6", "technologyF7", "technologyF8"] as const;
const evaluationKeys = ["technologyEvaluation1", "technologyEvaluation2", "technologyEvaluation3", "technologyEvaluation4", "technologyEvaluation5", "technologyEvaluation6", "technologyEvaluation7", "technologyEvaluation8"] as const;
const implementationKeys = ["technologyImplementation1", "technologyImplementation2", "technologyImplementation3", "technologyImplementation4", "technologyImplementation5", "technologyImplementation6"] as const;

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 pt-5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
          <Check className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const TechnologyAdvisory = () => {
  const locale = useLocale();
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const copy = getTechnologyAdvisoryCopy(locale);
  const [advisorNeed, setAdvisorNeed] = useState<AdvisorNeedId | null>(null);
  const [advisorPriority, setAdvisorPriority] = useState<AdvisorPriorityId | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const selectedNeed = useMemo(() => copy.journeys.advisorNeeds.find((item) => item.id === advisorNeed) ?? null, [advisorNeed, copy.journeys.advisorNeeds]);
  const selectedCategory = useMemo(() => copy.journeys.categories.find((item) => item.id === categoryId) ?? null, [categoryId, copy.journeys.categories]);
  const recommendation = selectedNeed && advisorPriority ? selectedNeed.recommendation[advisorPriority] : null;

  const chooseNeed = (id: AdvisorNeedId) => {
    setAdvisorNeed(id);
    setAdvisorPriority(null);
    trackAnalyticsEvent("technology_advisor_flow_step", { step: 1, need: id });
  };

  const choosePriority = (id: AdvisorPriorityId) => {
    setAdvisorPriority(id);
    trackAnalyticsEvent("technology_advisor_flow_completed", { need: advisorNeed ?? "unknown", priority: id });
  };

  const resetAdvisor = () => {
    setAdvisorNeed(null);
    setAdvisorPriority(null);
  };

  const chooseCategory = (id: string) => {
    setCategoryId(id);
    trackAnalyticsEvent("technology_category_selected", { category: id });
  };

  const trackJourneyCta = (journey: "advisor" | "category" | "brief", detail?: string) => {
    trackAnalyticsEvent("technology_journey_cta_click", { journey, detail });
  };

  const disclosureItems = [t("technologyPartnerProof1Body"), t("technologyPartnerProof2Body"), t("technologyPartnerProof3Body")];

  return (
    <section id="technology-advisory" className="relative bg-slate-50/60 pb-10">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-slate-950 px-6 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:px-8 lg:px-12 lg:py-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-cyan-300 to-brand-gold" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative max-w-4xl">
          <Reveal when="mount"><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300"><span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden />{copy.hero.eyebrow}</p></Reveal>
          <Reveal when="mount" delayMs={50}><h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4rem]">{copy.hero.title}</h1></Reveal>
          <Reveal when="mount" delayMs={100}><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">{copy.hero.body}</p></Reveal>
          <Reveal when="mount" delayMs={150}><p className="mt-7 inline-flex rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold tracking-wide text-slate-200">{copy.hero.proof}</p></Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-6xl">
        <Reveal id="choose-your-path" className="scroll-mt-28 py-14 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.journeys.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">{copy.journeys.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{copy.journeys.body}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
            <article className="overflow-hidden rounded-2xl border border-primary/25 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-primary/[0.06] p-6 sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-dark text-white"><Compass className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-5 font-serif text-2xl font-bold text-slate-950">{copy.journeys.advisorTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{copy.journeys.advisorBody}</p>
              </div>
              <div className="min-h-[27rem] p-6 sm:p-7" aria-live="polite">
                {!selectedNeed && (
                  <div>
                    <p className="text-sm font-bold text-slate-950">{copy.journeys.advisorPrompt}</p>
                    <div className="mt-4 grid gap-3">
                      {copy.journeys.advisorNeeds.map((need) => (
                        <button key={need.id} type="button" onClick={() => chooseNeed(need.id)} className="group flex min-h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-primary hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                          <span>{need.label}</span><ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary-dark" aria-hidden />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedNeed && !advisorPriority && (
                  <div>
                    <button type="button" onClick={resetAdvisor} className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"><ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />{copy.journeys.back}</button>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{selectedNeed.label}</p>
                    <p className="mt-2 text-sm font-bold text-slate-950">{copy.journeys.priorityPrompt}</p>
                    <div className="mt-4 grid gap-3">
                      {selectedNeed.priorities.map((priority) => (
                        <button key={priority.id} type="button" onClick={() => choosePriority(priority.id)} className="group flex min-h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-primary hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                          <span>{priority.label}</span><ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary-dark" aria-hidden />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedNeed && advisorPriority && recommendation && (
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"><Check className="h-5 w-5" aria-hidden /></div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{selectedNeed.label}</p>
                    <h4 className="mt-2 font-serif text-xl font-bold text-slate-950">{recommendation.title}</h4>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{recommendation.body}</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology", need: advisorNeed ?? undefined, reference: advisorPriority } }} onClick={() => trackJourneyCta("advisor", `${advisorNeed}:${advisorPriority}`)} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-darker">{copy.journeys.reviewCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
                      <Link href="/tools/technology-decision-brief" onClick={() => trackJourneyCta("brief", advisorNeed ?? undefined)} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-primary hover:text-primary-dark">{copy.journeys.briefCta}</Link>
                    </div>
                    <button type="button" onClick={resetAdvisor} className="mt-5 text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-950">{copy.journeys.restart}</button>
                  </div>
                )}
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-950 p-6 text-white sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-cyan-300"><Layers3 className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-5 font-serif text-2xl font-bold text-white">{copy.journeys.readyTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{copy.journeys.readyBody}</p>
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-sm font-bold text-slate-950">{copy.journeys.categoryPrompt}</p>
                <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label={copy.journeys.categoryPrompt}>
                  {copy.journeys.categories.map((category) => {
                    const selected = category.id === categoryId;
                    return <button key={category.id} type="button" onClick={() => chooseCategory(category.id)} aria-pressed={selected} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected ? "border-primary-dark bg-primary-dark text-white" : "border-slate-300 bg-white text-slate-800 hover:border-primary hover:text-primary-dark"}`}>{category.label}</button>;
                  })}
                </div>
                <div className="mt-6 min-h-[16rem] rounded-xl border border-slate-200 bg-slate-50 p-5" aria-live="polite">
                  {selectedCategory ? (
                    <>
                      <h4 className="font-serif text-xl font-bold text-slate-950">{selectedCategory.label}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{selectedCategory.description}</p>
                      <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{copy.journeys.compareLabel}</p>
                      <ul className="mt-3 flex flex-wrap gap-2">{selectedCategory.compare.map((criterion) => <li key={criterion} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">{criterion}</li>)}</ul>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Link href="/tools/technology-decision-brief" onClick={() => trackJourneyCta("brief", selectedCategory.id)} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-primary hover:text-primary-dark">{copy.journeys.compareCta}</Link>
                        <Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology", need: selectedCategory.id } }} onClick={() => trackJourneyCta("category", selectedCategory.id)} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-darker">{copy.journeys.inquiryCta} {selectedCategory.label}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
                      </div>
                    </>
                  ) : <div className="flex min-h-[13rem] items-center justify-center text-center"><p className="max-w-sm text-sm leading-6 text-slate-600">{copy.journeys.readyBody}</p></div>}
                </div>
              </div>
            </article>
          </div>
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 px-6 py-9 text-white shadow-xl sm:px-8 lg:px-10 lg:py-11">
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{copy.credibility.eyebrow}</p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">{copy.credibility.title}</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{copy.credibility.body}</p>
              <Link href="/partners" className="mt-5 inline-flex items-center text-sm font-bold text-cyan-300 hover:text-white hover:underline">{t("technologyPartnersLink")}<ExternalLink className="ml-2 h-4 w-4" aria-hidden /></Link>
            </div>
            <div className="grid gap-3">
              {copy.credibility.principles.map((principle, index) => (
                <div key={principle.title} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">0{index + 1}</span><div><h3 className="font-serif text-lg font-bold text-white">{principle.title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{principle.body}</p></div></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="py-14 lg:py-16">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.process.eyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">{copy.process.title}</h2><p className="mt-3 text-base leading-7 text-slate-700">{copy.process.body}</p></div>
          <ol className="mt-8 grid gap-4 lg:grid-cols-3">
            {copy.process.steps.map((step, index) => {
              const Icon = [Compass, Scale, Network][index];
              return <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-dark"><Icon className="h-5 w-5" aria-hidden /></span><span className="font-serif text-3xl font-bold text-slate-200">0{index + 1}</span></div><h3 className="mt-5 font-serif text-xl font-bold text-slate-950">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{step.body}</p></li>;
            })}
          </ol>
        </Reveal>

        <Reveal className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.details.eyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">{copy.details.title}</h2><p className="mt-3 text-base leading-7 text-slate-700">{copy.details.body}</p></div>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {[
              { title: copy.details.deliverables, icon: Check, content: <DetailList items={deliverableKeys.map((key) => t(key))} /> },
              { title: copy.details.capabilities, icon: Layers3, content: <DetailList items={capabilityKeys.map((key) => t(key))} /> },
              { title: copy.details.evaluation, icon: Scale, content: <DetailList items={evaluationKeys.map((key) => t(key))} /> },
              { title: copy.details.implementation, icon: Network, content: <DetailList items={implementationKeys.map((key) => t(key))} /> },
              { title: copy.details.disclosure, icon: ShieldCheck, content: <div className="pt-5"><DetailList items={disclosureItems} /><p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{t("technologyCompensation")}</p><p className="mt-3 text-sm leading-6 text-slate-600">{t("technologyPricingNote")}</p></div> },
            ].map(({ title, icon: Icon, content }) => (
              <details key={title} className="group py-1">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-3 font-serif text-lg font-bold text-slate-950"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-dark"><Icon className="h-4 w-4" aria-hidden /></span>{title}</span><ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" aria-hidden /></summary>
                <div className="pb-6 pl-0 sm:pl-12">{content}</div>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14 rounded-[1.75rem] bg-primary-dark px-6 py-10 text-white shadow-lg sm:px-8 lg:px-10 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{copy.finalCta.eyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">{copy.finalCta.title}</h2><p className="mt-3 text-base leading-7 text-cyan-50/90">{copy.finalCta.body}</p><p className="mt-4 text-sm font-medium text-cyan-100">{t("technologyCallNext")}</p></div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology" } }} onClick={() => trackJourneyCta("advisor", "final")} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100">{copy.finalCta.primary}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
              <Link href="/tools/technology-decision-brief" onClick={() => trackJourneyCta("brief", "final")} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">{copy.finalCta.secondary}</Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-14 border-t border-slate-200 pt-12"><h2 className="font-serif text-3xl font-bold text-slate-950">{t("faqTitle")}</h2><div className="mt-6"><ServiceMiniFAQ namespace="services" keys={TECHNOLOGY_PAGE_FAQ_KEYS} /></div></Reveal>
      </div>
      <StickyMobileCTA label={copy.finalCta.primary} sublabel={tCommon("ctaSubtext")} intent="consulting" focus="technology" />
    </section>
  );
};

export default TechnologyAdvisory;
