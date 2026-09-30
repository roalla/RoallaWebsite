"use client";

import React, { FormEvent, useState } from "react";
import { ArrowRight, Gauge, LoaderCircle, RefreshCw, SearchCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type {
  ScoreName,
  WebsiteVisibilitySnapshot as Snapshot,
} from "@/lib/website-visibility/pagespeed";

const SCORE_ORDER: ScoreName[] = ["performance", "accessibility", "bestPractices", "seo"];

const copy = {
  en: {
    urlLabel: "Your website address",
    urlPlaceholder: "https://example.com",
    submit: "Run free snapshot",
    loading: "Checking your website on phones and computers. This can take up to a minute…",
    scoresTitle: "Your website scores",
    labTitle: "Page speed details",
    fieldTitle: "Experience reported by real visitors",
    fieldPage: "Page-level data",
    fieldOrigin: "Origin-level data",
    opportunitiesTitle: "Ways to improve page speed",
    noOpportunities: "No major page speed improvements were found during this check.",
    scoreLabels: {
      performance: "Lighthouse lab performance",
      accessibility: "Accessibility",
      bestPractices: "Reliability",
      seo: "Search readiness",
    },
    notAvailable: "Not available",
    cached: "Recently cached result",
    measured: "Measured",
    finalUrl: "Final page tested",
    lighthouse: "Lighthouse version",
    compareGoogle: "Compare with Google PageSpeed",
    freshTest: "Run a fresh Google test",
    source: "Data source: Google PageSpeed Insights",
    caveat:
      "The category scores come from a Lighthouse lab test run at the time shown. Real visitor information, when available, summarizes public Chrome data from the previous 28 days. Scores can change between runs and do not measure message quality, trust, or the ability to generate inquiries.",
    mobile: "Mobile",
    desktop: "Desktop",
    partialError: "We could not measure this version of the page.",
    nextTitle: "What to do next",
    nextIntro:
      "Compare the phone and computer scores, then focus on the areas with the most room to improve.",
    nextStrong:
      "Your website performs well in these checks. The next step is to review whether your message builds trust and makes it easy for visitors to contact you.",
    nextGap: "Your {experience} score for {label} is {score}. This area is worth improving.",
    nextMissing: "{experience} did not return a {label} score.",
    ctaTitle: "Get a free 15-minute review of your results",
    ctaBody:
      "A ROALLA specialist will explain your biggest opportunity, answer your questions, and recommend a practical next step.",
    ctaSteps: ["We review your results", "You receive one clear priority", "You decide whether to continue"],
    ctaProof: "30+ years of business and technology experience across 500+ engagements.",
    ctaReassurance: "Free review. No obligation. Personal reply within one business day.",
    cta: "Request my free results review",
    service: "Check my complete online presence",
    genericError: "The snapshot could not be completed. Please try again.",
    noteLead: "Visibility snapshot for",
    noteAsk: "Please help interpret the next steps.",
  },
  fr: {
    urlLabel: "Adresse de votre site Web",
    urlPlaceholder: "https://exemple.ca",
    submit: "Lancer l’aperçu gratuit",
    loading: "Vérification de votre site sur téléphone et ordinateur. Cela peut prendre jusqu’à une minute…",
    scoresTitle: "Les scores de votre site",
    labTitle: "Détails sur la vitesse de la page",
    fieldTitle: "Expérience rapportée par de vrais visiteurs",
    fieldPage: "Données de la page",
    fieldOrigin: "Données du domaine",
    opportunitiesTitle: "Façons d’améliorer la vitesse de la page",
    noOpportunities: "Aucune amélioration importante de la vitesse n’a été trouvée pendant cette vérification.",
    scoreLabels: {
      performance: "Performance de laboratoire Lighthouse",
      accessibility: "Accessibilité",
      bestPractices: "Fiabilité",
      seo: "Préparation à la recherche",
    },
    notAvailable: "Non disponible",
    cached: "Résultat récent en cache",
    measured: "Mesuré",
    finalUrl: "Page finale vérifiée",
    lighthouse: "Version de Lighthouse",
    compareGoogle: "Comparer avec Google PageSpeed",
    freshTest: "Lancer un nouveau test Google",
    source: "Source des données : Google PageSpeed Insights",
    caveat:
      "Les scores de catégorie proviennent d’un test de laboratoire Lighthouse exécuté au moment indiqué. Les renseignements sur les visiteurs réels, lorsqu’ils sont disponibles, résument les données publiques Chrome des 28 derniers jours. Les scores peuvent changer entre les tests et n’évaluent pas la qualité du message, la confiance ou la capacité à générer des demandes.",
    mobile: "Mobile",
    desktop: "Ordinateur",
    partialError: "Nous n’avons pas pu mesurer cette version de la page.",
    nextTitle: "La prochaine étape",
    nextIntro:
      "Comparez les scores sur téléphone et ordinateur, puis concentrez-vous sur les aspects qui offrent le plus de possibilités d’amélioration.",
    nextStrong:
      "Votre site obtient de bons résultats. La prochaine étape consiste à vérifier si votre message inspire confiance et facilite la prise de contact.",
    nextGap: "Votre score {experience} pour {label} est de {score}. Cet aspect mérite d’être amélioré.",
    nextMissing: "{experience} n’a pas retourné de score pour {label}.",
    ctaTitle: "Obtenez un examen gratuit de 15 minutes de vos résultats",
    ctaBody:
      "Un spécialiste de ROALLA expliquera votre principale possibilité d’amélioration, répondra à vos questions et recommandera une prochaine étape pratique.",
    ctaSteps: ["Nous examinons vos résultats", "Vous recevez une priorité claire", "Vous décidez si vous souhaitez poursuivre"],
    ctaProof: "Plus de 30 ans d’expérience en affaires et en technologie dans plus de 500 mandats.",
    ctaReassurance: "Examen gratuit. Sans obligation. Réponse personnelle dans un délai d’un jour ouvrable.",
    cta: "Demander mon examen gratuit",
    service: "Vérifier toute ma présence en ligne",
    genericError: "L’aperçu n’a pas pu être produit. Veuillez réessayer.",
    noteLead: "Aperçu de visibilité pour",
    noteAsk: "Merci d’aider à interpréter les prochaines étapes.",
  },
} as const;

type Copy = (typeof copy)[keyof typeof copy];

type ReportPayload = {
  snapshot?: Snapshot;
  cached?: boolean;
  error?: string;
};

function scoreTone(score: number | null) {
  if (score == null) return "border-slate-300 bg-slate-50 text-slate-600";
  if (score >= 90) return "border-emerald-300 bg-emerald-50 text-emerald-800";
  if (score >= 50) return "border-amber-300 bg-amber-50 text-amber-800";
  return "border-rose-300 bg-rose-50 text-rose-800";
}

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function engagementNote(pageUrl: string, reports: Array<{ label: string; snapshot: Snapshot }>, t: Copy) {
  const detail = reports
    .map(({ label, snapshot }) => {
      const scores = SCORE_ORDER.map((name) => `${t.scoreLabels[name]} ${snapshot.scores[name] ?? t.notAvailable}`).join(", ");
      return `${label}: ${scores}`;
    })
    .join(". ");
  return `${t.noteLead} ${pageUrl}. ${detail}. ${t.noteAsk}`.slice(0, 280);
}

function ReportCard({
  label,
  report,
  t,
  language,
}: {
  label: string;
  report: ReportPayload;
  t: Copy;
  language: "en" | "fr";
}) {
  if (!report.snapshot) {
    return (
      <article className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <h2 className="text-xl font-serif font-bold">{label}</h2>
        <p className="mt-3 text-sm">{report.error || t.partialError}</p>
      </article>
    );
  }

  const snapshot = report.snapshot;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-dark">{label}</p>
          <h2 className="mt-2 break-all text-2xl font-serif font-bold text-slate-950">{new URL(snapshot.finalUrl).hostname}</h2>
        </div>
        <p className="text-xs text-slate-500">
          {report.cached ? `${t.cached} · ` : ""}
          {t.measured}{" "}
          {new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(snapshot.analyzedAt))}
        </p>
      </div>
      <dl className="mt-4 space-y-1 text-xs text-slate-600">
        <div><dt className="inline font-semibold text-slate-700">{t.finalUrl}: </dt><dd className="inline break-all">{snapshot.finalUrl}</dd></div>
        {snapshot.lighthouseVersion ? <div><dt className="inline font-semibold text-slate-700">{t.lighthouse}: </dt><dd className="inline">{snapshot.lighthouseVersion}</dd></div> : null}
      </dl>
      <a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(snapshot.finalUrl)}&form_factor=${snapshot.strategy}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-primary-dark underline underline-offset-4">{t.compareGoogle}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></a>

      <h3 className="mt-7 text-xl font-serif font-bold text-slate-950">{t.scoresTitle}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {SCORE_ORDER.map((name) => {
          const score = snapshot.scores[name];
          return (
            <div key={name} className={`rounded-xl border p-4 ${scoreTone(score)}`}>
              <p className="text-3xl font-bold">{score ?? t.notAvailable}</p>
              <p className="mt-1 text-sm font-semibold">{t.scoreLabels[name]}</p>
              {score == null ? <p className="mt-1 text-xs">{t.notAvailable}</p> : null}
            </div>
          );
        })}
      </div>

      {snapshot.labMetrics.length ? (
        <div className="mt-8">
          <h3 className="text-lg font-serif font-bold text-slate-950">{t.labTitle}</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {snapshot.labMetrics.map((metric) => (
              <div key={metric.key} className="rounded-lg bg-slate-50 p-4">
                <dt className="text-xs font-semibold text-slate-600">{metric.label}</dt>
                <dd className="mt-1 text-lg font-bold text-slate-950">{metric.displayValue}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {snapshot.fieldMetrics.length ? (
        <div className="mt-8">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-lg font-serif font-bold text-slate-950">{t.fieldTitle}</h3>
            <span className="text-xs text-slate-500">({snapshot.fieldScope === "page" ? t.fieldPage : t.fieldOrigin})</span>
          </div>
          <dl className="mt-3 grid gap-3">
            {snapshot.fieldMetrics.map((metric) => (
              <div key={metric.key} className="rounded-lg border border-slate-200 p-4">
                <dt className="text-xs font-semibold text-slate-600">{metric.label}</dt>
                <dd className="mt-1 text-lg font-bold text-slate-950">{metric.displayValue}</dd>
                {metric.category ? <p className="mt-1 text-xs uppercase text-slate-500">{metric.category}</p> : null}
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <div className="mt-8">
        <h3 className="text-lg font-serif font-bold text-slate-950">{t.opportunitiesTitle}</h3>
        {snapshot.opportunities.length ? (
          <ol className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
            {snapshot.opportunities.map((opportunity, index) => (
              <li key={opportunity.id} className="flex gap-4 py-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-dark">{index + 1}</span>
                <div>
                  <p className="font-semibold text-slate-900">{opportunity.title}</p>
                  {opportunity.displayValue ? <p className="mt-1 text-sm text-slate-600">{opportunity.displayValue}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        ) : <p className="mt-3 text-sm text-slate-600">{t.noOpportunities}</p>}
      </div>
    </article>
  );
}

export default function WebsiteVisibilitySnapshot({ locale, initialUrl = "" }: { locale: string; initialUrl?: string }) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [url, setUrl] = useState(initialUrl);
  const [mobile, setMobile] = useState<ReportPayload | null>(null);
  const [desktop, setDesktop] = useState<ReportPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runSnapshot(forceFresh = false, honeypot: FormDataEntryValue | null = "") {
    setLoading(true);
    setError("");
    setMobile(null);
    setDesktop(null);
    trackAnalyticsEvent("visibility_snapshot_started", { strategy: "mobile-and-desktop" });

    try {
      const response = await fetch("/api/website-visibility-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, website: honeypot, fresh: forceFresh }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        mobile?: ReportPayload;
        desktop?: ReportPayload;
        error?: string;
      };
      if (!payload.mobile?.snapshot && !payload.desktop?.snapshot) {
        throw new Error(payload.error || t.genericError);
      }
      setMobile(payload.mobile ?? { error: t.partialError });
      setDesktop(payload.desktop ?? { error: t.partialError });
      trackAnalyticsEvent("visibility_snapshot_completed", {
        strategy: "mobile-and-desktop",
        cached: Boolean(payload.mobile?.cached && payload.desktop?.cached),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.genericError);
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await runSnapshot(false, form.get("website"));
  }

  const reports: Array<{ label: string; snapshot: Snapshot }> = [];
  if (mobile?.snapshot) reports.push({ label: t.mobile, snapshot: mobile.snapshot });
  if (desktop?.snapshot) reports.push({ label: t.desktop, snapshot: desktop.snapshot });

  const attention = reports.flatMap(({ label, snapshot }) =>
    SCORE_ORDER.flatMap((name) => {
      const score = snapshot.scores[name];
      if (score != null && score >= 90) return [];
      const template = score == null ? t.nextMissing : t.nextGap;
      return [fill(template, { experience: label, label: t.scoreLabels[name], score: String(score ?? "") })];
    }),
  );

  const pageUrl = reports[0]?.snapshot.requestedUrl || url;
  const note = reports.length ? engagementNote(pageUrl, reports, t) : "";

  return (
    <div className="space-y-8">
      <form
        onSubmit={submit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">{t.urlLabel}</span>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              required
              maxLength={2048}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={t.urlPlaceholder}
              className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 px-4 text-slate-950 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Gauge className="h-5 w-5" aria-hidden />}
            {loading ? t.loading : t.submit}
          </button>
        </div>
        {error ? <p className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-800" role="alert">{error}</p> : null}
        {loading ? <p className="mt-4 text-sm text-slate-600" role="status">{t.loading}</p> : null}
      </form>

      {mobile || desktop ? (
        <section className="space-y-7" aria-live="polite">
          <div className="grid gap-6 xl:grid-cols-2">
            {mobile ? <ReportCard label={t.mobile} report={mobile} t={t} language={language} /> : null}
            {desktop ? <ReportCard label={t.desktop} report={desktop} t={t} language={language} /> : null}
          </div>

          <div className="flex justify-center">
            <button type="button" disabled={loading} onClick={() => runSnapshot(true)} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-primary/30 bg-white px-5 py-2 text-sm font-semibold text-primary-dark hover:border-primary disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden />{t.freshTest}</button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-950">{t.nextTitle}</h2>
            <p className="mt-3 max-w-3xl text-slate-700">{t.nextIntro}</p>
            {reports.length ? (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[36rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-4 font-semibold">{t.scoresTitle}</th>
                      {SCORE_ORDER.map((name) => (
                        <th key={name} className="px-3 py-2 font-semibold">{t.scoreLabels[name]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(({ label, snapshot }) => (
                      <tr key={label} className="border-b border-slate-100">
                        <th className="py-3 pr-4 font-semibold text-slate-950">{label}</th>
                        {SCORE_ORDER.map((name) => (
                          <td key={name} className="px-3 py-3 font-bold text-slate-950">{snapshot.scores[name] ?? t.notAvailable}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            <ul className="mt-5 space-y-2">
              {(attention.length ? attention : [t.nextStrong]).map((item) => (
                <li key={item} className="text-sm leading-6 text-slate-700">{item}</li>
              ))}
            </ul>
            <p className="mt-5 border-l-4 border-brand-gold bg-slate-50 p-4 text-sm text-slate-700">
              {t.caveat}{" "}
              <a href="https://pagespeed.web.dev/" target="_blank" rel="noreferrer" className="font-semibold text-primary-dark underline underline-offset-2">{t.source}</a>
            </p>
          </div>

          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9">
            <SearchCheck className="h-8 w-8 text-primary-light" aria-hidden />
            <h2 className="mt-4 text-2xl font-serif font-bold text-white">{t.ctaTitle}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{t.ctaBody}</p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              {t.ctaSteps.map((step, index) => <li key={step} className="rounded-lg border border-white/15 bg-white/[0.04] p-3 text-sm text-slate-200"><span className="mr-2 font-bold text-brand-gold">{index + 1}.</span>{step}</li>)}
            </ol>
            <p className="mt-5 text-sm font-semibold text-white">{t.ctaProof}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={{
                  pathname: "/contact",
                  query: {
                    intent: "visibility",
                    review: "results",
                    website: pageUrl,
                    from_page: "/tools/website-visibility-snapshot",
                    goal: note,
                  },
                }}
                onClick={() => trackAnalyticsEvent("visibility_snapshot_cta", { destination: "contact" })}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light"
              >
                {t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <Link href={{ pathname: "/tools/digital-presence-snapshot", query: { url: pageUrl } }} className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
                {t.service}
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-400">{t.ctaReassurance}</p>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
