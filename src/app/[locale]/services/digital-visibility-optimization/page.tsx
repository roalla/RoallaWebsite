import React from "react";
import type { Metadata } from "next";
import { CheckCircle2, SearchCheck } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import VisibilityCtas from "@/components/visibility/VisibilityCtas";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, servicePageJsonLd } from "@/lib/structured-data";
import {
  visibilityContent,
  type VisibilityLocale,
} from "@/lib/visibility-content";

type Props = { params: Promise<{ locale: string }> };

function contentFor(locale: string) {
  return visibilityContent[(locale === "fr" ? "fr" : "en") as VisibilityLocale];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = contentFor(locale);
  return buildPageMetadata({
    locale,
    path: "/services/digital-visibility-optimization",
    title: content.metadataTitle,
    description: content.metadataDescription,
  });
}

export default async function DigitalVisibilityOptimizationPage({
  params,
}: Props) {
  const { locale } = await params;
  const content = contentFor(locale);
  const path = "/services/digital-visibility-optimization";

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: locale === "fr" ? "Accueil" : "Home", path: "" },
            {
              name:
                locale === "fr"
                  ? "Accompagnement numérique"
                  : "Digital Enablement",
              path: "/services/digital",
            },
            { name: content.breadcrumb },
          ]),
          ...servicePageJsonLd({
            locale,
            path,
            name: content.breadcrumb,
            description: content.metadataDescription,
            serviceType: "Digital Visibility Optimization",
            offers: content.packages.map(([name, description]) => ({
              name,
              description,
            })),
            faqs: content.faqs.map(([question, answer]) => ({
              question,
              answer,
            })),
          }),
        ]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <header className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10 lg:px-12 lg:py-14 shadow-xl">
          <div
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
            aria-hidden
          />
          <div className="relative grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light mb-4">
                {content.eyebrow}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                {content.title}
              </h1>
              <p className="mt-5 text-lg text-slate-300 leading-relaxed">
                {content.subtitle}
              </p>
              <div className="mt-8">
                <VisibilityCtas
                  primaryLabel={content.primaryCta}
                  assessmentLabel={content.assessmentCta}
                  source="hero"
                />
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-6 backdrop-blur-md">
              <SearchCheck
                className="w-9 h-9 text-primary-light mb-4"
                aria-hidden
              />
              <h2 className="text-xl font-serif font-bold text-white">
                {content.proofTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {content.proofSubtitle}
              </p>
              <ul className="mt-5 space-y-3">
                {content.proofItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm text-slate-200"
                  >
                    <CheckCircle2
                      className="w-4 h-4 text-primary-light shrink-0 mt-0.5"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          <section className="pt-10">
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">
                  {locale === "fr" ? "Outil gratuit" : "Free tool"}
                </p>
                <h2 className="mt-2 text-2xl font-serif font-bold text-slate-950">
                  {locale === "fr"
                    ? "Découvrez gratuitement ce qui peut freiner votre présence en ligne."
                    : "See what may be holding back your online presence for free."}
                </h2>
                <p className="mt-3 text-slate-700">
                  {locale === "fr"
                    ? "Vérifiez l’expérience de votre site, sa préparation à la recherche et son apparence sur les réseaux sociaux dans un seul rapport clair. Aucune adresse courriel requise."
                    : "Check your website experience, search readiness, and social sharing in one clear report. No email address is required."}
                </p>
              </div>
              <div className="mt-5 shrink-0 lg:mt-0">
                <Link
                  href="/tools/digital-presence-snapshot"
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-brand-gold-light lg:w-auto"
                >
                  {locale === "fr" ? "Vérifier ma présence en ligne" : "Check my online presence"}
                </Link>
              </div>
            </div>
          </section>

          <section className="py-16 max-w-3xl">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              {content.problemTitle}
            </h2>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              {content.problemBody}
            </p>
          </section>

          <section className="pb-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              {content.includesTitle}
            </h2>
            <p className="mt-3 text-slate-700 max-w-3xl">
              {content.includesIntro}
            </p>
            <div className="mt-8 grid md:grid-cols-2 gap-5">
              {content.lanes.map((lane) => (
                <article
                  key={lane.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    {lane.title}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {lane.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm text-slate-700"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-primary shrink-0 mt-0.5"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="pb-16" aria-labelledby="visibility-jobs-title">
            <h2 id="visibility-jobs-title" className="text-3xl font-serif font-bold text-slate-900">
              {content.jobsTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-slate-700 leading-relaxed">{content.jobsIntro}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.jobs.map(([label, role, body]) => (
                <article key={label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="font-serif text-2xl font-bold text-slate-950">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-primary-dark">{role}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="py-16 border-y border-slate-200">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              {content.processTitle}
            </h2>
            <ol className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.process.map(([title, body], index) => (
                <li
                  key={title}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-5"
                >
                  <span className="text-xs font-bold text-primary-dark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-serif font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="py-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              {content.packagesTitle}
            </h2>
            <div className="mt-8 grid md:grid-cols-2 gap-5">
              {content.packages.map(([title, body]) => (
                <article
                  key={title}
                  className="rounded-xl border border-primary/20 bg-primary/[0.03] p-6"
                >
                  <h3 className="text-lg font-serif font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-700">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-slate-100 p-7 lg:p-10">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {content.measurementTitle}
            </h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              {content.measurementBody}
            </p>
            <div className="mt-6 border-l-4 border-brand-gold bg-white p-5">
              <h3 className="font-bold text-slate-900">
                {content.disclaimerTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                {content.disclaimer}
              </p>
            </div>
          </section>

          <section className="py-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              {content.faqTitle}
            </h2>
            <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
              {content.faqs.map(([question, answer]) => (
                <details key={question} className="group py-4">
                  <summary className="cursor-pointer font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {question}
                  </summary>
                  <p className="mt-3 pr-6 text-sm text-slate-700 leading-relaxed">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="pb-16">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {content.insightsTitle}
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {content.insights.map(([slug, title]) => (
                <Link
                  key={slug}
                  href={{ pathname: "/insights/[slug]", params: { slug } }}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-4 font-semibold text-primary-dark hover:border-primary transition-colors"
                >
                  {title}
                </Link>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl bg-slate-900 px-7 py-10 lg:px-12 lg:py-14 text-white">
            <h2 className="text-3xl font-serif font-bold">
              {content.finalTitle}
            </h2>
            <p className="mt-3 text-slate-300 max-w-2xl">{content.finalBody}</p>
            <div className="mt-7">
              <VisibilityCtas
                primaryLabel={content.primaryCta}
                assessmentLabel={content.assessmentCta}
                source="final"
              />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
