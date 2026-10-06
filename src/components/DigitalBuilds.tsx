"use client";

import React from "react";
import Image from "next/image";
import Reveal from "./motion/Reveal";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Globe,
  Layers,
  Workflow,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Rocket,
  Package,
  Users,
} from "lucide-react";
import ScheduleButton from "./ScheduleButton";
import StickyMobileCTA from "./StickyMobileCTA";
import TechnologyDecisionFramework from "./TechnologyDecisionFramework";
import ServiceMiniFAQ from "./services/ServiceMiniFAQ";
import ServiceTestimonialBand from "./services/ServiceTestimonialBand";
import BrowserFrame from "./digital/BrowserFrame";
import { SERVICE_PAGE_FAQ_KEYS } from "@/lib/service-faq-jsonld";
import {
  getOrderedPortfolioItems,
  getPortfolioItem,
  buildPortfolioScheduleQuery,
  digitalBuildScheduleNeed,
  portfolioImageAlts,
  type PortfolioItemConfig,
  type PortfolioItemId,
} from "@/lib/digitalPortfolio";
import {
  ServicePageHero,
  ConsultingHeroVisual,
  ServiceAnchorNav,
  ServiceSectionHeading,
  ServicePageCTA,
  serviceCardClass,
  serviceHeroSecondaryButtonClass,
  servicePrimaryLinkClass,
} from "./services/ServicePageSections";
import { trackAnalyticsEvent } from "@/lib/analytics";

const buildIcons = [Globe, Layers, Workflow, Sparkles] as const;
const buildAnchors = [
  "websites",
  "platforms",
  "automation",
  "ai-support",
] as const;

const digitalBuildIntent = {
  websites: "website",
  platforms: "platform",
  automation: "automation",
  "ai-support": "ai-support",
} as const satisfies Record<
  (typeof buildAnchors)[number],
  "website" | "platform" | "automation" | "ai-support"
>;

const fitKeys = ["fit1", "fit2", "fit3"] as const;

function portfolioItemName(
  tPortfolio: ReturnType<typeof useTranslations<"digitalCreations">>,
  item: PortfolioItemConfig,
) {
  const map = {
    t1: "t1Name",
    t5: "t5Name",
    t6: "t6Name",
    t7: "t7Name",
    t8: "t8Name",
    t9: "t9Name",
    t10: "t10Name",
    t11: "t11Name",
    t12: "t12Name",
    t13: "t13Name",
    t14: "t14Name",
    t15: "t15Name",
    t16: "t16Name",
    t17: "t17Name",
    t18: "t18Name",
    t19: "t19Name",
  } as const;
  return tPortfolio(map[item.i18nPrefix]);
}

type DigitalBuild = {
  title: string;
  desc: string;
  features: string[];
  icon: (typeof buildIcons)[number];
  requestCta: string;
  proofText: string;
  proofHash: PortfolioItemId;
  proofReference: PortfolioItemId;
  timeline: string;
  anchor: (typeof buildAnchors)[number];
};

function DigitalBuildCard({
  build,
  t,
  locale,
}: {
  build: DigitalBuild;
  t: ReturnType<typeof useTranslations<"digitalBuilds">>;
  locale: string;
}) {
  const french = locale === "fr";
  const starter = {
    websites: french ? "Forfait de lancement de site à partir de 999 $ CA" : "Launch website package from $999 CAD",
    platforms: french ? "Sprint de validation de produit, habituellement 1 à 2 semaines" : "Product validation sprint, usually 1 to 2 weeks",
    automation: french ? "Sprint d’occasion d’automatisation, habituellement 1 à 2 semaines" : "Automation opportunity sprint, usually 1 to 2 weeks",
    "ai-support": french ? "Pilote d’IA pratique avec révision humaine et mesures convenues" : "Practical AI pilot with human review and agreed measures",
  }[build.anchor];
  return (
    <Reveal
      as="article"
      id={build.anchor}
      className={`${serviceCardClass} scroll-mt-28`}
    >
      <div className="p-6 lg:p-7 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-11 h-11 shrink-0 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center">
            <build.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              {build.title}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              {build.timeline}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          {build.desc}
        </p>

        <ul className="space-y-2 mb-6">
          {build.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start text-sm text-slate-600"
            >
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mb-5 rounded-lg border border-brand-gold/40 bg-brand-gold/10 p-3 text-sm text-slate-700">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-600">
            {french ? "Point de départ recommandé" : "Recommended starting offer"}
          </span>
          <span className="mt-1 block font-semibold text-slate-900">{starter}</span>
        </div>

        <div className="mt-auto pt-5 border-t border-slate-100 space-y-3">
          <Link
            href={{
              pathname: "/contact",
              query: buildPortfolioScheduleQuery(
                getPortfolioItem(build.proofReference)!,
                undefined,
                digitalBuildScheduleNeed[build.anchor],
                digitalBuildIntent[build.anchor],
              ),
            }}
            className={servicePrimaryLinkClass}
          >
            {build.requestCta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <a
            href={`/${locale}/services/portfolio#${build.proofHash}`}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary hover:underline"
          >
            {build.proofText}
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

const DigitalBuilds = () => {
  const t = useTranslations("digitalBuilds");
  const tPortfolio = useTranslations("digitalCreations");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label"), icon: Package },
    { value: t("stat2Value"), label: t("stat2Label"), icon: Rocket },
    { value: t("stat3Value"), label: t("stat3Label"), icon: Users },
  ];

  const builds: DigitalBuild[] = [
    {
      title: t("s0Title"),
      desc: t("s0Desc"),
      features: [t("s0F1"), t("s0F2"), t("s0F3")],
      icon: buildIcons[0],
      requestCta: t("s0RequestCta"),
      proofText: t("s0Proof"),
      proofHash: "kaylan-kaptures",
      proofReference: "kaylan-kaptures",
      timeline: t("websiteTimeline"),
      anchor: buildAnchors[0],
    },
    {
      title: t("s1Title"),
      desc: t("s1Desc"),
      features: [t("s1F1"), t("s1F2"), t("s1F3")],
      icon: buildIcons[1],
      requestCta: t("s1RequestCta"),
      proofText: t("s1Proof"),
      proofHash: "my360vision",
      proofReference: "my360vision",
      timeline: t("platformTimeline"),
      anchor: buildAnchors[1],
    },
    {
      title: t("s2Title"),
      desc: t("s2Desc"),
      features: [t("s2F1"), t("s2F2"), t("s2F3")],
      icon: buildIcons[2],
      requestCta: t("s2RequestCta"),
      proofText: t("s2Proof"),
      proofHash: "boothlio",
      proofReference: "boothlio",
      timeline: t("automationTimeline"),
      anchor: buildAnchors[2],
    },
    {
      title: t("s3Title"),
      desc: t("s3Desc"),
      features: [t("s3F1"), t("s3F2"), t("s3F3")],
      icon: buildIcons[3],
      requestCta: t("s3RequestCta"),
      proofText: t("s3Proof"),
      proofHash: "pitch-hotshots",
      proofReference: "pitch-hotshots",
      timeline: t("aiTimeline"),
      anchor: buildAnchors[3],
    },
  ];

  const lifecycle = [
    {
      key: "advise",
      href: "/programs/technology-advisory" as const,
      title: locale === "fr" ? "Conseiller" : "Advise",
      description: locale === "fr" ? "Clarifier le résultat et les exigences." : "Clarify the outcome and requirements.",
    },
    {
      key: "source",
      href: "/programs/technology-advisory" as const,
      title: locale === "fr" ? "Rechercher" : "Source",
      description: locale === "fr" ? "Comparer les plateformes et fournisseurs." : "Compare platforms and providers.",
    },
    {
      key: "agentic",
      href: "/services/agentic" as const,
      title: locale === "fr" ? "Agentique" : "Agentic",
      description: locale === "fr" ? "Concevoir des agents qui agissent sous contrôle." : "Design agents that act under control.",
    },
    {
      key: "build-connect",
      href: "/services/digital-products" as const,
      title: locale === "fr" ? "Construire / Relier" : "Build / Connect",
      description: locale === "fr" ? "Mettre en œuvre produits et intégrations." : "Implement products and integrations.",
    },
    {
      key: "improve",
      href: "/services/managed-optimization" as const,
      title: locale === "fr" ? "Améliorer" : "Improve",
      description: locale === "fr" ? "Mesurer, gouverner et faire évoluer." : "Measure, govern, and evolve.",
    },
  ];

  const digitalOutcomes = [
    {
      image: "/images/services/digital-outcome-launch.webp",
      alt: t("outcomesLaunchAlt"),
      kicker: t("outcomesLaunchKicker"),
      title: t("outcomesLaunchTitle"),
      description: t("outcomesLaunchDescription"),
      link: t("outcomesLaunchLink"),
      href: "#websites",
    },
    {
      image: "/images/services/digital-outcome-operations.webp",
      alt: t("outcomesOperationsAlt"),
      kicker: t("outcomesOperationsKicker"),
      title: t("outcomesOperationsTitle"),
      description: t("outcomesOperationsDescription"),
      link: t("outcomesOperationsLink"),
      href: "#automation",
    },
    {
      image: "/images/services/digital-outcome-growth.webp",
      alt: t("outcomesGrowthAlt"),
      kicker: t("outcomesGrowthKicker"),
      title: t("outcomesGrowthTitle"),
      description: t("outcomesGrowthDescription"),
      link: t("outcomesGrowthLink"),
      href: "#platforms",
    },
  ] as const;

  return (
    <section id="digital-builds" className="section-padding relative">
      <ServicePageHero
        variant="digital"
        eyebrow={t("heroEyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        subtitleHighlight={t("subtitleHighlight")}
        stats={stats}
        visual={
          <ConsultingHeroVisual
            icon={Layers}
            proofTitle={t("heroProofTitle")}
            proofSubtitle={t("heroProofSubtitle")}
            outcomes={[t("heroOutcome1"), t("heroOutcome2"), t("heroOutcome3")]}
          />
        }
        primaryCta={
          <ScheduleButton variant="primary" size="lg" icon intent="website">
            {tCommon("scheduleConsultation")}
          </ScheduleButton>
        }
        secondaryCta={
          <Link
            href="/services/portfolio"
            className={serviceHeroSecondaryButtonClass}
          >
            {t("heroCtaPortfolio")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        }
        ctaSubtext={tCommon("ctaSubtext")}
      />

      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">{t("advisoryBridgeEyebrow")}</p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-slate-900">{t("advisoryBridgeTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{t("advisoryBridgeDescription")}</p>
          </div>
          <Link href="/programs/technology-advisory" className="mt-5 inline-flex shrink-0 items-center text-sm font-semibold text-primary-dark hover:underline lg:mt-0">
            {t("advisoryBridgeLink")}
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>

        <Reveal className="mb-8 rounded-2xl border border-primary/25 bg-slate-950 p-6 text-white lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">ROALLA Agentic</p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-white">{locale === "fr" ? "Entre le choix technologique et la mise en œuvre" : "The bridge between technology decisions and implementation"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{locale === "fr" ? "Concevez des agents IA qui comprennent le contexte, coordonnent vos outils et agissent dans des limites approuvées—avec les bonnes personnes aux points de décision." : "Design AI agents that understand context, coordinate your tools, and act within approved boundaries—with the right people at the decision points."}</p>
          </div>
          <Link href="/services/agentic" className="mt-5 inline-flex shrink-0 items-center text-sm font-semibold text-cyan-300 hover:text-white hover:underline lg:mt-0">
            {locale === "fr" ? "Explorer ROALLA Agentic" : "Explore ROALLA Agentic"}<ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Link>
        </Reveal>

        <TechnologyDecisionFramework className="mb-12" />

        <Reveal
          id="digital-outcomes"
          className="mb-12 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-950/10"
        >
          <div className="relative px-6 py-9 sm:px-8 lg:px-10 lg:py-12">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cyan-300 to-brand-gold"
              aria-hidden
            />
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  {t("outcomesEyebrow")}
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-serif font-bold leading-tight text-white sm:text-4xl">
                  {t("outcomesTitle")}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-slate-300 lg:justify-self-end">
                {t("outcomesDescription")}
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {digitalOutcomes.map((outcome, index) => (
                <article
                  key={outcome.href}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white text-slate-950 shadow-lg"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-slate-200">
                    <Image
                      src={outcome.image}
                      alt={outcome.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                    <span className="absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-slate-950/80 text-xs font-bold text-white backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">
                      {outcome.kicker}
                    </p>
                    <h3 className="mt-2 text-xl font-serif font-bold leading-snug text-slate-950">
                      {outcome.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {outcome.description}
                    </p>
                    <a
                      href={outcome.href}
                      className="mt-5 inline-flex items-center text-sm font-bold text-primary-dark hover:underline"
                    >
                      {outcome.link}
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-5 rounded-2xl border border-white/10 bg-white/[0.07] p-6 md:grid-cols-[1fr_auto] md:items-center lg:p-7">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">
                  {t("outcomesInsightTitle")}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  {t("outcomesInsightDescription")}
                </p>
              </div>
              <ScheduleButton variant="primary" size="lg" icon intent="website">
                {t("outcomesCta")}
              </ScheduleButton>
            </div>
          </div>
        </Reveal>

        <Reveal className="mb-12 rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark">
            {t("lifecycleEyebrow")}
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-serif font-bold text-slate-900">
            {t("lifecycleTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-slate-700">
            {t("lifecycleDescription")}
          </p>
          <ol className="mt-7 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {lifecycle.map((stage, index) => (
              <li key={stage.key}>
                <Link
                  href={stage.href}
                  onClick={() =>
                    trackAnalyticsEvent("service_framework_click", {
                      stage: stage.key,
                    })
                  }
                  className="group block h-full rounded-xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
                >
                  <span className="text-xs font-bold text-primary-dark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-serif font-bold text-slate-900 group-hover:text-primary-dark">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    {stage.description}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mb-12">
          <ServiceSectionHeading
            eyebrow={locale === "fr" ? "Outils gratuits" : "Free decision tools"}
            title={locale === "fr" ? "Commencez avec des preuves, pas une proposition générique." : "Start with evidence, not a generic proposal."}
            description={locale === "fr" ? "Vérifiez votre présence, trouvez le service approprié, estimez la valeur possible et voyez comment le suivi fonctionne." : "Check your presence, find the right service, estimate potential value, and see how ongoing monitoring works."}
            className="mb-6"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, path: "/tools/digital-presence-snapshot", title: locale === "fr" ? "Vérifier ma présence" : "Check my presence", body: locale === "fr" ? "Site, recherche et partage social." : "Website, search, and social setup." },
              { icon: Sparkles, path: "/tools/digital-value-blueprint", title: locale === "fr" ? "Créer mon plan" : "Build my blueprint", body: locale === "fr" ? "Point de départ et direction sur 90 jours." : "Recommended start and 90-day direction." },
              { icon: Workflow, path: "/tools/business-value-calculators", title: locale === "fr" ? "Estimer la valeur" : "Estimate value", body: locale === "fr" ? "Scénarios de site, d’automatisation et d’événement." : "Website, automation, and event scenarios." },
              { icon: Rocket, path: "/tools/digital-monitoring-dashboard", title: locale === "fr" ? "Voir le suivi" : "Preview monitoring", body: locale === "fr" ? "Références privées dans votre navigateur." : "Private baselines in your browser." },
            ].map((tool) => (
              <a key={tool.path} href={`/${locale}${tool.path}`} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary hover:shadow-md">
                <tool.icon className="h-5 w-5 text-primary" aria-hidden />
                <h3 className="mt-3 font-serif font-bold text-slate-950 group-hover:text-primary-dark">{tool.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">{tool.body}</p>
                <span className="mt-3 inline-flex items-center text-xs font-bold text-primary-dark">{locale === "fr" ? "Ouvrir l’outil" : "Open tool"}<ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden /></span>
              </a>
            ))}
          </div>
        </Reveal>

        <ServiceAnchorNav
          label={t("jumpNavLabel")}
          items={builds.map((b) => ({ id: b.anchor, label: b.title }))}
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {builds.map((build) => (
            <DigitalBuildCard
              key={build.anchor}
              build={build}
              t={t}
              locale={locale}
            />
          ))}
        </div>

        <Reveal className="mt-10 rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-center">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {t("heroJourneyLine")}
          </p>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary/[0.04] p-6 lg:p-8">
            <ServiceSectionHeading
              eyebrow={t("proofEyebrow")}
              title={t("proofTitle")}
              description={t("proofTeaserDesc")}
              className="mb-6"
            />
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-6">
              {getOrderedPortfolioItems()
                .slice(0, 2)
                .map((item, index) => {
                  const scheduleQuery = buildPortfolioScheduleQuery(item);
                  return (
                    <div key={item.id} className="group">
                      <a
                        href={`/${locale}/services/portfolio#${item.id}`}
                        className="block"
                      >
                        <BrowserFrame
                          imageUrl={item.imageUrl}
                          imageAlt={portfolioImageAlts[item.id]}
                          domain={item.domain}
                          priority={index === 0}
                          className="group-hover:shadow-card-hover transition-shadow duration-300"
                        />
                        <p className="mt-2 text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                          {portfolioItemName(tPortfolio, item)}
                        </p>
                      </a>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        <a
                          href={`/${locale}/services/portfolio#${item.id}`}
                          className="text-xs font-semibold text-primary-dark hover:underline"
                        >
                          {t("proofSeeCaseStudy")}
                        </a>
                        <Link
                          href={{ pathname: "/contact", query: scheduleQuery }}
                          className="text-xs font-semibold text-slate-600 hover:text-primary hover:underline"
                        >
                          {t("proofRequestBuild")}
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
            <Link
              href="/services/portfolio"
              className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              {t("proofViewPortfolio")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200 grid lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 lg:p-8">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">
              {t("fitTitle")}
            </h2>
            <ul className="space-y-3">
              {fitKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 lg:p-8 flex flex-col justify-center">
            <p className="text-slate-700 leading-relaxed mb-4 text-sm">
              {t("fitConsultingNote")}
            </p>
            <Link
              href="/programs/technology-advisory"
              className="inline-flex items-center text-primary font-medium text-sm hover:underline"
            >
              {t("compareConsultingLink")}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-16 pt-12 border-t border-slate-200">
          <ServiceSectionHeading title={t("faqTitle")} />
          <ServiceMiniFAQ
            namespace="digitalBuilds"
            keys={SERVICE_PAGE_FAQ_KEYS}
          />
        </Reveal>

        <ServiceTestimonialBand />

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
              intent="website"
            >
              {tCommon("scheduleConsultation")}
            </ScheduleButton>
          }
          secondaryCta={
            <Link
              href="/services/portfolio"
              className="inline-flex items-center justify-center rounded-md border border-slate-600 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              {t("heroCtaPortfolio")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          }
          links={[
            {
              href: "/programs/technology-advisory",
              label: t("advisoryBridgeLink"),
            },
            { href: "/programs/workshops", label: t("crossLinkWorkshops") },
          ]}
        />
      </div>
      <StickyMobileCTA
        label={tCommon("scheduleConsultation")}
        intent="website"
        sublabel={tCommon("ctaSubtext")}
      />
    </section>
  );
};

export default DigitalBuilds;
