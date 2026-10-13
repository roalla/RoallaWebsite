"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const tiers = [
  {
    key: "launch" as const,
    nameKey: "pkgLaunchName",
    priceKey: "pkgLaunchPrice",
    descKey: "pkgLaunchDesc",
    ctaKey: "pkgLaunchCta",
    offer: "founding",
  },
  {
    key: "visibility" as const,
    nameKey: "pkgVisName",
    priceKey: "pkgVisPrice",
    descKey: "pkgVisDesc",
    ctaKey: "pkgVisCta",
    offer: "visibility",
  },
  {
    key: "growth" as const,
    nameKey: "pkgGrowthName",
    priceKey: "pkgGrowthPrice",
    descKey: "pkgGrowthDesc",
    ctaKey: "pkgGrowthCta",
    offer: "growth",
  },
] as const;

type Tone = "light" | "onPrimary";

export default function PackageLadder({
  tone = "light",
  className = "",
  compact = false,
}: {
  tone?: Tone;
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslations("foundingClient");
  const tLadder = useTranslations("common.packageLadder");
  const onPrimary = tone === "onPrimary";

  return (
    <div className={className}>
      <div className="mb-4 text-center sm:text-left">
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            onPrimary ? "text-white/80" : "text-primary-dark"
          }`}
        >
          {tLadder("eyebrow")}
        </p>
        <h3
          className={`mt-1 text-lg font-serif font-bold ${
            onPrimary ? "text-white" : "text-slate-900"
          }`}
        >
          {tLadder("title")}
        </h3>
        {!compact ? (
          <p
            className={`mt-1 text-sm ${onPrimary ? "text-white/85" : "text-slate-600"}`}
          >
            {tLadder("desc")}
          </p>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className={`rounded-xl border p-4 flex flex-col ${
              onPrimary
                ? "border-white/25 bg-white/10"
                : "border-slate-200 bg-white"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                onPrimary ? "text-white" : "text-slate-900"
              }`}
            >
              {t(tier.nameKey)}
            </p>
            <p
              className={`mt-1 text-lg font-serif font-bold tabular-nums ${
                onPrimary ? "text-white" : "text-primary-dark"
              }`}
            >
              {t(tier.priceKey)}
            </p>
            <p
              className={`mt-2 text-xs leading-relaxed flex-1 ${
                onPrimary ? "text-white/80" : "text-slate-600"
              }`}
            >
              {t(tier.descKey)}
            </p>
            <Link
              href={{
                pathname: "/contact",
                query: { intent: "website", offer: tier.offer },
              }}
              className={`mt-3 inline-flex items-center text-sm font-semibold ${
                onPrimary
                  ? "text-white hover:underline"
                  : "text-primary-dark hover:underline"
              }`}
            >
              {t(tier.ctaKey)}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/website-package"
          className={`inline-flex items-center text-sm font-semibold ${
            onPrimary ? "text-white hover:underline" : "text-slate-700 hover:text-primary-dark hover:underline"
          }`}
        >
          {tLadder("compareAll")}
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
        </Link>
        <p className={`text-xs ${onPrimary ? "text-white/70" : "text-slate-500"}`}>
          {tLadder("customNote")}
        </p>
      </div>
    </div>
  );
}
