"use client";

import React from "react";
import Reveal from "./motion/Reveal";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle,
  Network,
  ShieldCheck,
} from "lucide-react";
import ScheduleButton from "./ScheduleButton";
import StickyMobileCTA from "./StickyMobileCTA";
import ServiceMiniFAQ from "./services/ServiceMiniFAQ";
import { TECHNOLOGY_PAGE_FAQ_KEYS } from "@/lib/service-faq-jsonld";
import {
  ServicePageHero,
  ConsultingHeroVisual,
  ServiceAnchorNav,
  ServiceSectionHeading,
  ServicePageCTA,
} from "./services/ServicePageSections";

const technologyFeatureKeys = [
  "technologyF1",
  "technologyF2",
  "technologyF3",
  "technologyF4",
  "technologyF5",
  "technologyF6",
  "technologyF7",
  "technologyF8",
] as const;
const technologyEvaluationKeys = [
  "technologyEvaluation1",
  "technologyEvaluation2",
  "technologyEvaluation3",
  "technologyEvaluation4",
  "technologyEvaluation5",
  "technologyEvaluation6",
  "technologyEvaluation7",
  "technologyEvaluation8",
] as const;
const fitKeys = ["technologyFit1", "technologyFit2", "technologyFit3"] as const;
const howWeWorkSteps = ["step1", "step2", "step3", "step4"] as const;

const TechnologyAdvisory = () => {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");

  const stats = [
    { value: t("technologyStat1Value"), label: t("technologyStat1Label") },
    { value: t("technologyStat2Value"), label: t("technologyStat2Label") },
    { value: t("technologyStat3Value"), label: t("technologyStat3Label") },
  ];

  return (
    <section id="technology-advisory" className="section-padding relative bg-slate-50/60">
      <ServicePageHero
        variant="consulting"
        eyebrow={t("technologyHeroEyebrow")}
        title={t("technologyPageTitle")}
        subtitle={t("technologyPageSubtitle")}
        subtitleHighlight={t("technologyPageSubtitleHighlight")}
        journeyLine={undefined}
        stats={stats}
        visual={
          <ConsultingHeroVisual
            proofTitle={t("technologyHeroProofTitle")}
            proofSubtitle={t("technologyHeroProofSubtitle")}
            outcomes={[
              t("technologyHeroOutcome1"),
              t("technologyHeroOutcome2"),
              t("technologyHeroOutcome3"),
            ]}
            caseLines={[t("technologyHeroCase1"), t("technologyHeroCase2")]}
          />
        }
        primaryCta={
          <ScheduleButton variant="primary" size="lg" icon intent="consulting" focus="technology">
            {t("technologyCtaButton")}
          </ScheduleButton>
        }
        ctaSubtext={tCommon("ctaSubtext")}
        tertiaryLink={{ href: "/programs/business-enablement", label: t("technologyCrossLinkBusiness") }}
      />

      <div className="max-w-6xl mx-auto">
        <ServiceAnchorNav
          label={t("jumpNavLabel")}
          items={[
            { id: "technology-capabilities", label: t("technologyCapabilitiesNav") },
            { id: "technology-partners", label: t("technologyPartnerTitle") },
            { id: "technology-evaluation", label: t("technologyEvaluationTitle") },
            { id: "how-we-work", label: t("engagementTitle") },
          ]}
        />

        <Reveal id="technology-capabilities" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
            {t("technologyPartnerEyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-serif font-bold text-slate-900">
            {t("technologyTitle")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 max-w-3xl">
            {t("technologyDesc")}
          </p>
          <p className="mt-5 text-sm font-medium text-slate-800 border-l-4 border-primary bg-primary/[0.06] rounded-r-md pl-3 py-2 leading-relaxed">
            {t("technologyIdeal")}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <p className="text-slate-800 bg-slate-50 rounded-md border border-slate-200 px-3 py-2.5 text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-primary-dark mb-1">
                {t("outcomeLabel")}
              </span>
              {t("technologyOutcome")}
            </p>
            <p className="text-slate-700 rounded-md border border-slate-200 px-3 py-2.5 text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">
                {t("notForLabel")}
              </span>
              {t("technologyNotFor")}
            </p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {technologyFeatureKeys.map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                {t(key)}
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-5 border-t border-slate-200">
            <Link
              href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology" } }}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors"
            >
              {t("requestConsultation")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal
          id="technology-partners"
          className="scroll-mt-28 mt-10 rounded-2xl border border-primary/25 bg-white p-6 lg:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
                {t("technologyPartnerEyebrow")}
              </p>
              <h2 className="mt-2 text-2xl font-serif font-bold text-slate-900">
                {t("technologyPartnerTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {t("technologyPartnerBody")}
              </p>
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
                {t("technologyCompensation")}
              </p>
              <Link
                href="/partners"
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
              >
                {t("technologyPartnersLink")}
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div id="technology-evaluation" className="scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary-dark" aria-hidden />
                </span>
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  {t("technologyEvaluationTitle")}
                </h2>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {technologyEvaluationKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal id="how-we-work" className="scroll-mt-28 mt-16 pt-12 border-t-2 border-slate-200">
          <ServiceSectionHeading
            title={t("engagementTitle")}
            description={t("engagementSubtitle")}
          />
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {howWeWorkSteps.map((stepKey, index) => (
              <li
                key={stepKey}
                className="rounded-lg border border-slate-200 bg-white p-5 lg:p-6 flex gap-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary-dark">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    {t("stepLabel", { number: index + 1 })}
                  </p>
                  <p className="text-sm text-slate-800 leading-relaxed">{t(stepKey)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200 grid lg:grid-cols-2 gap-6">
          <div className="rounded-lg border-2 border-primary/30 bg-primary/[0.04] p-6 lg:p-8">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">
              {t("fitTitle")}
            </h2>
            <ul className="space-y-3">
              {fitKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2.5 text-sm font-medium text-slate-800"
                >
                  <CheckCircle className="w-4 h-4 text-primary-dark shrink-0 mt-0.5" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-300 bg-slate-100 p-6 lg:p-8 flex flex-col justify-center gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
                <Network className="h-5 w-5 text-primary-dark" aria-hidden />
              </span>
              <p className="text-slate-800 leading-relaxed text-sm font-medium">
                {t("technologyFitBusinessNote")}
              </p>
            </div>
            <Link
              href="/programs/business-enablement"
              className="inline-flex items-center text-primary-dark font-semibold text-sm hover:underline"
            >
              {t("technologyCrossLinkBusiness")}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200">
          <ServiceSectionHeading title={t("faqTitle")} />
          <ServiceMiniFAQ namespace="services" keys={TECHNOLOGY_PAGE_FAQ_KEYS} />
        </Reveal>

        <ServicePageCTA
          badge={t("technologyCtaBadge")}
          title={t("technologyCtaTitle")}
          subtitle={t("technologyCtaSubtitle")}
          qualifier={t("technologyCtaQualifier")}
          ctaSubtext={tCommon("ctaSubtext")}
          primaryCta={
            <ScheduleButton
              variant="secondary"
              size="lg"
              icon
              intent="consulting"
              focus="technology"
              className="bg-white text-slate-900 hover:bg-slate-100 border-0"
            >
              {t("technologyCtaButton")}
            </ScheduleButton>
          }
          secondaryCta={
            <Link
              href="/partners"
              className="inline-flex items-center justify-center text-sm font-medium text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
            >
              {t("technologyPartnersLink")}
            </Link>
          }
          confidentiality={{
            href: "/contact",
            label: t("confidentialityLink"),
            title: t("ctaConfidentialTitle"),
            hint: t("ctaConfidentialHint"),
          }}
          links={[
            {
              href: "/programs/business-enablement",
              label: t("technologyCrossLinkBusiness"),
              title: t("ctaPathBusinessTitle"),
              hint: t("ctaPathBusinessHint"),
            },
            {
              href: "/programs/workshops",
              label: t("crossLinkWorkshops"),
              title: t("ctaPathWorkshopsTitle"),
              hint: t("ctaPathWorkshopsHint"),
            },
            {
              href: "/services/digital",
              label: t("crossLinkDigital"),
              title: t("ctaPathDigitalTitle"),
              hint: t("ctaPathDigitalHint"),
            },
            {
              href: "/services/portfolio",
              label: t("crossLinkOurWork"),
              title: t("ctaPathPortfolioTitle"),
              hint: t("ctaPathPortfolioHint"),
            },
          ]}
        />
      </div>
      <StickyMobileCTA
        label={t("technologyCtaButton")}
        sublabel={tCommon("ctaSubtext")}
        intent="consulting"
        focus="technology"
      />
    </section>
  );
};

export default TechnologyAdvisory;
