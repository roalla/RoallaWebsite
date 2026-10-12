"use client";

import { ArrowDown, ArrowRight, Bot, CalendarRange, Check, Compass, Gauge, MonitorSmartphone, SearchCheck, Sparkles, UsersRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { SolutionsByNeedContent, SolutionPathId } from "@/lib/solutions-by-need";

const PATHWAY_ICONS = {
  strategy: Compass,
  technology: Gauge,
  "digital-experience": MonitorSmartphone,
  "automation-ai": Bot,
  visibility: SearchCheck,
  "team-execution": UsersRound,
  events: CalendarRange,
  optimization: Sparkles,
} satisfies Record<SolutionPathId, typeof Compass>;

export default function SolutionsByNeedPage({ content }: { content: SolutionsByNeedContent }) {
  return (
    <div className="page-shell bg-white">
      <section data-header-tone="dark" className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:42px_42px]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{content.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">{content.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">{content.intro}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/assessment" onClick={() => trackAnalyticsEvent("solutions_assessment_click", { location: "solutions_hero" })} className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
              {content.heroPrimary}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <a href="#pathways" className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {content.heroSecondary}<ArrowDown className="ml-2 h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <section id="pathways" aria-labelledby="pathways-title" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{content.pathwaysEyebrow}</p>
            <h2 id="pathways-title" className="mt-3 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">{content.pathwaysTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">{content.pathwaysDescription}</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {content.pathways.map((pathway, index) => {
              const Icon = PATHWAY_ICONS[pathway.id];
              return (
                <article key={pathway.id} id={pathway.id} className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md sm:p-7">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark"><Icon className="h-6 w-6" aria-hidden /></span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{String(index + 1).padStart(2, "0")} · {pathway.shortTitle}</p>
                      <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-slate-950">{pathway.title}</h3>
                    </div>
                  </div>
                  <p className="mt-5 leading-7 text-slate-600">{pathway.description}</p>
                  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{content.signsLabel}</p>
                    <ul className="mt-3 space-y-2">
                      {pathway.signals.map((signal) => (
                        <li key={signal} className="flex gap-2 text-sm leading-6 text-slate-700"><Check className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden /><span>{signal}</span></li>
                      ))}
                    </ul>
                  </div>
                  <Link href={pathway.href} onClick={() => trackAnalyticsEvent("solutions_pathway_click", { location: "solutions_page", pathway: pathway.id })} className="mt-6 inline-flex min-h-[44px] items-center font-semibold text-primary-dark underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {content.serviceCta}: {pathway.serviceLabel}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl font-medium leading-7 text-slate-800">{content.assessmentPrompt}</p>
            <Link href="/assessment" onClick={() => trackAnalyticsEvent("solutions_assessment_click", { location: "solutions_pathways" })} className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {content.heroPrimary}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{content.closingEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-white">{content.closingTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{content.closingDescription}</p>
          </div>
          <Link href="/assessment" onClick={() => trackAnalyticsEvent("solutions_assessment_click", { location: "solutions_closing" })} className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
            {content.heroPrimary}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
