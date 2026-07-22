import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
        <h1 className="mt-4 max-w-4xl text-4xl md:text-5xl font-serif font-bold leading-tight">
          {content.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-300 leading-relaxed">
          {content.description}
        </p>
        <p className="mt-4 max-w-3xl text-sm font-medium text-primary-light">
          {content.outcome}
        </p>
        <Link
          href="/schedule"
          className="mt-8 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
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
      </main>
    </div>
  );
}
