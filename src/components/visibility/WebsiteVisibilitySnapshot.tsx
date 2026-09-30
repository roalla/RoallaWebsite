"use client";

import React, { FormEvent, useState } from "react";
import { ArrowRight, Gauge, LoaderCircle, SearchCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type {
  ScoreName,
  WebsiteVisibilitySnapshot as Snapshot,
} from "@/lib/website-visibility/pagespeed";

const SCORE_ORDER: ScoreName[] = ["performance", "accessibility", "bestPractices", "seo"];

const copy = {
  en: {
    urlLabel: "Public website page",
    urlPlaceholder: "https://example.com",
    submit: "Run free snapshot",
    loading: "Analyzing mobile and desktop—this can take up to a minute…",
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
      "This is a point-in-time technical snapshot, not a complete visibility audit. Scores can vary between runs. They do not measure content strategy—which is not an AI score, yet remains critical for sales conversion and user adoption—nor local presence, AI readability, trust, or conversion quality.",
    mobile: "Mobile",
    desktop: "Desktop",
    partialError: "This experience could not be measured.",
    nextTitle: "Next steps from these results",
    nextIntro:
      "Mobile and desktop were measured together. Compare the scores, then ask ROALLA to turn the gaps into a practical plan.",
    nextStrong:
      "Both experiences are strong on the automated checks. The useful next step is a human review of the offer, trust, and the path to an inquiry.",
    nextGap: "{experience} {label} is {score}. This is worth a closer look before more traffic is sent to the page.",
    nextMissing: "{experience} did not return a {label} score.",
    ctaTitle: "Ask ROALLA to help with these results.",
    ctaBody:
      "ROALLA can interpret the mobile and desktop signals alongside a human content strategy for conversion and adoption—not AI scoring alone—plus audience, competitors, search presence, accessibility, and the path to an inquiry.",
    cta: "Ask ROALLA to help",
    service: "See the complete digital presence snapshot",
    genericError: "The snapshot could not be completed. Please try again.",
    noteLead: "Visibility snapshot for",
    noteAsk: "Please help interpret the next steps.",
  },
  fr: {
    urlLabel: "Page Web publique",
    urlPlaceholder: "https://exemple.ca",
    submit: "Lancer l’aperçu gratuit",
    loading: "Analyse mobile et ordinateur—cela peut prendre jusqu’à une minute…",
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
      "Il s’agit d’un aperçu technique ponctuel, pas d’un audit complet de visibilité. Les scores peuvent varier. Ils ne mesurent pas la stratégie de contenu—qui n’est pas un score IA, mais demeure essentielle pour la conversion et l’adoption—ni la présence locale, la lisibilité par l’IA, la confiance ou la conversion.",
    mobile: "Mobile",
    desktop: "Ordinateur",
    partialError: "Cette expérience n’a pas pu être mesurée.",
    nextTitle: "Prochaines étapes à partir de ces résultats",
    nextIntro:
      "Le mobile et l’ordinateur ont été mesurés ensemble. Comparez les scores, puis demandez à ROALLA de transformer les écarts en un plan pratique.",
    nextStrong:
      "Les deux expériences sont solides selon les vérifications automatisées. La prochaine étape utile est un examen humain de l’offre, de la confiance et du parcours vers une demande.",
    nextGap: "{experience} — {label} : {score}. Cela mérite un regard plus attentif avant d’envoyer plus de trafic vers la page.",
    nextMissing: "{experience} n’a pas retourné de score pour {label}.",
    ctaTitle: "Demandez à ROALLA de vous aider avec ces résultats.",
    ctaBody:
      "ROALLA peut interpréter les signaux mobile et ordinateur avec une stratégie de contenu humaine pour la conversion et l’adoption—pas seulement un score IA—ainsi que votre clientèle, vos concurrents, votre présence dans la recherche, votre accessibilité et le parcours vers une demande.",
    cta: "Demander l’aide de ROALLA",
    service: "Voir l’aperçu complet de présence numérique",
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
      const scores = SCORE_ORDER.map((name) => `${t.scoreLabels[name]} ${snapshot.scores[name] ?? "—"}`).join(", ");
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

      <h3 className="mt-7 text-xl font-serif font-bold text-slate-950">{t.scoresTitle}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {SCORE_ORDER.map((name) => {
          const score = snapshot.scores[name];
          return (
            <div key={name} className={`rounded-xl border p-4 ${scoreTone(score)}`}>
              <p className="text-3xl font-bold">{score ?? "—"}</p>
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMobile(null);
    setDesktop(null);
    trackAnalyticsEvent("visibility_snapshot_started", { strategy: "mobile-and-desktop" });

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/website-visibility-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, website: form.get("website") }),
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
                          <td key={name} className="px-3 py-3 font-bold text-slate-950">{snapshot.scores[name] ?? "—"}</td>
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={{
                  pathname: "/contact",
                  query: {
                    intent: "visibility",
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
          </aside>
        </section>
      ) : null}
    </div>
  );
}
