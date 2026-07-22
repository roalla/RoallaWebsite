import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import BrowserFrame from "@/components/digital/BrowserFrame";
import ScheduleButton from "@/components/ScheduleButton";
import {
  buildPortfolioScheduleQuery,
  getPortfolioItem,
  portfolioImageAlts,
} from "@/lib/digitalPortfolio";
import {
  CASE_STUDY_SLUGS,
  isCaseStudySlug,
} from "@/lib/portfolio-case-studies";
import { buildPageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.flatMap((slug) => [
    { locale: "en", slug },
    { locale: "fr", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isCaseStudySlug(slug)) return {};

  const item = getPortfolioItem(slug);
  if (!item) return {};

  const t = await getTranslations({ locale, namespace: "digitalCreations" });
  const prefix = item.i18nPrefix;
  const name = t(`${prefix}Name`);

  return buildPageMetadata({
    locale,
    path: `/services/portfolio/${slug}`,
    title: t("caseStudyMetadataTitle", { name }),
    description: t(`${prefix}CaseStudy`),
  });
}

export default async function PortfolioCaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isCaseStudySlug(slug)) notFound();

  const item = getPortfolioItem(slug);
  if (!item) notFound();

  const t = await getTranslations({ locale, namespace: "digitalCreations" });
  const tBc = await getTranslations("breadcrumb");
  const prefix = item.i18nPrefix;
  const name = t(`${prefix}Name`);
  const bullets = [`${prefix}B1`, `${prefix}B2`, `${prefix}B3`] as const;
  const scheduleQuery = buildPortfolioScheduleQuery(item);
  const deliveryFacts =
    item.category === "website"
      ? [t("technologyResponsiveWebsite"), t("technologyLiveDeployment")]
      : [
          t("technologyDigitalProduct"),
          t("technologyResponsiveInterface"),
          t("technologyLiveDeployment"),
        ];

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tBc("home"), path: "" },
            { name: tBc("portfolio"), path: "/services/portfolio" },
            { name },
          ]),
          creativeWorkJsonLd({
            locale,
            slug,
            name,
            description: t(`${prefix}CaseStudy`),
            imageUrl: item.imageUrl ?? undefined,
            projectUrl: item.tryUrl,
          }),
        ]}
      />
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
        <Breadcrumb
          items={[
            { label: tBc("home"), href: "/" },
            { label: tBc("portfolio"), href: "/services/portfolio" },
            { label: name },
          ]}
        />
        <header className="max-w-3xl mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">
            {t("caseStudyEyebrow")}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">
            {name}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{t(`${prefix}Desc`)}</p>
        </header>

        {item.imageUrl ? (
          <div className="max-w-5xl mb-12">
            <BrowserFrame
              imageUrl={item.imageUrl}
              imageAlt={portfolioImageAlts[item.id]}
              domain={item.domain}
            />
          </div>
        ) : null}

        <div className="grid gap-8 max-w-5xl md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {t("caseStudyChallengeTitle")}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {t(`${prefix}Desc`)}
            </p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {t("caseStudyOutcomeTitle")}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {t(`${prefix}CaseStudy`)}
            </p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {t("caseStudyCapabilityTitle")}
            </h2>
            <ul className="space-y-3">
              {bullets.map((key) => (
                <li key={key} className="flex gap-3 text-slate-700">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {t("caseStudyTechnologyTitle")}
            </h2>
            <ul className="space-y-3">
              {deliveryFacts.map((fact) => (
                <li key={fact} className="flex gap-3 text-slate-700">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <ScheduleButton
            variant="primary"
            size="md"
            service={scheduleQuery.service}
            reference={scheduleQuery.reference}
            need={scheduleQuery.need}
          >
            {t("caseStudyCta")}
          </ScheduleButton>
          <a
            href={item.tryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-action inline-flex items-center text-sm font-semibold"
          >
            {t("caseStudyLiveLink")}
          </a>
        </div>
      </article>
    </div>
  );
}
