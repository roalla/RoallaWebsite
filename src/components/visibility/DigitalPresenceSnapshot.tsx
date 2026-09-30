"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Gauge,
  LoaderCircle,
  SearchCheck,
  Share2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { buildDigitalPresenceActions } from "@/lib/digital-presence/actions";
import type { SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";
import type {
  ScoreName,
  WebsiteVisibilitySnapshot,
} from "@/lib/website-visibility/pagespeed";

type TechnicalReport = {
  snapshot?: WebsiteVisibilitySnapshot;
  cached?: boolean;
  error?: string;
};

type TechnicalResponse = {
  mobile?: TechnicalReport;
  desktop?: TechnicalReport;
  error?: string;
};

const scoreOrder: ScoreName[] = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
];

const copy = {
  en: {
    urlLabel: "Public website page",
    placeholder: "https://example.com",
    submit: "Run digital presence snapshot",
    starting: "Starting both checks…",
    both: "Checking technical visibility and social setup…",
    technicalOnly: "Social setup is ready. Finishing mobile and desktop checks…",
    socialOnly: "Technical results are ready. Finishing social setup checks…",
    resultsTitle: "Your digital presence snapshot",
    resultsIntro: "Two different lenses, one practical starting point. The scores remain separate because they measure different things.",
    technicalTitle: "Website visibility",
    technicalDescription: "Automated mobile and desktop technical signals",
    socialTitle: "Social presence setup",
    socialDescription: "Website-side profile discovery, sharing, and identity",
    mobile: "Mobile",
    desktop: "Desktop",
    scoreLabels: {
      performance: "Performance",
      accessibility: "Accessibility",
      bestPractices: "Best practices",
      seo: "Technical SEO",
    },
    detailedTechnical: "Open detailed technical results",
    detailedSocial: "Open detailed social results",
    actionsTitle: "Three most useful next actions",
    actionsIntro: "Prioritized by the size of the automated gap. Business context can change the order.",
    fixNow: "Fix now",
    planNext: "Plan next",
    automatedStrong: "The automated checks are strong. The highest-value next step is human review of strategy and conversion.",
    humanTitle: "Needs human review",
    human: [
      "Whether the offer and content match customer intent",
      "Which social channels deserve investment—and which do not",
      "Trust, proof, brand voice, publishing quality, and conversion",
    ],
    methodology: "How the snapshot works",
    methodologyBody:
      "Website visibility uses Google PageSpeed Insights for mobile and desktop. Social presence evaluates the submitted public page for profile links, sharing metadata, structured identity, and canonical page signals. ROALLA does not combine these into one score or claim to measure strategy automatically.",
    print: "Print or save report",
    ctaTitle: "Turn these signals into a focused improvement plan.",
    ctaBody: "ROALLA can validate the automated findings against your audience, offer, competitive context, content, and path to an inquiry.",
    cta: "Ask ROALLA to prioritize the work",
    partialTitle: "One part of the snapshot could not be completed",
    technicalError: "Technical visibility could not be measured.",
    socialError: "Social setup could not be measured.",
    actionTechnical: {
      performance: "Improve page speed and interaction readiness",
      accessibility: "Address automated accessibility barriers",
      bestPractices: "Correct browser and implementation best-practice gaps",
      seo: "Strengthen the page’s technical SEO foundation",
    },
    actionSocial: {
      profileLinks: "Make priority social profiles discoverable from the website",
      structuredProfiles: "Connect verified profiles through Organization sameAs data",
      openGraph: "Complete the Open Graph sharing preview",
      socialCards: "Complete dedicated social-card metadata",
      organizationSchema: "Clarify the organization name and logo in structured data",
      pageIdentity: "Complete the title, description, and canonical identity",
    },
    actionWhyTechnical: "Lowest automated score: {score}/100 on {strategies}.",
    actionWhySocial: "Current setup completeness for this check: {score}%.",
    genericError: "The snapshot could not be completed. Please try again.",
    note: "Digital presence snapshot",
  },
  fr: {
    urlLabel: "Page Web publique",
    placeholder: "https://exemple.ca",
    submit: "Lancer l’aperçu de présence numérique",
    starting: "Démarrage des deux vérifications…",
    both: "Vérification de la visibilité technique et de la configuration sociale…",
    technicalOnly: "La configuration sociale est prête. Finalisation des vérifications mobile et ordinateur…",
    socialOnly: "Les résultats techniques sont prêts. Finalisation de la configuration sociale…",
    resultsTitle: "Votre aperçu de présence numérique",
    resultsIntro: "Deux angles différents, un point de départ pratique. Les scores restent séparés puisqu’ils mesurent des éléments différents.",
    technicalTitle: "Visibilité du site",
    technicalDescription: "Signaux techniques automatisés mobile et ordinateur",
    socialTitle: "Configuration de la présence sociale",
    socialDescription: "Découverte des profils, partage et identité depuis le site",
    mobile: "Mobile",
    desktop: "Ordinateur",
    scoreLabels: {
      performance: "Performance",
      accessibility: "Accessibilité",
      bestPractices: "Bonnes pratiques",
      seo: "SEO technique",
    },
    detailedTechnical: "Ouvrir les résultats techniques détaillés",
    detailedSocial: "Ouvrir les résultats sociaux détaillés",
    actionsTitle: "Trois prochaines actions les plus utiles",
    actionsIntro: "Priorisées selon l’ampleur de l’écart automatisé. Le contexte d’affaires peut modifier l’ordre.",
    fixNow: "Corriger maintenant",
    planNext: "Planifier ensuite",
    automatedStrong: "Les vérifications automatisées sont solides. La prochaine étape utile est un examen humain de la stratégie et de la conversion.",
    humanTitle: "Exige un examen humain",
    human: [
      "L’adéquation de l’offre et du contenu à l’intention client",
      "Les canaux sociaux qui méritent un investissement—et ceux qui n’en méritent pas",
      "La confiance, les preuves, la voix de marque, la qualité éditoriale et la conversion",
    ],
    methodology: "Comment fonctionne l’aperçu",
    methodologyBody:
      "La visibilité du site utilise Google PageSpeed Insights pour le mobile et l’ordinateur. La présence sociale évalue la page publique soumise pour les liens de profils, les métadonnées de partage, l’identité structurée et les signaux canoniques. ROALLA ne combine pas ces résultats en un seul score et ne prétend pas mesurer automatiquement la stratégie.",
    print: "Imprimer ou enregistrer le rapport",
    ctaTitle: "Transformez ces signaux en plan d’amélioration ciblé.",
    ctaBody: "ROALLA peut valider les constats automatisés selon votre clientèle, votre offre, votre concurrence, votre contenu et le parcours vers une demande.",
    cta: "Demander à ROALLA de prioriser le travail",
    partialTitle: "Une partie de l’aperçu n’a pas pu être produite",
    technicalError: "La visibilité technique n’a pas pu être mesurée.",
    socialError: "La configuration sociale n’a pas pu être mesurée.",
    actionTechnical: {
      performance: "Améliorer la vitesse et la réactivité de la page",
      accessibility: "Corriger les obstacles d’accessibilité automatisés",
      bestPractices: "Corriger les écarts de bonnes pratiques du navigateur et de mise en œuvre",
      seo: "Renforcer la fondation du SEO technique",
    },
    actionSocial: {
      profileLinks: "Rendre les profils sociaux prioritaires découvrables depuis le site",
      structuredProfiles: "Relier les profils vérifiés avec les données sameAs de l’organisation",
      openGraph: "Compléter l’aperçu de partage Open Graph",
      socialCards: "Compléter les métadonnées de cartes sociales",
      organizationSchema: "Clarifier le nom et le logo de l’organisation dans les données structurées",
      pageIdentity: "Compléter le titre, la description et l’identité canonique",
    },
    actionWhyTechnical: "Score automatisé le plus faible : {score}/100 sur {strategies}.",
    actionWhySocial: "Complétude actuelle de cette vérification : {score} %.",
    genericError: "L’aperçu n’a pas pu être produit. Veuillez réessayer.",
    note: "Aperçu de présence numérique",
  },
} as const;

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function scoreTone(score: number | null) {
  if (score == null) return "text-slate-500";
  if (score >= 90) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-rose-700";
}

export default function DigitalPresenceSnapshot({
  locale,
  initialUrl = "",
}: {
  locale: string;
  initialUrl?: string;
}) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [url, setUrl] = useState(initialUrl);
  const [technical, setTechnical] = useState<TechnicalResponse | null>(null);
  const [social, setSocial] = useState<SocialPresenceSnapshot | null>(null);
  const [technicalError, setTechnicalError] = useState("");
  const [socialError, setSocialError] = useState("");
  const [technicalLoading, setTechnicalLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  const technicalSnapshots = useMemo(
    () => [technical?.mobile?.snapshot, technical?.desktop?.snapshot].filter(
      (snapshot): snapshot is WebsiteVisibilitySnapshot => Boolean(snapshot),
    ),
    [technical],
  );
  const actions = useMemo(
    () => buildDigitalPresenceActions(technicalSnapshots, social ?? undefined),
    [technicalSnapshots, social],
  );

  useEffect(() => {
    if (started && !technicalLoading && !socialLoading && (technical || social)) {
      resultsRef.current?.focus();
    }
  }, [started, technicalLoading, socialLoading, technical, social]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = JSON.stringify({ url, website: form.get("website") });
    setStarted(true);
    setTechnical(null);
    setSocial(null);
    setTechnicalError("");
    setSocialError("");
    setTechnicalLoading(true);
    setSocialLoading(true);
    trackAnalyticsEvent("digital_snapshot_started");

    const technicalRequest = fetch("/api/website-visibility-snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as TechnicalResponse;
        if (!payload.mobile?.snapshot && !payload.desktop?.snapshot) {
          throw new Error(payload.error || t.technicalError);
        }
        setTechnical(payload);
      })
      .catch((error) => setTechnicalError(error instanceof Error ? error.message : t.technicalError))
      .finally(() => setTechnicalLoading(false));

    const socialRequest = fetch("/api/social-presence-snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as {
          snapshot?: SocialPresenceSnapshot;
          error?: string;
        };
        if (!response.ok || !payload.snapshot) throw new Error(payload.error || t.socialError);
        setSocial(payload.snapshot);
      })
      .catch((error) => setSocialError(error instanceof Error ? error.message : t.socialError))
      .finally(() => setSocialLoading(false));

    await Promise.allSettled([technicalRequest, socialRequest]);
    trackAnalyticsEvent("digital_snapshot_completed");
  }

  const loadingMessage = technicalLoading && socialLoading
    ? t.both
    : technicalLoading
      ? t.technicalOnly
      : socialLoading
        ? t.socialOnly
        : t.starting;
  const resultUrl = social?.finalUrl || technicalSnapshots[0]?.finalUrl || url;
  const detailQuery = { url: resultUrl };
  const note = `${t.note}: ${resultUrl}. ${technicalSnapshots
    .map((snapshot) => `${snapshot.strategy} ${scoreOrder.map((name) => `${name} ${snapshot.scores[name] ?? "—"}`).join(", ")}`)
    .join(". ")}${social ? `. social ${social.score}/100` : ""}`.slice(0, 420);

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7 print:hidden">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">{t.urlLabel}</span>
            <input type="text" inputMode="url" autoComplete="url" required maxLength={2048} value={url} onChange={(event) => setUrl(event.target.value)} placeholder={t.placeholder} className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 px-4 text-slate-950 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <button type="submit" disabled={technicalLoading || socialLoading} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70">
            {technicalLoading || socialLoading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <SearchCheck className="h-5 w-5" aria-hidden />}
            {technicalLoading || socialLoading ? loadingMessage : t.submit}
          </button>
        </div>
        {technicalLoading || socialLoading ? <p className="mt-4 text-sm text-slate-600" role="status">{loadingMessage}</p> : null}
      </form>

      {started && (technical || social || technicalError || socialError) ? (
        <section ref={resultsRef} tabIndex={-1} className="space-y-7 outline-none" aria-live="polite">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-950">{t.resultsTitle}</h2>
                <p className="mt-2 max-w-3xl text-slate-700">{t.resultsIntro}</p>
              </div>
              <button type="button" onClick={() => window.print()} className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary-dark print:hidden">
                <Download className="h-4 w-4" aria-hidden />{t.print}
              </button>
            </div>
          </div>

          {(technicalError || socialError) ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">{t.partialTitle}</h2>
              {technicalError ? <p className="mt-2 text-sm text-amber-800">{technicalError}</p> : null}
              {socialError ? <p className="mt-2 text-sm text-amber-800">{socialError}</p> : null}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <Gauge className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
                <div><h2 className="text-2xl font-serif font-bold text-slate-950">{t.technicalTitle}</h2><p className="mt-1 text-sm text-slate-600">{t.technicalDescription}</p></div>
              </div>
              {technicalSnapshots.length ? (
                <div className="mt-6 space-y-5">
                  {technicalSnapshots.map((snapshot) => (
                    <div key={snapshot.strategy}>
                      <h3 className="font-semibold text-slate-950">{snapshot.strategy === "mobile" ? t.mobile : t.desktop}</h3>
                      <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {scoreOrder.map((name) => (
                          <div key={name} className="rounded-lg bg-slate-50 p-3">
                            <dt className="text-[11px] font-semibold text-slate-500">{t.scoreLabels[name]}</dt>
                            <dd className={`mt-1 text-2xl font-bold ${scoreTone(snapshot.scores[name])}`}>{snapshot.scores[name] ?? "—"}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                  <Link href={{ pathname: "/tools/website-visibility-snapshot", query: detailQuery }} className="inline-flex font-semibold text-primary-dark underline underline-offset-4 print:hidden">{t.detailedTechnical}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
                </div>
              ) : technicalLoading ? <p className="mt-6 text-sm text-slate-600">{loadingMessage}</p> : <p className="mt-6 text-sm text-slate-600">{t.technicalError}</p>}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <Share2 className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
                <div><h2 className="text-2xl font-serif font-bold text-slate-950">{t.socialTitle}</h2><p className="mt-1 text-sm text-slate-600">{t.socialDescription}</p></div>
              </div>
              {social ? (
                <div className="mt-6">
                  <p className={`text-5xl font-bold ${scoreTone(social.score)}`}>{social.score}<span className="text-lg text-slate-500">/100</span></p>
                  <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {social.checks.map((check) => (
                      <div key={check.id} className="rounded-lg bg-slate-50 p-3">
                        <dt className="text-[11px] font-semibold text-slate-500">{t.actionSocial[check.id]}</dt>
                        <dd className="mt-1 font-bold text-slate-900">{check.points}/{check.maxPoints}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link href={{ pathname: "/tools/social-presence-snapshot", query: detailQuery }} className="mt-5 inline-flex font-semibold text-primary-dark underline underline-offset-4 print:hidden">{t.detailedSocial}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
                </div>
              ) : socialLoading ? <p className="mt-6 text-sm text-slate-600">{loadingMessage}</p> : <p className="mt-6 text-sm text-slate-600">{t.socialError}</p>}
            </article>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-950">{t.actionsTitle}</h2>
              <p className="mt-2 text-sm text-slate-600">{t.actionsIntro}</p>
              {actions.length ? (
                <ol className="mt-5 space-y-3">
                  {actions.map((action, index) => {
                    const title = action.source === "technical" ? t.actionTechnical[action.key] : t.actionSocial[action.key];
                    const why = action.source === "technical"
                      ? fill(t.actionWhyTechnical, { score: String(action.score), strategies: action.strategies.map((strategy) => strategy === "mobile" ? t.mobile : t.desktop).join(` ${language === "fr" ? "et" : "and"} `) })
                      : fill(t.actionWhySocial, { score: String(action.score) });
                    return (
                      <li key={`${action.source}-${action.key}`} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary-dark">{index + 1}</span>
                        <div><span className={`text-xs font-bold uppercase tracking-wide ${action.priority === "fixNow" ? "text-rose-700" : "text-amber-700"}`}>{action.priority === "fixNow" ? t.fixNow : t.planNext}</span><h3 className="mt-1 font-semibold text-slate-950">{title}</h3><p className="mt-1 text-sm text-slate-600">{why}</p></div>
                      </li>
                    );
                  })}
                </ol>
              ) : <p className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{t.automatedStrong}</p>}
            </article>

            <article className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-950">{t.humanTitle}</h2>
              <ul className="mt-5 space-y-3">
                {t.human.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}
              </ul>
            </article>
          </div>

          <details className="rounded-xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer font-semibold text-slate-950">{t.methodology}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-700">{t.methodologyBody}</p>
          </details>

          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9 print:hidden">
            <SearchCheck className="h-8 w-8 text-primary-light" aria-hidden />
            <h2 className="mt-4 text-2xl font-serif font-bold text-white">{t.ctaTitle}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{t.ctaBody}</p>
            <Link href={{ pathname: "/contact", query: { intent: "visibility", from_page: "/tools/digital-presence-snapshot", goal: note } }} onClick={() => trackAnalyticsEvent("digital_snapshot_cta")} className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light">{t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
