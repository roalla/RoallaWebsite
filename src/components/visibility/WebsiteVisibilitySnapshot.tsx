"use client";

import React, { FormEvent, useState } from "react";
import { ArrowRight, Gauge, LoaderCircle, SearchCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type {
  PageSpeedStrategy,
  ScoreName,
  WebsiteVisibilitySnapshot as Snapshot,
} from "@/lib/website-visibility/pagespeed";

const copy = {
  en: {
    urlLabel: "Public website page",
    urlPlaceholder: "https://example.com",
    strategyLabel: "Test experience",
    mobile: "Mobile",
    desktop: "Desktop",
    submit: "Run free snapshot",
    loading: "Analyzing the page—this can take up to a minute…",
    scoresTitle: "Technical visibility signals",
    labTitle: "Lab performance metrics",
    fieldTitle: "Real-user signals",
    fieldPage: "Page-level data",
    fieldOrigin: "Origin-level data",
    opportunitiesTitle: "Highest-impact technical opportunities",
    noOpportunities: "No major performance opportunities were returned for this run.",
    scoreLabels: {
      performance: "Performance",
      accessibility: "Accessibility",
      bestPractices: "Best practices",
      seo: "Technical SEO",
    },
    notAvailable: "Not available",
    cached: "Recently cached result",
    measured: "Measured",
    source: "Data source: Google PageSpeed Insights",
    caveat:
      "This is a point-in-time technical snapshot, not a complete visibility audit. Scores can vary between runs and do not measure content strategy, local presence, AI readability, trust, or conversion quality.",
    ctaTitle: "The score is the starting point—not the strategy.",
    ctaBody:
      "ROALLA can interpret these signals alongside your content, audience, competitors, search presence, accessibility, and conversion path.",
    cta: "Request a visibility assessment",
    service: "See the complete visibility service",
    genericError: "The snapshot could not be completed. Please try again.",
  },
  fr: {
    urlLabel: "Page Web publique",
    urlPlaceholder: "https://exemple.ca",
    strategyLabel: "Expérience à tester",
    mobile: "Mobile",
    desktop: "Ordinateur",
    submit: "Lancer l’aperçu gratuit",
    loading: "Analyse de la page—cela peut prendre jusqu’à une minute…",
    scoresTitle: "Signaux techniques de visibilité",
    labTitle: "Mesures de performance en laboratoire",
    fieldTitle: "Signaux d’utilisateurs réels",
    fieldPage: "Données de la page",
    fieldOrigin: "Données du domaine",
    opportunitiesTitle: "Possibilités techniques les plus importantes",
    noOpportunities: "Aucune possibilité de performance majeure n’a été retournée pour cette analyse.",
    scoreLabels: {
      performance: "Performance",
      accessibility: "Accessibilité",
      bestPractices: "Bonnes pratiques",
      seo: "SEO technique",
    },
    notAvailable: "Non disponible",
    cached: "Résultat récent en cache",
    measured: "Mesuré",
    source: "Source des données : Google PageSpeed Insights",
    caveat:
      "Il s’agit d’un aperçu technique ponctuel, pas d’un audit complet de visibilité. Les scores peuvent varier et ne mesurent pas la stratégie de contenu, la présence locale, la lisibilité par l’IA, la confiance ou la conversion.",
    ctaTitle: "Le score est le point de départ—pas la stratégie.",
    ctaBody:
      "ROALLA peut interpréter ces signaux avec votre contenu, votre clientèle, vos concurrents, votre présence dans la recherche, votre accessibilité et votre parcours de conversion.",
    cta: "Demander une évaluation de visibilité",
    service: "Voir le service complet de visibilité",
    genericError: "L’aperçu n’a pas pu être produit. Veuillez réessayer.",
  },
} as const;

function scoreTone(score: number | null) {
  if (score == null) return "border-slate-300 bg-slate-50 text-slate-600";
  if (score >= 90) return "border-emerald-300 bg-emerald-50 text-emerald-800";
  if (score >= 50) return "border-amber-300 bg-amber-50 text-amber-800";
  return "border-rose-300 bg-rose-50 text-rose-800";
}

export default function WebsiteVisibilitySnapshot({ locale }: { locale: string }) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<PageSpeedStrategy>("mobile");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [cached, setCached] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSnapshot(null);
    trackAnalyticsEvent("visibility_snapshot_started", { strategy });

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/website-visibility-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy, website: form.get("website") }),
      });
      const payload = (await response.json()) as {
        snapshot?: Snapshot;
        cached?: boolean;
        error?: string;
      };
      if (!response.ok || !payload.snapshot) {
        throw new Error(payload.error || t.genericError);
      }
      setSnapshot(payload.snapshot);
      setCached(Boolean(payload.cached));
      trackAnalyticsEvent("visibility_snapshot_completed", {
        strategy,
        cached: Boolean(payload.cached),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.genericError);
    } finally {
      setLoading(false);
    }
  }

  const scoreEntries = snapshot
    ? (Object.entries(snapshot.scores) as Array<[ScoreName, number | null]>)
    : [];

  return (
    <div className="space-y-8">
      <form
        onSubmit={submit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px_auto] lg:items-end">
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
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">{t.strategyLabel}</span>
            <select
              value={strategy}
              onChange={(event) => setStrategy(event.target.value as PageSpeedStrategy)}
              className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-950 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="mobile">{t.mobile}</option>
              <option value="desktop">{t.desktop}</option>
            </select>
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

      {snapshot ? (
        <section className="space-y-7" aria-live="polite">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-dark">{snapshot.strategy === "mobile" ? t.mobile : t.desktop}</p>
                <h2 className="mt-2 break-all text-2xl font-serif font-bold text-slate-950">{new URL(snapshot.finalUrl).hostname}</h2>
              </div>
              <p className="text-xs text-slate-500">
                {cached ? `${t.cached} · ` : ""}{t.measured} {new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(snapshot.analyzedAt))}
              </p>
            </div>

            <h3 className="mt-7 text-xl font-serif font-bold text-slate-950">{t.scoresTitle}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {scoreEntries.map(([name, score]) => (
                <div key={name} className={`rounded-xl border p-4 ${scoreTone(score)}`}>
                  <p className="text-3xl font-bold">{score ?? "—"}</p>
                  <p className="mt-1 text-sm font-semibold">{t.scoreLabels[name]}</p>
                  {score == null ? <p className="mt-1 text-xs">{t.notAvailable}</p> : null}
                </div>
              ))}
            </div>

            {snapshot.labMetrics.length ? (
              <div className="mt-8">
                <h3 className="text-lg font-serif font-bold text-slate-950">{t.labTitle}</h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                <dl className="mt-3 grid gap-3 sm:grid-cols-3">
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

            <div className="mt-7 border-l-4 border-brand-gold bg-slate-50 p-4 text-sm text-slate-700">
              <p>{t.caveat}</p>
              <a href="https://pagespeed.web.dev/" target="_blank" rel="noreferrer" className="mt-2 inline-block font-semibold text-primary-dark underline underline-offset-2">{t.source}</a>
            </div>
          </div>

          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9">
            <SearchCheck className="h-8 w-8 text-primary-light" aria-hidden />
            <h2 className="mt-4 text-2xl font-serif font-bold">{t.ctaTitle}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{t.ctaBody}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={{ pathname: "/contact", query: { intent: "visibility", source: "visibility-snapshot" } }}
                onClick={() => trackAnalyticsEvent("visibility_snapshot_cta", { destination: "contact" })}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light"
              >
                {t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <Link href="/services/digital-visibility-optimization" className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
                {t.service}
              </Link>
            </div>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
