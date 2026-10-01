"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
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
    urlLabel: "Your website address",
    placeholder: "https://example.com",
    submit: "Check my social setup",
    loading: "Checking your website’s social sharing setup…",
    genericError: "We could not complete the social media check. Please try again.",
    scoreTitle: "Social sharing score",
    measured: "Checked",
    cached: "Recent result",
    strong: "Looking good",
    developing: "A good start",
    needsWork: "Needs improvement",
    checksTitle: "Your results",
    profilesTitle: "Social profiles found on your website",
    noProfiles: "We could not find links to supported social profiles on this page.",
    linked: "Website link",
    schema: "Connected to your business information",
    previewTitle: "How your page may look when shared",
    imageReady: "A sharing image is ready",
    imageMissing: "No sharing image was found",
    limitations:
      "This check reviews the public information on your website. It does not sign in to your accounts or measure followers, post quality, reach, or engagement.",
    ctaTitle: "Get a free 15-minute review of your results",
    ctaBody:
      "A ROALLA specialist will explain your biggest opportunity, answer your questions, and recommend a practical next step.",
    ctaSteps: ["We review your results", "You receive one clear priority", "You decide whether to continue"],
    ctaProof: "30+ years of business and technology experience across 500+ engagements.",
    ctaReassurance: "Free review. No obligation. Personal reply within one business day.",
    cta: "Request my free results review",
    technicalTool: "Check my complete online presence",
    noteLead: "Social presence setup snapshot for",
    noteScore: "Website-side setup score",
    checkLabels: {
      profileLinks: "Links to your social profiles",
      structuredProfiles: "Website and profile connections",
      openGraph: "Main sharing preview",
      socialCards: "Social sharing details",
      organizationSchema: "Business name and logo",
      pageIdentity: "Page title, description, and address",
    },
    recommendations: {
      profileLinks: "Add clear links to the social profiles you actively use.",
      structuredProfiles: "Help search engines confirm which social profiles belong to your business.",
      openGraph: "Add a clear title, description, image, and website address for sharing.",
      socialCards: "Add the image and message you want people to see when your page is shared.",
      organizationSchema: "Add clear business name and logo information to your website.",
      pageIdentity: "Add a clear page title, description, and preferred website address.",
    },
  },
  fr: {
    urlLabel: "Adresse de votre site Web",
    placeholder: "https://exemple.ca",
    submit: "Vérifier ma présence sociale",
    loading: "Vérification du partage social de votre site…",
    genericError: "Nous n’avons pas pu terminer la vérification des réseaux sociaux. Veuillez réessayer.",
    scoreTitle: "Score de partage social",
    measured: "Vérifié",
    cached: "Résultat récent",
    strong: "Très bien",
    developing: "Un bon départ",
    needsWork: "À améliorer",
    checksTitle: "Vos résultats",
    profilesTitle: "Profils sociaux trouvés sur votre site",
    noProfiles: "Nous n’avons trouvé aucun lien vers un profil social pris en charge sur cette page.",
    linked: "Lien du site",
    schema: "Lié aux renseignements de votre entreprise",
    previewTitle: "Apparence possible de votre page lors du partage",
    imageReady: "Une image de partage est prête",
    imageMissing: "Aucune image de partage n’a été trouvée",
    limitations:
      "Cette vérification examine les renseignements publics de votre site. Elle ne se connecte pas à vos comptes et ne mesure pas les abonnés, la qualité des publications, la portée ou l’engagement.",
    ctaTitle: "Obtenez un examen gratuit de 15 minutes de vos résultats",
    ctaBody:
      "Un spécialiste de ROALLA expliquera votre principale possibilité d’amélioration, répondra à vos questions et recommandera une prochaine étape pratique.",
    ctaSteps: ["Nous examinons vos résultats", "Vous recevez une priorité claire", "Vous décidez si vous souhaitez poursuivre"],
    ctaProof: "Plus de 30 ans d’expérience en affaires et en technologie dans plus de 500 mandats.",
    ctaReassurance: "Examen gratuit. Sans obligation. Réponse personnelle dans un délai d’un jour ouvrable.",
    cta: "Demander mon examen gratuit",
    technicalTool: "Vérifier toute ma présence en ligne",
    noteLead: "Aperçu de configuration sociale pour",
    noteScore: "Score de configuration du site",
    checkLabels: {
      profileLinks: "Liens vers vos profils sociaux",
      structuredProfiles: "Liens entre le site et les profils",
      openGraph: "Aperçu principal de partage",
      socialCards: "Détails du partage social",
      organizationSchema: "Nom et logo de l’entreprise",
      pageIdentity: "Titre, description et adresse de la page",
    },
    recommendations: {
      profileLinks: "Ajoutez des liens clairs vers les profils sociaux que vous utilisez activement.",
      structuredProfiles: "Aidez les moteurs de recherche à confirmer les profils qui appartiennent à votre entreprise.",
      openGraph: "Ajoutez un titre, une description, une image et une adresse de site clairs pour le partage.",
      socialCards: "Ajoutez l’image et le message à afficher lorsque votre page est partagée.",
      organizationSchema: "Ajoutez le nom et le logo de votre entreprise aux renseignements du site.",
      pageIdentity: "Ajoutez un titre, une description et une adresse principale clairs pour la page.",
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
  const startedFromQuery = useRef(false);

  async function runSnapshot(honeypot: FormDataEntryValue | null) {
    setLoading(true);
    setError("");
    setSnapshot(null);
    trackAnalyticsEvent("social_snapshot_started");
    try {
      const response = await fetch("/api/social-presence-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, website: honeypot }),
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await runSnapshot(form.get("website"));
  }

  useEffect(() => {
    if (!initialUrl.trim() || startedFromQuery.current) return;
    startedFromQuery.current = true;
    void runSnapshot("");
    // The address comes from the page query. Run it once so the full social report opens immediately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

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
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              {t.ctaSteps.map((step, index) => <li key={step} className="rounded-lg border border-white/15 bg-white/[0.04] p-3 text-sm text-slate-200"><span className="mr-2 font-bold text-brand-gold">{index + 1}.</span>{step}</li>)}
            </ol>
            <p className="mt-5 text-sm font-semibold text-white">{t.ctaProof}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={{ pathname: "/contact", query: { intent: "visibility", review: "results", website: snapshot.finalUrl, from_page: "/tools/social-presence-snapshot", goal: note } }}
                onClick={() => trackAnalyticsEvent("social_snapshot_cta", { destination: "contact" })}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light"
              >
                {t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
              <Link href={{ pathname: "/tools/digital-presence-snapshot", query: { url: snapshot.finalUrl } }} className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
                {t.technicalTool}
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-400">{t.ctaReassurance}</p>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
