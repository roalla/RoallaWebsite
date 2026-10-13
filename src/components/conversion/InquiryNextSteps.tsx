"use client";

import React from "react";
import { useTranslations } from "next-intl";

type Tone = "light" | "dark" | "onPrimary";

const toneClass: Record<Tone, { wrap: string; step: string; title: string; body: string; risk: string }> = {
  light: {
    wrap: "border-slate-200 bg-slate-50 text-slate-900",
    step: "bg-primary/10 text-primary-dark border-primary/20",
    title: "text-slate-900",
    body: "text-slate-600",
    risk: "text-slate-500",
  },
  dark: {
    wrap: "border-white/15 bg-white/[0.06] text-white",
    step: "bg-white/10 text-primary-light border-white/20",
    title: "text-white",
    body: "text-slate-300",
    risk: "text-slate-400",
  },
  onPrimary: {
    wrap: "border-white/25 bg-white/10 text-white",
    step: "bg-white/15 text-white border-white/30",
    title: "text-white",
    body: "text-white/90",
    risk: "text-white/75",
  },
};

export default function InquiryNextSteps({
  tone = "light",
  className = "",
  showRisk = true,
}: {
  tone?: Tone;
  className?: string;
  showRisk?: boolean;
}) {
  const t = useTranslations("common.inquiryPath");
  const styles = toneClass[tone];
  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ] as const;

  return (
    <div
      className={`rounded-xl border px-4 py-4 sm:px-5 sm:py-5 ${styles.wrap} ${className}`}
      aria-label={t("label")}
    >
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${styles.title}`}>
        {t("label")}
      </p>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3 min-w-0">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${styles.step}`}
              aria-hidden
            >
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className={`block text-sm font-semibold leading-snug ${styles.title}`}>
                {step.title}
              </span>
              <span className={`mt-0.5 block text-xs leading-relaxed ${styles.body}`}>
                {step.body}
              </span>
            </span>
          </li>
        ))}
      </ol>
      {showRisk ? (
        <p className={`mt-3 text-xs leading-relaxed border-t border-current/10 pt-3 ${styles.risk}`}>
          {t("riskReversal")}
        </p>
      ) : null}
    </div>
  );
}
