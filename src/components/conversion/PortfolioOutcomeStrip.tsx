"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  buildPortfolioScheduleQuery,
  getPortfolioItem,
  homeProofItemIds,
  type PortfolioItemId,
} from "@/lib/digitalPortfolio";

const nameKeyById: Record<(typeof homeProofItemIds)[number], string> = {
  "pitch-hotshots": "t10Name",
  "kaylan-kaptures": "t15Name",
  "goalie-stop": "t12Name",
};

const outcomeKeyById: Record<(typeof homeProofItemIds)[number], string> = {
  "pitch-hotshots": "t10CaseStudy",
  "kaylan-kaptures": "t15CaseStudy",
  "goalie-stop": "t12CaseStudy",
};

export default function PortfolioOutcomeStrip({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("digitalCreations");
  const items = homeProofItemIds
    .map((id) => getPortfolioItem(id as PortfolioItemId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className={`mb-10 ${className}`} aria-labelledby="portfolio-outcomes-heading">
      <div className="mb-5 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
          {t("outcomesStripEyebrow")}
        </p>
        <h2
          id="portfolio-outcomes-heading"
          className="mt-1 text-xl md:text-2xl font-serif font-bold text-slate-900"
        >
          {t("outcomesStripTitle")}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{t("outcomesStripDesc")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const id = item.id as (typeof homeProofItemIds)[number];
          const scheduleQuery = buildPortfolioScheduleQuery(item);
          return (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-dark">
                {t("businessOutcomeLabel")}
              </p>
              <h3 className="mt-2 text-base font-serif font-bold text-slate-900">
                {t(nameKeyById[id] as "t10Name")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 flex-1">
                {t(outcomeKeyById[id] as "t10CaseStudy")}
              </p>
              <Link
                href={{ pathname: "/contact", query: scheduleQuery }}
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
              >
                {t("discussBuildLike")}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
