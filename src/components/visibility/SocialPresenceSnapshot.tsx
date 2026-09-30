"use client";

import React, { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  CircleX,
  ExternalLink,
  LoaderCircle,
  Share2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type {
  SocialPlatform,
  SocialPresenceCheckId,
  SocialPresenceSnapshot as Snapshot,
} from "@/lib/social-presence/analyzer";

const copy = {
  en: {
    urlLabel: "Public website page",
    placeholder: "https://example.com",
    submit: "Check social setup",
    loading: "Checking the website’s social foundation…",
    genericError: "The social presence snapshot could not be completed.",
    scoreTitle: "Social presence setup score",
    measured: "Measured",
    cached: "Recently cached result",
    strong: "Strong foundation",
    developing: "Developing foundation",
    needsWork: "Needs attention",
    checksTitle: "Setup quality checks",
    profilesTitle: "Profiles discovered on the website",
    noProfiles: "No supported social profiles were discovered in website links or organization schema.",
    linked: "Website link",
    schema: "Structured data",
    previewTitle: "Sharing preview readiness",
    imageReady: "A sharing image is configured",
    imageMissing: "No sharing image was detected",
    limitations:
      "This snapshot evaluates the website-side setup that supports social discovery and sharing. It does not log into social accounts, verify profile ownership, or score followers, publishing quality, reach, or engagement.",
    ctaTitle: "Turn the setup gaps into a credible social presence.",
    ctaBody:
      "ROALLA can align your website, profiles, brand identity, content plan, measurement, and conversion path around the channels that matter to your audience.",
    cta: "Ask ROALLA to help",
    technicalTool: "See the complete digital presence snapshot",
    noteLead: "Social presence setup snapshot for",
    noteScore: "Website-side setup score",
    checkLabels: {
      profileLinks: "Discoverable social profile links",
      structuredProfiles: "Profiles in organization structured data",
      openGraph: "Open Graph sharing metadata",
      socialCards: "X/Twitter sharing card metadata",
      organizationSchema: "Organization name and logo schema",
      pageIdentity: "Page title, description, and canonical URL",
    },
    recommendations: {
      profileLinks: "Link the priority social profiles clearly from the website.",
      structuredProfiles: "Add verified profile URLs to Organization sameAs structured data.",
      openGraph: "Complete the Open Graph title, description, image, URL, type, and site name.",
      socialCards: "Add card type, title, description, and image metadata for social sharing.",
      organizationSchema: "Describe the organization name and logo in valid structured data.",
      pageIdentity: "Complete the page title, meta description, and canonical URL.",
    },
  },
  fr: {
    urlLabel: "Page Web publique",
    placeholder: "https://exemple.ca",
    submit: "Vérifier la configuration sociale",
    loading: "Vérification de la fondation sociale du site…",
    genericError: "L’aperçu de présence sociale n’a pas pu être produit.",
    scoreTitle: "Score de configuration de la présence sociale",
    measured: "Mesuré",
    cached: "Résultat récent en cache",
    strong: "Fondation solide",
    developing: "Fondation en développement",
    needsWork: "À améliorer",
    checksTitle: "Vérifications de la configuration",
    profilesTitle: "Profils découverts sur le site Web",
    noProfiles: "Aucun profil social pris en charge n’a été découvert dans les liens ou les données structurées du site.",
    linked: "Lien du site",
    schema: "Données structurées",
    previewTitle: "Préparation de l’aperçu de partage",
    imageReady: "Une image de partage est configurée",
    imageMissing: "Aucune image de partage n’a été détectée",
    limitations:
      "Cet aperçu évalue la configuration du site qui soutient la découverte et le partage social. Il ne se connecte pas aux comptes, ne vérifie pas leur propriété et ne note pas les abonnés, la qualité éditoriale, la portée ou l’engagement.",
    ctaTitle: "Transformez les écarts de configuration en présence sociale crédible.",
    ctaBody:
      "ROALLA peut aligner votre site, vos profils, votre identité de marque, votre plan de contenu, votre mesure et votre parcours de conversion autour des canaux qui comptent pour votre clientèle.",
    cta: "Demander l’aide de ROALLA",
    technicalTool: "Voir l’aperçu complet de présence numérique",
    noteLead: "Aperçu de configuration sociale pour",
    noteScore: "Score de configuration du site",
    checkLabels: {
      profileLinks: "Liens découvrables vers les profils sociaux",
      structuredProfiles: "Profils dans les données structurées de l’organisation",
      openGraph: "Métadonnées de partage Open Graph",
      socialCards: "Métadonnées de carte de partage X/Twitter",
      organizationSchema: "Nom et logo de l’organisation dans le schéma",
      pageIdentity: "Titre, description et URL canonique de la page",
    },
    recommendations: {
      profileLinks: "Ajoutez clairement les liens vers les profils sociaux prioritaires.",
      structuredProfiles: "Ajoutez les URL vérifiées à la propriété sameAs de l’organisation.",
      openGraph: "Complétez le titre, la description, l’image, l’URL, le type et le nom du site Open Graph.",
      socialCards: "Ajoutez le type, le titre, la description et l’image de la carte sociale.",
      organizationSchema: "Décrivez le nom et le logo de l’organisation dans des données structurées valides.",
      pageIdentity: "Complétez le titre, la métadescription et l’URL canonique de la page.",
    },
  },
} as const;

const platformLabels: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X / Twitter",
  pinterest: "Pinterest",
  threads: "Threads",
  bluesky: "Bluesky",
};

function scoreTone(score: number) {
  if (score >= 80) return "border-emerald-300 bg-emerald-50 text-emerald-800";
  if (score >= 50) return "border-amber-300 bg-amber-50 text-amber-800";
  return "border-rose-300 bg-rose-50 text-rose-800";
}

function StatusIcon({ status }: { status: "pass" | "partial" | "fail" }) {
  if (status === "pass") return <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />;
  if (status === "partial") return <CircleAlert className="h-5 w-5 text-amber-600" aria-hidden />;
  return <CircleX className="h-5 w-5 text-rose-600" aria-hidden />;
}

export default function SocialPresenceSnapshot({ locale, initialUrl = "" }: { locale: string; initialUrl?: string }) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [url, setUrl] = useState(initialUrl);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [cached, setCached] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSnapshot(null);
    trackAnalyticsEvent("social_snapshot_started");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/social-presence-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, website: form.get("website") }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        snapshot?: Snapshot;
        cached?: boolean;
        error?: string;
      };
      if (!response.ok || !payload.snapshot) throw new Error(payload.error || t.genericError);
      setSnapshot(payload.snapshot);
      setCached(Boolean(payload.cached));
      trackAnalyticsEvent("social_snapshot_completed", {
        score: payload.snapshot.score,
        profiles: payload.snapshot.profiles.length,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.genericError);
    } finally {
      setLoading(false);
    }
  }

  const rating = snapshot
    ? snapshot.score >= 80
      ? t.strong
      : snapshot.score >= 50
        ? t.developing
        : t.needsWork
    : "";
  const note = snapshot
    ? `${t.noteLead} ${snapshot.finalUrl}. ${t.noteScore}: ${snapshot.score}/100.`
    : "";

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7">
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
              placeholder={t.placeholder}
              className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 px-4 text-slate-950 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <button type="submit" disabled={loading} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70">
            {loading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Share2 className="h-5 w-5" aria-hidden />}
            {loading ? t.loading : t.submit}
          </button>
        </div>
        {error ? <p className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-800" role="alert">{error}</p> : null}
        {loading ? <p className="mt-4 text-sm text-slate-600" role="status">{t.loading}</p> : null}
      </form>

      {snapshot ? (
        <section className="space-y-7" aria-live="polite">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-dark">{t.scoreTitle}</p>
                <h2 className="mt-2 break-all text-2xl font-serif font-bold text-slate-950">{new URL(snapshot.finalUrl).hostname}</h2>
                <p className="mt-2 text-xs text-slate-500">
                  {cached ? `${t.cached} · ` : ""}{t.measured} {new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(snapshot.analyzedAt))}
                </p>
              </div>
              <div className={`min-w-40 rounded-xl border px-6 py-4 text-center ${scoreTone(snapshot.score)}`}>
                <p className="text-4xl font-bold">{snapshot.score}<span className="text-base">/100</span></p>
                <p className="mt-1 text-sm font-semibold">{rating}</p>
              </div>
            </div>

            <h3 className="mt-8 text-xl font-serif font-bold text-slate-950">{t.checksTitle}</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {snapshot.checks.map((check) => (
                <article key={check.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <StatusIcon status={check.status} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-semibold text-slate-950">{t.checkLabels[check.id]}</h4>
                        <span className="shrink-0 text-sm font-bold text-slate-700">{check.points}/{check.maxPoints}</span>
                      </div>
                      {check.status !== "pass" ? <p className="mt-2 text-sm leading-6 text-slate-600">{t.recommendations[check.id]}</p> : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-slate-950">{t.profilesTitle}</h2>
              {snapshot.profiles.length ? (
                <ul className="mt-4 space-y-3">
                  {snapshot.profiles.map((profile) => (
                    <li key={`${profile.platform}-${profile.url}`} className="rounded-lg bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-950">{platformLabels[profile.platform]}</span>
                        <a href={profile.url} target="_blank" rel="noreferrer" aria-label={`${platformLabels[profile.platform]} profile`} className="text-primary-dark hover:text-primary">
                          <ExternalLink className="h-4 w-4" aria-hidden />
                        </a>
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-500">{profile.url}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.foundIn.includes("link") ? <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">{t.linked}</span> : null}
                        {profile.foundIn.includes("schema") ? <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">{t.schema}</span> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-sm leading-6 text-slate-600">{t.noProfiles}</p>}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-slate-950">{t.previewTitle}</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <div className={`flex h-32 items-center justify-center ${snapshot.preview.image ? "bg-primary/10" : "bg-slate-100"}`}>
                  <Share2 className={`h-10 w-10 ${snapshot.preview.image ? "text-primary" : "text-slate-400"}`} aria-hidden />
                </div>
                <div className="p-4">
                  {snapshot.preview.siteName ? <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{snapshot.preview.siteName}</p> : null}
                  <p className="mt-1 font-semibold text-slate-950">{snapshot.preview.title || new URL(snapshot.finalUrl).hostname}</p>
                  {snapshot.preview.description ? <p className="mt-2 line-clamp-3 text-sm text-slate-600">{snapshot.preview.description}</p> : null}
                  <p className="mt-3 text-xs font-semibold text-slate-500">{snapshot.preview.image ? t.imageReady : t.imageMissing}</p>
                </div>
              </div>
            </article>
          </div>

          <p className="rounded-xl border-l-4 border-brand-gold bg-slate-50 p-5 text-sm leading-6 text-slate-700">{t.limitations}</p>

          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9">
            <Share2 className="h-8 w-8 text-primary-light" aria-hidden />
            <h2 className="mt-4 text-2xl font-serif font-bold text-white">{t.ctaTitle}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{t.ctaBody}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={{ pathname: "/contact", query: { intent: "visibility", from_page: "/tools/social-presence-snapshot", goal: note } }}
                onClick={() => trackAnalyticsEvent("social_snapshot_cta", { destination: "contact" })}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light"
              >
                {t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <Link href={{ pathname: "/tools/digital-presence-snapshot", query: { url: snapshot.finalUrl } }} className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
                {t.technicalTool}
              </Link>
            </div>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
