"use client";

import React from "react";
import Reveal from "./motion/Reveal";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Award,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import ScheduleButton from "./ScheduleButton";
import StickyMobileCTA from "./StickyMobileCTA";
import ServiceMiniFAQ from "./services/ServiceMiniFAQ";
import type { ConsultingFocus } from "@/lib/consultation-request";
import { SERVICE_PAGE_FAQ_KEYS } from "@/lib/service-faq-jsonld";
import {
  ServicePageHero,
  ConsultingHeroVisual,
  ServiceAnchorNav,
  ServiceSectionHeading,
  ServicePageCTA,
  serviceCardClass,
  serviceCardIconMotionClass,
  servicePrimaryLinkClass,
} from "./services/ServicePageSections";

const serviceIcons = [Target, TrendingUp, Users, BarChart3] as const;
const serviceAnchors = [
  "strategy-roadmaps",
  "operations",
  "leadership",
  "readiness",
] as const;
const fitKeys = ["fit1", "fit2", "fit3"] as const;
const howWeWorkSteps = ["step1", "step2", "step3", "step4"] as const;

type ConsultingService = {
  title: string;
  desc: string;
  features: string[];
  ideal: string;
  outcome: string;
  notFor: string;
  icon: LucideIcon;
  focus: ConsultingFocus;
  anchor: string;
};

function ConsultingServiceCard({
  service,
  t,
}: {
  service: ConsultingService;
  t: ReturnType<typeof useTranslations<"services">>;
}) {
  return (
    <Reveal as="article" id={service.anchor} className="scroll-mt-28 h-full">
      <div className={serviceCardClass}>
        <div className="p-7 lg:p-8 flex flex-col flex-1">
          <div className="flex items-start gap-4 mb-5">
            <div
              className={`w-11 h-11 shrink-0 rounded-md border border-primary/20 bg-primary/10 flex items-center justify-center group-hover:border-primary/35 group-hover:bg-primary/15 transition-colors duration-300 ${serviceCardIconMotionClass}`}
            >
              <service.icon className="w-5 h-5 text-primary-dark" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {service.desc}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-800 border-l-4 border-primary bg-primary/[0.06] rounded-r-md pl-3 py-2 mb-5 leading-relaxed">
            {service.ideal}
          </p>

          <div className="space-y-3 mb-5 text-sm">
            <p className="text-slate-800 bg-slate-50 rounded-md border border-slate-200 px-3 py-2.5">
              <span className="block text-xs font-semibold uppercase tracking-wide text-primary-dark mb-1">
                {t("outcomeLabel")}
              </span>
              {service.outcome}
            </p>
            <p className="text-slate-700 px-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">
                {t("notForLabel")}
              </span>
              {service.notFor}
            </p>
          </div>

          <ul className="space-y-2 mb-6">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start text-sm text-slate-700"
              >
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary-dark" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-5 border-t border-slate-200">
            <Link
              href={{
                pathname: "/schedule",
                query: { intent: "consulting", focus: service.focus },
              }}
              className={servicePrimaryLinkClass}
            >
              {t("requestConsultation")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

const Services = () => {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");

  const services: ConsultingService[] = [
    {
      title: t("s0Title"),
      desc: t("s0Desc"),
      features: [t("s0F1"), t("s0F2"), t("s0F3")],
      ideal: t("s0Ideal"),
      outcome: t("s0Outcome"),
      notFor: t("s0NotFor"),
      icon: serviceIcons[0],
      focus: "strategy",
      anchor: serviceAnchors[0],
    },
    {
      title: t("s1Title"),
      desc: t("s1Desc"),
      features: [t("s1F1"), t("s1F2"), t("s1F3")],
      ideal: t("s1Ideal"),
      outcome: t("s1Outcome"),
      notFor: t("s1NotFor"),
      icon: serviceIcons[1],
      focus: "operations",
      anchor: serviceAnchors[1],
    },
    {
      title: t("s2Title"),
      desc: t("s2Desc"),
      features: [t("s2F1"), t("s2F2"), t("s2F3")],
      ideal: t("s2Ideal"),
      outcome: t("s2Outcome"),
      notFor: t("s2NotFor"),
      icon: serviceIcons[2],
      focus: "team",
      anchor: serviceAnchors[2],
    },
    {
      title: t("s3Title"),
      desc: t("s3Desc"),
      features: [t("s3F1"), t("s3F2"), t("s3F3")],
      ideal: t("s3Ideal"),
      outcome: t("s3Outcome"),
      notFor: t("s3NotFor"),
      icon: serviceIcons[3],
      focus: "data",
      anchor: serviceAnchors[3],
    },
  ];

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label"), icon: Award },
    { value: t("stat2Value"), label: t("stat2Label"), icon: Briefcase },
    { value: t("stat3Value"), label: t("stat3Label"), icon: Users },
  ];

  return (
    <section id="services" className="section-padding relative bg-slate-50/60">
      <ServicePageHero
        variant="consulting"
        eyebrow={t("heroEyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        subtitleHighlight={t("subtitleHighlight")}
        journeyLine={undefined}
        stats={stats}
        visual={
          <ConsultingHeroVisual
            proofTitle={t("heroProofTitle")}
            proofSubtitle={t("heroProofSubtitle")}
            outcomes={[t("heroOutcome1"), t("heroOutcome2"), t("heroOutcome3")]}
            caseLines={[t("heroCase1"), t("heroCase2")]}
          />
        }
        primaryCta={
          <ScheduleButton variant="primary" size="lg" icon>
            {t("ctaButton")}
          </ScheduleButton>
        }
        ctaSubtext={tCommon("ctaSubtext")}
        tertiaryLink={{ href: "/assessment", label: t("heroCtaAssessment") }}
      />

      <div className="max-w-6xl mx-auto">
        <ServiceAnchorNav
          label={t("jumpNavLabel")}
          items={services.map((s) => ({ id: s.anchor, label: s.title }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => (
            <ConsultingServiceCard
              key={service.anchor}
              service={service}
              t={t}
            />
          ))}
        </div>

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200">
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
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {t(stepKey)}
                  </p>
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
            <p className="text-slate-800 leading-relaxed text-sm font-medium">
              {t("fitDigitalNote")}
            </p>
            <Link
              href="/services/digital"
              className="inline-flex items-center text-primary-dark font-semibold text-sm hover:underline"
            >
              {t("compareBuildingLink")}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
            <p className="text-sm text-slate-700 border-t border-slate-200 pt-4">
              {t("fitAssessmentTeaser")}{" "}
              <Link href="/assessment" className="link-action font-medium">
                {t("heroCtaAssessment")}
              </Link>
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t-2 border-slate-200">
          <ServiceSectionHeading title={t("faqTitle")} />
          <ServiceMiniFAQ namespace="services" keys={SERVICE_PAGE_FAQ_KEYS} />
        </Reveal>

        <ServicePageCTA
          badge={t("ctaBadge")}
          title={t("ctaTitle")}
          subtitle={t("ctaSubtitle")}
          qualifier={t("ctaQualifier")}
          ctaSubtext={tCommon("ctaSubtext")}
          primaryCta={
            <ScheduleButton
              variant="secondary"
              size="lg"
              icon
              className="bg-white text-slate-900 hover:bg-slate-100 border-0"
            >
              {t("ctaButton")}
            </ScheduleButton>
          }
          secondaryCta={
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center text-sm font-medium text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
            >
              {t("ctaAssessment")}
            </Link>
          }
          confidentiality={{
            href: "/contact",
            label: t("confidentialityLink"),
          }}
          links={[
            { href: "/programs/workshops", label: t("crossLinkWorkshops") },
            {
              href: "/services/digital-events",
              label: t("crossLinkDigitalEvents"),
            },
            { href: "/services/digital", label: t("crossLinkDigital") },
            { href: "/services/portfolio", label: t("crossLinkOurWork") },
          ]}
        />
      </div>
      <StickyMobileCTA
        label={t("ctaButton")}
        sublabel={tCommon("ctaSubtext")}
      />
    </section>
  );
};

export default Services;
