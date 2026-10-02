"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle,
  GitCompareArrows,
  Network,
  PackageCheck,
  PlugZap,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Reveal from "./motion/Reveal";
import ScheduleButton from "./ScheduleButton";
import StickyMobileCTA from "./StickyMobileCTA";
import TechnologyDecisionFramework from "./TechnologyDecisionFramework";
import ServiceMiniFAQ from "./services/ServiceMiniFAQ";
import { TECHNOLOGY_PAGE_FAQ_KEYS } from "@/lib/service-faq-jsonld";
import {
  ServiceAnchorNav,
  ServicePageCTA,
  ServiceSectionHeading,
} from "./services/ServicePageSections";

const technologyFeatureKeys = [
  "technologyF1", "technologyF2", "technologyF3", "technologyF4",
  "technologyF5", "technologyF6", "technologyF7", "technologyF8",
] as const;

const technologyEvaluationKeys = [
  "technologyEvaluation1", "technologyEvaluation2", "technologyEvaluation3",
  "technologyEvaluation4", "technologyEvaluation5", "technologyEvaluation6",
  "technologyEvaluation7", "technologyEvaluation8",
] as const;

const deliverableKeys = [
  "technologyDeliverable1", "technologyDeliverable2", "technologyDeliverable3",
  "technologyDeliverable4", "technologyDeliverable5",
] as const;

const implementationKeys = [
  "technologyImplementation1", "technologyImplementation2", "technologyImplementation3",
  "technologyImplementation4", "technologyImplementation5", "technologyImplementation6",
] as const;

const fitKeys = ["technologyFit1", "technologyFit2", "technologyFit3"] as const;
const technologyStepKeys = ["technologyStep1", "technologyStep2", "technologyStep3", "technologyStep4"] as const;

const TechnologyAdvisory = () => {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const tFramework = useTranslations("technologyFramework");
  const reviewHref = {
    pathname: "/contact" as const,
    query: { intent: "consulting", focus: "technology" },
  };

  const stats = [
    { value: t("technologyStat1Value"), label: t("technologyStat1Label") },
    { value: t("technologyStat2Value"), label: t("technologyStat2Label") },
    { value: t("technologyStat3Value"), label: t("technologyStat3Label") },
  ];

  const situations = [
    { icon: RefreshCw, title: t("technologySituationStackTitle"), body: t("technologySituationStackBody") },
    { icon: GitCompareArrows, title: t("technologySituationSecurityTitle"), body: t("technologySituationSecurityBody") },
    { icon: PackageCheck, title: t("technologySituationCommsTitle"), body: t("technologySituationCommsBody") },
    { icon: PlugZap, title: t("technologySituationNewTitle"), body: t("technologySituationNewBody") },
  ];

  const decisionPaths = [
    tFramework("buyTitle"),
    tFramework("buildTitle"),
    tFramework("connectTitle"),
    tFramework("improveTitle"),
  ];

  const engagementOutcomes = [
    {
      image: "/images/programs/technology-outcome-requirements.webp",
      alt: t("technologyOutcome1Alt"),
      kicker: t("technologyOutcome1Kicker"),
      title: t("technologyOutcome1Title"),
      body: t("technologyOutcome1Body"),
      href: "#how-we-work",
      link: t("technologyOutcome1Link"),
    },
    {
      image: "/images/programs/technology-outcome-comparison.webp",
      alt: t("technologyOutcome2Alt"),
      kicker: t("technologyOutcome2Kicker"),
      title: t("technologyOutcome2Title"),
      body: t("technologyOutcome2Body"),
      href: "#technology-evaluation",
      link: t("technologyOutcome2Link"),
    },
    {
      image: "/images/programs/technology-outcome-implementation.webp",
      alt: t("technologyOutcome3Alt"),
      kicker: t("technologyOutcome3Kicker"),
      title: t("technologyOutcome3Title"),
      body: t("technologyOutcome3Body"),
      href: "#technology-implementation",
      link: t("technologyOutcome3Link"),
    },
  ];

  return (
    <section id="technology-advisory" className="section-padding relative bg-slate-50/60">
      <header className="relative mb-8 overflow-hidden rounded-[1.75rem] border border-primary/20 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary-dark to-slate-900" aria-hidden />
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden />

        <div className="relative grid gap-8 px-6 pb-8 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:px-10 lg:pb-10 lg:pt-12 xl:gap-12 xl:px-12">
          <div className="flex flex-col justify-center">
            <Reveal when="mount" delayMs={0}>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                {t("technologyHeroEyebrow")}
              </p>
            </Reveal>
            <Reveal when="mount" delayMs={50}>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-[1.03] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.55rem]">
                {t("technologyPageTitle")}
              </h1>
            </Reveal>
            <Reveal when="mount" delayMs={100}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">
                {t("technologyPageSubtitle")}
              </p>
            </Reveal>

            <Reveal when="mount" delayMs={160} className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ScheduleButton variant="primary" size="lg" icon intent="consulting" focus="technology">
                {t("technologyCtaButton")}
              </ScheduleButton>
              <Link
                href="/tools/technology-decision-brief"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-primary hover:text-primary-dark hover:shadow-md"
              >
                {t("technologySoftCta")}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
            <Reveal when="mount" delayMs={210}>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">{t("technologyCallNext")}</p>
              <Link href="/programs/business-enablement" className="mt-3 inline-flex text-sm font-semibold text-primary-dark underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                {t("technologyCrossLinkBusiness")}
              </Link>
            </Reveal>
          </div>

          <Reveal when="mount" delayMs={130} className="relative min-h-[430px] overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-xl sm:p-7">
            <Image
              src="/images/programs/technology-advisory-hero.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="pointer-events-none object-cover object-center opacity-20"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-primary-dark/75" aria-hidden />
            <div className="relative flex h-full flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light">{t("technologyHeroProofTitle")}</p>
              <h2 className="mt-2 max-w-md font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">{t("technologyHeroProofSubtitle")}</h2>

              <ol className="mt-7 space-y-3">
                {[t("technologyHeroOutcome1"), t("technologyHeroOutcome2"), t("technologyHeroOutcome3")].map((outcome, index) => (
                  <li key={outcome} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium leading-snug text-slate-100">{outcome}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-auto pt-7">
                <div className="h-px bg-gradient-to-r from-primary via-white/20 to-transparent" aria-hidden />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-300">{tFramework("eyebrow")}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {decisionPaths.map((path, index) => (
                    <div key={path} className="rounded-lg border border-white/15 bg-slate-950/45 px-3 py-3">
                      <span className="block text-[10px] font-bold text-primary-light">0{index + 1}</span>
                      <span className="mt-1 block text-sm font-bold text-white">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <dl className="relative grid border-t border-slate-200 bg-slate-50/90 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              when="mount"
              delayMs={280 + index * 60}
              className="flex items-center gap-3 border-b border-slate-200 px-6 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:px-10"
            >
              <dt className="font-serif text-lg font-bold text-slate-950">{stat.value}</dt>
              <dd className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{stat.label}</dd>
            </Reveal>
          ))}
        </dl>
        <p className="relative border-t border-slate-200 bg-white px-6 py-3 text-center text-xs font-medium text-slate-600 lg:px-10">
          {t("technologyStatsNote")}
        </p>
      </header>

      <div className="max-w-6xl mx-auto">
        <Reveal id="technology-deliverables" className="scroll-mt-28 rounded-2xl border border-primary/25 bg-white p-6 shadow-sm lg:p-8">
          <ServiceSectionHeading eyebrow={t("technologyDeliverablesEyebrow")} title={t("technologyDeliverablesTitle")} description={t("technologyDeliverablesDescription")} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {deliverableKeys.map((key) => (
              <li key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-800">
                <CheckCircle className="mb-3 h-5 w-5 text-primary-dark" aria-hidden />
                {t(key)}
              </li>
            ))}
          </ul>
        </Reveal>

        <ServiceAnchorNav
          label={t("jumpNavLabel")}
          items={[
            { id: "technology-outcomes", label: t("technologyOutcomesNav") },
            { id: "technology-situations", label: t("technologySituationsNav") },
            { id: "technology-engagements", label: t("technologyEngagementNav") },
            { id: "how-we-work", label: t("engagementTitle") },
            { id: "technology-capabilities", label: t("technologyCapabilitiesNav") },
            { id: "technology-implementation", label: t("technologyImplementationNav") },
            { id: "technology-partners", label: t("technologyPartnerNav") },
          ]}
        />

        <Reveal id="technology-outcomes" className="relative mb-12 scroll-mt-28 overflow-hidden rounded-[1.75rem] bg-slate-950 px-5 py-8 shadow-xl shadow-slate-950/10 sm:px-7 lg:px-9 lg:py-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cyan-300 to-brand-gold" aria-hidden />
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light">{t("technologyOutcomesEyebrow")}</p>
              <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight text-white md:text-4xl">{t("technologyOutcomesTitle")}</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-300 lg:pb-1">{t("technologyOutcomesDescription")}</p>
          </div>

          <div className="relative mt-8 grid gap-5 lg:grid-cols-3">
            {engagementOutcomes.map((outcome, index) => (
              <article key={outcome.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1">
                <div className="relative aspect-[3/2] overflow-hidden bg-slate-800">
                  <Image
                    src={outcome.image}
                    alt={outcome.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 370px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" aria-hidden />
                  <span className="absolute bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-slate-950/75 text-xs font-bold text-white backdrop-blur-sm">
                    0{index + 1}
                  </span>
                </div>
                <div className="flex min-h-[250px] flex-col p-5 sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-dark">{outcome.kicker}</p>
                  <h3 className="mt-2 font-serif text-xl font-bold leading-tight text-slate-950">{outcome.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{outcome.body}</p>
                  <a href={outcome.href} className="mt-auto inline-flex items-center pt-5 text-sm font-bold text-primary-dark hover:underline">
                    {outcome.link}
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="relative mt-7 grid gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-serif text-xl font-bold text-white">{t("technologyOutcomesInsightTitle")}</p>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">{t("technologyOutcomesInsightBody")}</p>
            </div>
            <Link href={reviewHref} className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark">
              {t("technologyOutcomesCta")}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <Reveal id="technology-situations" className="scroll-mt-28">
          <ServiceSectionHeading eyebrow={t("technologySituationsEyebrow")} title={t("technologySituationsTitle")} description={t("technologySituationsSubtitle")} />
          <div className="grid gap-4 sm:grid-cols-2">
            {situations.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary-dark" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-serif font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{item.body}</p>
                    </div>
                  </div>
                  <Link href={reviewHref} className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
                    {t("technologyCtaButton")}
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </Link>
                </div>
              );
            })}
          </div>
        </Reveal>

        <TechnologyDecisionFramework compact className="my-12" />

        <Reveal id="technology-engagements" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
          <ServiceSectionHeading eyebrow={t("technologyEngagementEyebrow")} title={t("technologyEngagementTitle")} description={t("technologyEngagementSubtitle")} />
          <div className="grid gap-4 lg:grid-cols-3">
            {([1, 2, 3] as const).map((number) => (
              <div key={number} className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
                <h3 className="font-serif text-lg font-bold text-slate-950">{t(`technologyEngagement${number}Title`)}</h3>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary-dark">{t("technologyEngagementBestFor")}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{t(`technologyEngagement${number}Best`)}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary-dark">{t("technologyEngagementResult")}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{t(`technologyEngagement${number}Result`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-lg border border-primary/20 bg-primary/[0.05] px-4 py-3 text-sm leading-relaxed text-slate-700">{t("technologyEngagementNote")}</p>
        </Reveal>

        <Reveal id="how-we-work" className="scroll-mt-28 mt-16 pt-12 border-t-2 border-slate-200">
          <ServiceSectionHeading title={t("engagementTitle")} description={t("technologyEngagementProcessSubtitle")} />
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
            {technologyStepKeys.map((stepKey, index) => (
              <li key={stepKey} className="rounded-lg border border-slate-200 bg-white p-5 lg:p-6 flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary-dark">{index + 1}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">{t("stepLabel", { number: index + 1 })}</p>
                  <p className="text-sm text-slate-800 leading-relaxed">{t(stepKey)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal id="technology-capabilities" className="scroll-mt-28 mt-12 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{t("technologyCapabilitiesEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-serif font-bold text-slate-900">{t("technologyTitle")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 max-w-3xl">{t("technologyDesc")}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {technologyFeatureKeys.map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                {t(key)}
              </li>
            ))}
          </ul>
          <Link href={reviewHref} className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            {t("technologyCtaButton")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>

        <Reveal id="technology-implementation" className="scroll-mt-28 mt-12 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
          <ServiceSectionHeading eyebrow={t("technologyImplementationEyebrow")} title={t("technologyImplementationTitle")} description={t("technologyImplementationDescription")} />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {implementationKeys.map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                {t(key)}
              </li>
            ))}
          </ul>
          <Link href="/services/digital" className="mt-6 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
            {t("technologyImplementationLink")}
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>

        <Reveal className="mt-12 rounded-2xl border border-primary/25 bg-primary/[0.05] p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{t("technologyProofEyebrow")}</p>
              <h2 className="mt-2 text-2xl font-serif font-bold text-slate-950">{t("technologyProofTitle")}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">{t("technologyProofBody")}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {([1, 2, 3] as const).map((number) => (
                  <li key={number} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                    {t(`technologyProof${number}`)}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/tools/technology-decision-brief" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
              {t("technologyProofCta")}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <Reveal id="technology-partners" className="scroll-mt-28 mt-12 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{t("technologyPartnerEyebrow")}</p>
              <h2 className="mt-2 text-2xl font-serif font-bold text-slate-900">{t("technologyPartnerTitle")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{t("technologyPartnerBody")}</p>
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">{t("technologyCompensation")}</p>
              <Link href="/partners" className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline">
                {t("technologyPartnersLink")}
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div id="technology-evaluation" className="scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><ShieldCheck className="h-5 w-5 text-primary-dark" aria-hidden /></span>
                <h2 className="text-xl font-serif font-bold text-slate-900">{t("technologyEvaluationTitle")}</h2>
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

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200 grid lg:grid-cols-2 gap-6">
          <div className="rounded-lg border-2 border-primary/30 bg-primary/[0.04] p-6 lg:p-8">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">{t("fitTitle")}</h2>
            <ul className="space-y-3">
              {fitKeys.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm font-medium text-slate-800">
                  <CheckCircle className="w-4 h-4 text-primary-dark shrink-0 mt-0.5" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-300 bg-slate-100 p-6 lg:p-8 flex flex-col justify-center gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200"><Network className="h-5 w-5 text-primary-dark" aria-hidden /></span>
              <p className="text-slate-800 leading-relaxed text-sm font-medium">{t("technologyFitBusinessNote")}</p>
            </div>
            <Link href="/programs/business-enablement" className="inline-flex items-center text-primary-dark font-semibold text-sm hover:underline">
              {t("technologyCrossLinkBusiness")}
              <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden />
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
          ctaSubtext={t("technologyCallNext")}
          primaryCta={
            <ScheduleButton variant="secondary" size="lg" icon intent="consulting" focus="technology" className="bg-white text-slate-900 hover:bg-slate-100 border-0">
              {t("technologyCtaButton")}
            </ScheduleButton>
          }
          secondaryCta={
            <Link href="/tools/technology-decision-brief" className="inline-flex items-center justify-center text-sm font-medium text-slate-300 hover:text-white underline underline-offset-4 transition-colors">
              {t("technologySoftCta")}
            </Link>
          }
          confidentiality={{ href: "/contact", label: t("confidentialityLink"), title: t("ctaConfidentialTitle"), hint: t("ctaConfidentialHint") }}
          links={[
            { href: "/programs/business-enablement", label: t("technologyCrossLinkBusiness"), title: t("ctaPathBusinessTitle"), hint: t("ctaPathBusinessHint") },
            { href: "/programs/workshops", label: t("crossLinkWorkshops"), title: t("ctaPathWorkshopsTitle"), hint: t("ctaPathWorkshopsHint") },
            { href: "/services/digital", label: t("crossLinkDigital"), title: t("ctaPathDigitalTitle"), hint: t("ctaPathDigitalHint") },
            { href: "/services/portfolio", label: t("crossLinkOurWork"), title: t("ctaPathPortfolioTitle"), hint: t("ctaPathPortfolioHint") },
          ]}
        />
      </div>

      <StickyMobileCTA label={t("technologyCtaButton")} sublabel={tCommon("ctaSubtext")} intent="consulting" focus="technology" />
    </section>
  );
};

export default TechnologyAdvisory;
