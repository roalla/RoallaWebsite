"use client";

import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check, ChevronDown, Compass, ExternalLink, Layers3, Scale, ShieldCheck } from "lucide-react";
import Reveal from "./motion/Reveal";
import ServiceMiniFAQ from "./services/ServiceMiniFAQ";
import StickyMobileCTA from "./StickyMobileCTA";
import { TECHNOLOGY_PAGE_FAQ_KEYS } from "@/lib/service-faq-jsonld";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { getTechnologyAdvisoryCopy, type AdvisorNeedId } from "@/lib/technology-advisory-content";

const deliverableKeys = ["technologyDeliverable1", "technologyDeliverable2", "technologyDeliverable3", "technologyDeliverable4", "technologyDeliverable5"] as const;
const capabilityKeys = ["technologyF1", "technologyF2", "technologyF3", "technologyF4", "technologyF5", "technologyF6", "technologyF7", "technologyF8"] as const;
const evaluationKeys = ["technologyEvaluation1", "technologyEvaluation2", "technologyEvaluation3", "technologyEvaluation4", "technologyEvaluation5", "technologyEvaluation6", "technologyEvaluation7", "technologyEvaluation8"] as const;
const implementationKeys = ["technologyImplementation1", "technologyImplementation2", "technologyImplementation3", "technologyImplementation4", "technologyImplementation5", "technologyImplementation6"] as const;

function DetailList({ items }: { items: string[] }) {
  return <ul className="grid gap-3 pt-5 sm:grid-cols-2">{items.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700"><Check className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden /><span>{item}</span></li>)}</ul>;
}

const TechnologyAdvisory = () => {
  const locale = useLocale();
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const copy = getTechnologyAdvisoryCopy(locale);
  const [journey, setJourney] = useState<"advisor" | "category">("advisor");
  const [advisorNeed, setAdvisorNeed] = useState<AdvisorNeedId | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const selectedNeed = useMemo(() => copy.journeys.advisorNeeds.find((item) => item.id === advisorNeed) ?? null, [advisorNeed, copy.journeys.advisorNeeds]);
  const selectedCategory = useMemo(() => copy.journeys.categories.find((item) => item.id === categoryId) ?? null, [categoryId, copy.journeys.categories]);

  const chooseJourney = (nextJourney: "advisor" | "category") => {
    setJourney(nextJourney);
    trackAnalyticsEvent("technology_advisor_flow_step", { step: 0, need: nextJourney });
  };

  const chooseNeed = (id: AdvisorNeedId) => {
    setAdvisorNeed(id);
    trackAnalyticsEvent("technology_advisor_flow_step", { step: 1, need: id });
    trackAnalyticsEvent("technology_advisor_flow_completed", { need: id, priority: "executive_concern" });
  };

  const chooseCategory = (id: string) => {
    setCategoryId(id);
    trackAnalyticsEvent("technology_category_selected", { category: id });
  };

  const trackJourneyCta = (journeyType: "advisor" | "category" | "brief", detail?: string) => {
    trackAnalyticsEvent("technology_journey_cta_click", { journey: journeyType, detail });
  };

  const disclosureItems = [t("technologyPartnerProof1Body"), t("technologyPartnerProof2Body"), t("technologyPartnerProof3Body")];

  return (
    <section id="technology-advisory" className="relative bg-slate-50/60 pb-10">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-slate-950 px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:px-8 sm:py-10 lg:px-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-cyan-300 to-brand-gold" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-7 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <Reveal when="mount"><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300"><span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden />{copy.hero.eyebrow}</p></Reveal>
            <Reveal when="mount" delayMs={40}><h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">{copy.hero.title}</h1></Reveal>
            <Reveal when="mount" delayMs={80}><p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">{copy.hero.body}</p></Reveal>
            <Reveal when="mount" delayMs={120} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#decision-finder" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-50">{copy.hero.primary}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></a>
              <Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology" } }} onClick={() => trackJourneyCta("advisor", "hero")} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">{copy.finalCta.primary}</Link>
            </Reveal>
            <p className="mt-5 text-xs font-semibold leading-5 tracking-wide text-cyan-100">{copy.hero.proof}</p>
          </div>
          <Reveal when="mount" delayMs={120} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{copy.hero.lensTitle}</p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">{copy.hero.questions.map((question, index) => <li key={question} className="flex gap-3 text-sm font-semibold leading-5 text-white"><span className="text-cyan-300">0{index + 1}</span><span>{question}</span></li>)}</ol>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-6xl">
        <Reveal id="decision-finder" className="scroll-mt-24 py-11 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.journeys.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">{copy.journeys.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{copy.journeys.body}</p>
          </div>

          <div className="mx-auto mt-7 max-w-4xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-2 bg-slate-100 p-1.5" role="tablist" aria-label={copy.journeys.title}>
              <button type="button" role="tab" aria-selected={journey === "advisor"} onClick={() => chooseJourney("advisor")} className={`min-h-12 rounded-xl px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${journey === "advisor" ? "bg-white text-primary-dark shadow-sm" : "text-slate-600 hover:text-slate-950"}`}><Compass className="mr-2 inline h-4 w-4" aria-hidden />{copy.journeys.advisorTitle}</button>
              <button type="button" role="tab" aria-selected={journey === "category"} onClick={() => chooseJourney("category")} className={`min-h-12 rounded-xl px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${journey === "category" ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:text-slate-950"}`}><Layers3 className="mr-2 inline h-4 w-4" aria-hidden />{copy.journeys.readyTitle}</button>
            </div>

            <div className="p-5 sm:p-7" role="tabpanel" aria-live="polite">
              {journey === "advisor" ? (
                <div>
                  <p className="text-sm font-bold text-slate-950">{copy.journeys.advisorPrompt}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">{copy.journeys.advisorNeeds.map((need) => { const selected = need.id === advisorNeed; return <button key={need.id} type="button" onClick={() => chooseNeed(need.id)} aria-pressed={selected} className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected ? "border-primary-dark bg-primary-dark text-white" : "border-slate-200 text-slate-800 hover:border-primary hover:bg-primary/[0.04]"}`}>{need.label}</button>; })}</div>
                  {selectedNeed ? <div className="mt-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-cyan-50 p-5 sm:p-6">
                    <h3 className="font-serif text-2xl font-bold leading-tight text-slate-950">{selectedNeed.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{selectedNeed.body}</p>
                    <div className="mt-5 rounded-xl border border-white bg-white/80 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{copy.journeys.decisionOutput}</p><p className="mt-2 text-sm leading-6 text-slate-700">{selectedNeed.output}</p></div>
                    <details className="group mt-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-800 [&::-webkit-details-marker]:hidden">{copy.journeys.leadershipQuestions}<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden /></summary><ul className="mt-3 space-y-2">{selectedNeed.questions.map((question) => <li key={question} className="flex items-start gap-2 text-sm leading-5 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />{question}</li>)}</ul></details>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row"><Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology", need: selectedNeed.id } }} onClick={() => trackJourneyCta("advisor", selectedNeed.id)} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-darker">{copy.journeys.reviewCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link><Link href="/tools/technology-decision-brief" onClick={() => trackJourneyCta("brief", selectedNeed.id)} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-primary">{copy.journeys.briefCta}</Link></div>
                  </div> : <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-600">{copy.journeys.advisorBody}</p>}
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-slate-950">{copy.journeys.categoryPrompt}</p>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap" role="list" aria-label={copy.journeys.categoryPrompt}>{copy.journeys.categories.map((category) => { const selected = category.id === categoryId; return <button key={category.id} type="button" onClick={() => chooseCategory(category.id)} aria-pressed={selected} className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white text-slate-800 hover:border-primary"}`}>{category.label}</button>; })}</div>
                  {selectedCategory ? <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white sm:p-6">
                    <h3 className="font-serif text-2xl font-bold text-white">{selectedCategory.label}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{selectedCategory.outcome}</p>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">{copy.journeys.compareLabel}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">{selectedCategory.compare.map((criterion) => <li key={criterion} className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-slate-200">{criterion}</li>)}</ul>
                    <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">{copy.journeys.decisionOutput}</p><p className="mt-2 text-sm leading-6 text-slate-200">{selectedCategory.output}</p></div>
                    <details className="group mt-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-white [&::-webkit-details-marker]:hidden">{copy.journeys.leadershipQuestions}<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden /></summary><ul className="mt-3 space-y-2">{selectedCategory.questions.map((question) => <li key={question} className="flex items-start gap-2 text-sm leading-5 text-slate-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden />{question}</li>)}</ul></details>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row"><Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology", need: selectedCategory.id } }} onClick={() => trackJourneyCta("category", selectedCategory.id)} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-50">{copy.journeys.inquiryCta} {selectedCategory.label}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link><Link href="/tools/technology-decision-brief" onClick={() => trackJourneyCta("brief", selectedCategory.id)} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">{copy.journeys.compareCta}</Link></div>
                  </div> : <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-600">{copy.journeys.readyBody}</p>}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 px-6 py-9 text-white shadow-xl sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{copy.credibility.eyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">{copy.credibility.title}</h2><p className="mt-4 text-sm leading-6 text-slate-300">{copy.credibility.body}</p><Link href="/partners" className="mt-5 inline-flex items-center text-sm font-bold text-cyan-300 hover:text-white hover:underline">{t("technologyPartnersLink")}<ExternalLink className="ml-2 h-4 w-4" aria-hidden /></Link></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{copy.process.eyebrow}</p><h3 className="mt-3 font-serif text-2xl font-bold text-white">{copy.process.title}</h3><ol className="mt-5 grid gap-3 sm:grid-cols-3">{copy.process.steps.map((step, index) => <li key={step.title} className="rounded-xl border border-white/10 bg-white/[0.06] p-4"><span className="text-xs font-bold text-cyan-300">0{index + 1}</span><h4 className="mt-2 font-serif text-lg font-bold text-white">{step.title}</h4><p className="mt-1 text-sm leading-5 text-slate-300">{step.body}</p></li>)}</ol></div>
          </div>
        </Reveal>

        <Reveal className="mt-10 rounded-[1.75rem] bg-primary-dark px-6 py-9 text-white shadow-lg sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{copy.finalCta.eyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">{copy.finalCta.title}</h2><p className="mt-3 text-base leading-7 text-cyan-50/90">{copy.finalCta.body}</p><p className="mt-4 text-sm font-medium text-cyan-100">{t("technologyCallNext")}</p></div><div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"><Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology" } }} onClick={() => trackJourneyCta("advisor", "final")} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100">{copy.finalCta.primary}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link><Link href="/tools/technology-decision-brief" onClick={() => trackJourneyCta("brief", "final")} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">{copy.finalCta.secondary}</Link></div></div>
        </Reveal>

        <Reveal className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{copy.details.eyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950">{copy.details.title}</h2><p className="mt-3 text-sm leading-6 text-slate-700">{copy.details.body}</p></div>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">{[
            { title: copy.details.scope, icon: Layers3, content: <><DetailList items={deliverableKeys.map((key) => t(key))} /><DetailList items={capabilityKeys.map((key) => t(key))} /></> },
            { title: copy.details.delivery, icon: Scale, content: <><DetailList items={evaluationKeys.map((key) => t(key))} /><DetailList items={implementationKeys.map((key) => t(key))} /></> },
            { title: copy.details.disclosure, icon: ShieldCheck, content: <div className="pt-5"><DetailList items={disclosureItems} /><p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{t("technologyCompensation")}</p><p className="mt-3 text-sm leading-6 text-slate-600">{t("technologyPricingNote")}</p></div> },
          ].map(({ title, icon: Icon, content }) => <details key={title} className="group py-1"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-3 font-serif text-lg font-bold text-slate-950"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-dark"><Icon className="h-4 w-4" aria-hidden /></span>{title}</span><ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" aria-hidden /></summary><div className="pb-6 pl-0 sm:pl-12">{content}</div></details>)}</div>
        </Reveal>

        <Reveal className="mt-12 border-t border-slate-200 pt-10"><h2 className="font-serif text-3xl font-bold text-slate-950">{t("faqTitle")}</h2><div className="mt-6"><ServiceMiniFAQ namespace="services" keys={TECHNOLOGY_PAGE_FAQ_KEYS} /></div></Reveal>
      </div>
      <StickyMobileCTA label={copy.finalCta.primary} sublabel={tCommon("ctaSubtext")} intent="consulting" focus="technology" />
    </section>
  );
};

export default TechnologyAdvisory;
