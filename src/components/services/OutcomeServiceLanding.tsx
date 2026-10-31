import React from "react";
import Image from "next/image";
import { ArrowRight, BarChart3, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ServiceLandingCopy } from "@/lib/service-landing-types";

export type OutcomeServiceId =
  | "automation"
  | "digital-products"
  | "security"
  | "managed-optimization";

type EvidenceHref =
  | "/automation-opportunity-review"
  | "/digital-product-discovery"
  | "/website-estimate"
  | "/security-risk-coverage-review"
  | "/digital-asset-health-review";

type NeedGroupId =
  | "growth-visibility"
  | "experience-products"
  | "automation-ai"
  | "security-compliance"
  | "execution";

type L10n = { en: string; fr: string };

const needGroupLabels: Record<NeedGroupId, L10n> = {
  "growth-visibility": { en: "Be easier to find", fr: "Être plus facile à trouver" },
  "experience-products": {
    en: "Improve an experience or launch something new",
    fr: "Améliorer une expérience ou lancer du nouveau",
  },
  "automation-ai": { en: "Automate valuable work", fr: "Automatiser le travail à valeur" },
  "security-compliance": {
    en: "Reduce risk and support compliance",
    fr: "Réduire les risques et soutenir la conformité",
  },
  execution: { en: "Turn priorities into execution", fr: "Transformer les priorités en exécution" },
};

type ServiceEngagement = {
  eyebrow: L10n;
  title: L10n;
  body: L10n;
  primary: { href: EvidenceHref; label: L10n };
  secondary?:
    | { kind: "evidence"; href: EvidenceHref; label: L10n }
    | { kind: "need"; groupId: NeedGroupId; label: L10n };
  situations: readonly NeedGroupId[];
};

const serviceEngagement: Record<OutcomeServiceId, ServiceEngagement> = {
  automation: {
    eyebrow: { en: "Evidence first", fr: "Les preuves d’abord" },
    title: {
      en: "Find the automation worth building before you build it",
      fr: "Trouvez l’automatisation qui mérite d’être construite avant de la bâtir",
    },
    body: {
      en: "A short review of the work, exceptions, systems, and ownership around one process shows where automation pays off—and where it does not.",
      fr: "Une courte revue du travail, des exceptions, des systèmes et des responsabilités d’un processus montre où l’automatisation rapporte, et où elle ne rapporte pas.",
    },
    primary: {
      href: "/automation-opportunity-review",
      label: { en: "Start the Automation Opportunity Review", fr: "Lancer la revue des occasions d’automatisation" },
    },
    situations: ["automation-ai", "execution"],
  },
  "digital-products": {
    eyebrow: { en: "Evidence first", fr: "Les preuves d’abord" },
    title: {
      en: "Define the smallest useful product before committing to a build",
      fr: "Définissez le plus petit produit utile avant de vous engager dans une construction",
    },
    body: {
      en: "Discovery connects one audience, one valuable journey, and one measurable outcome. If a website is the right first step, a launch estimate gives you scope and investment ranges.",
      fr: "La découverte relie un public, un parcours utile et un résultat mesurable. Si un site Web est la bonne première étape, une estimation de lancement précise la portée et l’investissement.",
    },
    primary: {
      href: "/digital-product-discovery",
      label: { en: "Start Digital Product Discovery", fr: "Lancer la découverte de produit numérique" },
    },
    secondary: {
      kind: "evidence",
      href: "/website-estimate",
      label: { en: "Estimate a website launch", fr: "Estimer un lancement de site Web" },
    },
    situations: ["experience-products", "growth-visibility"],
  },
  security: {
    eyebrow: { en: "Evidence first", fr: "Les preuves d’abord" },
    title: {
      en: "See where security coverage is thin before deciding what to fix",
      fr: "Voyez où la couverture de sécurité est faible avant de décider quoi corriger",
    },
    body: {
      en: "A coverage review turns scattered concerns into a prioritized view of risk, control ownership, and the next practical step. Independent SOC 2 examinations remain with a qualified CPA firm.",
      fr: "Une revue de couverture transforme des préoccupations dispersées en une vue priorisée des risques, des responsabilités de contrôle et de la prochaine étape pratique. Les examens SOC 2 indépendants demeurent confiés à un cabinet de CPA qualifié.",
    },
    primary: {
      href: "/security-risk-coverage-review",
      label: { en: "Start the Security Risk Coverage Review", fr: "Lancer la revue de couverture des risques de sécurité" },
    },
    secondary: {
      kind: "need",
      groupId: "security-compliance",
      label: { en: "Explore security and compliance situations", fr: "Explorer les situations de sécurité et de conformité" },
    },
    situations: ["security-compliance", "execution"],
  },
  "managed-optimization": {
    eyebrow: { en: "Evidence first", fr: "Les preuves d’abord" },
    title: {
      en: "Know what to improve before maintenance becomes a task list",
      fr: "Sachez quoi améliorer avant que l’entretien devienne une liste de tâches",
    },
    body: {
      en: "A health review sets a practical baseline for a live site or application, then separates urgent risk, valuable improvement, and routine care.",
      fr: "Une revue de santé établit une référence pratique pour un site ou une application en ligne, puis sépare le risque urgent, l’amélioration utile et l’entretien courant.",
    },
    primary: {
      href: "/digital-asset-health-review",
      label: { en: "Start the Digital Asset Health Review", fr: "Lancer la revue de santé des actifs numériques" },
    },
    situations: ["execution", "growth-visibility"],
  },
};

const serviceHrefs: Record<OutcomeServiceId, string> = {
  automation: "/services/automation",
  "digital-products": "/services/digital-products",
  security: "/services/security-risk-compliance",
  "managed-optimization": "/services/managed-optimization",
};

export default function OutcomeServiceLanding({
  locale,
  content,
  heroImage,
  service,
}: {
  locale: string;
  content: ServiceLandingCopy;
  heroImage?: string;
  service?: OutcomeServiceId;
}) {
  const lang: "en" | "fr" = locale === "fr" ? "fr" : "en";
  const engagement = service ? serviceEngagement[service] : undefined;
  const journey = [
    {
      label: lang === "fr" ? "Conseiller" : "Advise",
      href: "/services/technology-advisory" as const,
    },
    {
      label: lang === "fr" ? "Construire" : "Build",
      href: "/services/digital-products" as const,
    },
    {
      label: lang === "fr" ? "Automatiser" : "Automate",
      href: "/services/automation" as const,
    },
    {
      label: lang === "fr" ? "Agentique" : "Agentic",
      href: "/services/ai-agents" as const,
    },
    {
      label: lang === "fr" ? "Sécuriser" : "Secure",
      href: "/services/security-risk-compliance" as const,
    },
    {
      label: lang === "fr" ? "Évoluer" : "Evolve",
      href: "/services/managed-optimization" as const,
    },
  ];
  const currentJourneyHref = service ? serviceHrefs[service] : undefined;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-7 py-12 lg:px-12 lg:py-16 text-white">
        {heroImage ? (
          <>
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="pointer-events-none object-cover object-[72%_center] opacity-70"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/50" aria-hidden />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/65" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[55%] bg-gradient-to-l from-slate-950/45 via-slate-950/15 to-transparent" aria-hidden />
          </>
        ) : null}
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary-light">
            {content.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-serif font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
            {content.title}
          </h1>
          <p className="mt-5 text-lg text-slate-200 leading-relaxed">
            {content.description}
          </p>
          <p className="mt-4 rounded-r-md border-l-2 border-primary-light bg-slate-950/55 py-2 pl-4 pr-3 text-sm font-medium text-primary-light backdrop-blur-sm">
            {content.outcome}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-black/30 hover:bg-primary-dark transition-colors"
          >
            {content.cta}
            <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto">
        <nav
          aria-label={
            locale === "fr"
              ? "Parcours de services ROALLA"
              : "ROALLA service journey"
          }
          className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <ol className="flex flex-wrap items-center justify-center gap-2">
            {journey.map((stage, index) => (
              <li key={stage.label} className="flex items-center gap-2">
                {index > 0 ? (
                  <span className="text-slate-300" aria-hidden>
                    →
                  </span>
                ) : null}
                <Link
                  href={stage.href}
                  aria-current={stage.href === currentJourneyHref ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold hover:bg-primary/10 hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    stage.href === currentJourneyHref ? "bg-primary/10 text-primary-dark" : "text-slate-700"
                  }`}
                >
                  {stage.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        {engagement ? (
          <section
            aria-labelledby="service-evidence-title"
            data-testid="service-evidence-band"
            className="mt-8 rounded-2xl bg-slate-950 p-7 text-white sm:p-9"
          >
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-light">
              {engagement.eyebrow[lang]}
            </p>
            <h2 id="service-evidence-title" className="mt-2 max-w-3xl text-2xl font-serif font-bold text-white sm:text-3xl">
              {engagement.title[lang]}
            </h2>
            <p className="mt-3 max-w-3xl text-slate-300">{engagement.body[lang]}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={engagement.primary.href}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {engagement.primary.label[lang]}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              {engagement.secondary?.kind === "evidence" ? (
                <Link
                  href={engagement.secondary.href}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {engagement.secondary.label[lang]}
                </Link>
              ) : null}
              {engagement.secondary?.kind === "need" ? (
                <Link
                  href={{
                    pathname: "/solutions/need/[groupId]",
                    params: { groupId: engagement.secondary.groupId },
                  }}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {engagement.secondary.label[lang]}
                </Link>
              ) : null}
            </div>
            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">
                {lang === "fr" ? "Partir d’une situation" : "Start from a situation"}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {engagement.situations.map((groupId) => (
                  <li key={groupId}>
                    <Link
                      href={{ pathname: "/solutions/need/[groupId]", params: { groupId } }}
                      className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-primary-light hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {needGroupLabels[groupId][lang]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
        <section className="py-16 grid md:grid-cols-2 gap-5">
          {content.capabilities.map(([title, body]) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-serif font-bold text-slate-900">
                {title}
              </h2>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                {body}
              </p>
            </article>
          ))}
        </section>
        <section className="border-t border-slate-200 pt-14">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.process.map(([title, body], index) => (
              <li
                key={title}
                className="rounded-xl bg-slate-50 border border-slate-200 p-5"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden />
                  <span className="text-xs font-bold text-slate-500">
                    {index + 1}
                  </span>
                </div>
                <h2 className="mt-3 font-serif font-bold text-slate-900">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-16 grid gap-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-950">
              {content.deliverablesTitle}
            </h2>
            <ul className="mt-6 space-y-3">
              {content.deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary-dark" aria-hidden />
              <h2 className="text-2xl font-serif font-bold text-slate-950">
                {content.measuresTitle}
              </h2>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {content.measures.map((item) => (
                <li key={item} className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-700">
            {content.starter.eyebrow}
          </p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-950">{content.starter.name}</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">{content.starter.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5">
                  <Clock3 className="h-4 w-4 text-primary" aria-hidden />{content.starter.timeline}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{content.starter.investment}</p>
              <p className="mt-4 text-sm font-medium text-slate-800">{content.starter.fit}</p>
              <p className="mt-2 flex gap-2 text-xs leading-5 text-slate-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{content.starter.exclusion}
              </p>
            </div>
            <div>
              <ul className="space-y-2">
                {content.starter.includes.map((item) => (
                  <li key={item} className="flex gap-2 rounded-lg bg-white/80 p-3 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}
                  </li>
                ))}
              </ul>
              <Link href={{ pathname: "/contact", query: { goal: content.starter.name } }} className="mt-5 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
                {content.starter.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-serif font-bold text-slate-950">{content.packagesTitle}</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {content.packages.map((item) => (
              <article key={item.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">{item.cadence}</p>
                <h3 className="mt-2 text-xl font-serif font-bold text-slate-950">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-2xl bg-slate-950 p-7 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-light">{content.proof.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-white">{content.proof.title}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{content.proof.description}</p>
            <p className="mt-3 text-xs text-slate-400">{content.proof.typeLabel}</p>
          </div>
          <a href={`/${locale}${content.proof.href}`} className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-100">
            {content.proof.label}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </a>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-serif font-bold text-slate-950">{content.faqTitle}</h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {content.faqs.map(([question, answer]) => (
              <details key={question} className="py-4">
                <summary className="cursor-pointer font-semibold text-slate-950">{question}</summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
          <h2 className="text-3xl font-serif font-bold text-slate-950">{content.finalTitle}</h2>
          <p className="mt-3 max-w-3xl text-slate-700">{content.finalBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={{ pathname: "/contact", query: { goal: content.finalTitle } }} className="inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
              {content.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            {(content.resources ?? [
              { label: locale === "fr" ? "Créer mon plan de valeur" : "Build my value plan", href: "/tools/digital-value-blueprint" },
              { label: locale === "fr" ? "Utiliser les calculateurs" : "Use the value calculators", href: "/tools/business-value-calculators" },
            ]).map((resource, index) => (
              <a
                key={resource.href}
                href={`/${locale}${resource.href}`}
                className={index === 0
                  ? "inline-flex min-h-[48px] items-center rounded-lg border border-primary/30 bg-white px-6 py-3 font-semibold text-primary-dark hover:border-primary"
                  : "inline-flex min-h-[48px] items-center rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 underline underline-offset-4"}
              >
                {resource.label}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
