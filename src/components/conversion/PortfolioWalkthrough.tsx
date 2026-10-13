"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  buildPortfolioScheduleQuery,
  getPortfolioItem,
  portfolioImageAlts,
} from "@/lib/digitalPortfolio";

const STEPS = [
  { id: "pitch-hotshots" as const, copyKey: "walkStep1" },
  { id: "kaylan-kaptures" as const, copyKey: "walkStep2" },
  { id: "goalie-stop" as const, copyKey: "walkStep3" },
];

export default function PortfolioWalkthrough({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("digitalCreations");
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const item = getPortfolioItem(step.id);
  const embedUrl = process.env.NEXT_PUBLIC_PORTFOLIO_WALKTHROUGH_URL;
  const scheduleQuery = item ? buildPortfolioScheduleQuery(item) : { intent: "website" as const };

  return (
    <section
      className={`mb-12 rounded-2xl border border-slate-200 bg-slate-950 overflow-hidden ${className}`}
      aria-labelledby="portfolio-walkthrough-heading"
    >
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-0">
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-light">
            {t("walkthroughEyebrow")}
          </p>
          <h2
            id="portfolio-walkthrough-heading"
            className="mt-2 text-2xl font-serif font-bold text-white"
          >
            {t("walkthroughTitle")}
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {t("walkthroughDesc")}
          </p>

          {embedUrl ? (
            <div className="mt-5 aspect-video rounded-xl overflow-hidden border border-white/15 bg-black">
              <iframe
                src={embedUrl}
                title={t("walkthroughTitle")}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <ol className="mt-5 space-y-2">
              {STEPS.map((s, index) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                      active === index
                        ? "border-primary bg-primary/15 text-white"
                        : "border-white/15 bg-white/5 text-slate-300 hover:border-white/30"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-light">
                      <Play className="h-3.5 w-3.5" aria-hidden />
                      {t("walkStepLabel", { n: index + 1 })}
                    </span>
                    <span className="mt-1 block text-sm font-medium">
                      {t(s.copyKey as "walkStep1")}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {item?.tryUrl ? (
              <a
                href={item.tryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                {t("openLiveSite")}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </a>
            ) : null}
            <Link
              href={{ pathname: "/contact", query: scheduleQuery }}
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t("discussBuildLike")}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[16rem] lg:min-h-full border-t lg:border-t-0 lg:border-l border-white/10 bg-slate-900">
          {item?.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={portfolioImageAlts[item.id]}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : null}
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
