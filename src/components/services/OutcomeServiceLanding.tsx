import React from "react";
import { ArrowRight, BarChart3, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ServiceLandingCopy } from "@/lib/service-landing-types";

export default function OutcomeServiceLanding({
  locale,
  content,
}: {
  locale: string;
  content: ServiceLandingCopy;
}) {
  const journey = [
    {
      label: locale === "fr" ? "Évaluer" : "Assess",
      href: "/assessment" as const,
    },
    {
      label: locale === "fr" ? "Construire" : "Build",
      href: "/services/digital-products" as const,
    },
    {
      label: locale === "fr" ? "Optimiser" : "Optimize",
      href: "/services/digital-visibility-optimization" as const,
    },
    {
      label: locale === "fr" ? "Automatiser" : "Automate",
      href: "/services/automation" as const,
    },
    {
      label: locale === "fr" ? "Évoluer" : "Evolve",
      href: "/services/managed-optimization" as const,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
      <header className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-7 py-12 lg:px-12 lg:py-16 text-white">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary-light">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl md:text-5xl font-serif font-bold leading-tight text-white">
          {content.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-300 leading-relaxed">
          {content.description}
        </p>
        <p className="mt-4 max-w-3xl text-sm font-medium text-primary-light">
          {content.outcome}
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          {content.cta}
          <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
        </Link>
      </header>
      <main className="max-w-6xl mx-auto">
        <nav
          aria-label={
            locale === "fr"
              ? "Parcours de services ROALLA"
              : "ROALLA service journey"
          }
          className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <ol className="flex flex-wrap items-center justify-center gap-2">
            {journey.map((stage, index) => (
              <li key={stage.label} className="flex items-center gap-2">
                {index > 0 ? (
                  <span className="text-slate-300" aria-hidden>
                    →
                  </span>
                ) : null}
                <Link
                  href={stage.href}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {stage.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <section className="py-16 grid md:grid-cols-2 gap-5">
          {content.capabilities.map(([title, body]) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-serif font-bold text-slate-900">
                {title}
              </h2>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                {body}
              </p>
            </article>
          ))}
        </section>
        <section className="border-t border-slate-200 pt-14">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.process.map(([title, body], index) => (
              <li
                key={title}
                className="rounded-xl bg-slate-50 border border-slate-200 p-5"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden />
                  <span className="text-xs font-bold text-slate-500">
                    {index + 1}
                  </span>
                </div>
                <h2 className="mt-3 font-serif font-bold text-slate-900">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-16 grid gap-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-950">
              {content.deliverablesTitle}
            </h2>
            <ul className="mt-6 space-y-3">
              {content.deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary-dark" aria-hidden />
              <h2 className="text-2xl font-serif font-bold text-slate-950">
                {content.measuresTitle}
              </h2>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {content.measures.map((item) => (
                <li key={item} className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-700">
            {content.starter.eyebrow}
          </p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-950">{content.starter.name}</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">{content.starter.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5">
                  <Clock3 className="h-4 w-4 text-primary" aria-hidden />{content.starter.timeline}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{content.starter.investment}</p>
              <p className="mt-4 text-sm font-medium text-slate-800">{content.starter.fit}</p>
              <p className="mt-2 flex gap-2 text-xs leading-5 text-slate-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{content.starter.exclusion}
              </p>
            </div>
            <div>
              <ul className="space-y-2">
                {content.starter.includes.map((item) => (
                  <li key={item} className="flex gap-2 rounded-lg bg-white/80 p-3 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}
                  </li>
                ))}
              </ul>
              <Link href={{ pathname: "/contact", query: { goal: content.starter.name } }} className="mt-5 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
                {content.starter.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-serif font-bold text-slate-950">{content.packagesTitle}</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {content.packages.map((item) => (
              <article key={item.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">{item.cadence}</p>
                <h3 className="mt-2 text-xl font-serif font-bold text-slate-950">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-2xl bg-slate-950 p-7 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-light">{content.proof.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-white">{content.proof.title}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{content.proof.description}</p>
            <p className="mt-3 text-xs text-slate-400">{content.proof.typeLabel}</p>
          </div>
          <a href={`/${locale}${content.proof.href}`} className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-100">
            {content.proof.label}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </a>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-serif font-bold text-slate-950">{content.faqTitle}</h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {content.faqs.map(([question, answer]) => (
              <details key={question} className="py-4">
                <summary className="cursor-pointer font-semibold text-slate-950">{question}</summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
          <h2 className="text-3xl font-serif font-bold text-slate-950">{content.finalTitle}</h2>
          <p className="mt-3 max-w-3xl text-slate-700">{content.finalBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={{ pathname: "/contact", query: { goal: content.finalTitle } }} className="inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
              {content.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <a href={`/${locale}/tools/digital-value-blueprint`} className="inline-flex min-h-[48px] items-center rounded-lg border border-primary/30 bg-white px-6 py-3 font-semibold text-primary-dark hover:border-primary">
              {locale === "fr" ? "Créer mon plan de valeur" : "Build my value plan"}
            </a>
            <a href={`/${locale}/tools/business-value-calculators`} className="inline-flex min-h-[48px] items-center rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 underline underline-offset-4">
              {locale === "fr" ? "Utiliser les calculateurs" : "Use the value calculators"}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
