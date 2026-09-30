"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Gauge, LoaderCircle, LockKeyhole, RefreshCw } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

type RecordItem = { checkedAt: string; url: string; mobile: number | null; desktop: number | null; social: number | null };
const STORAGE_KEY = "roalla-digital-monitoring-preview";

function tone(value: number | null) { return value == null ? "text-slate-500" : value >= 90 ? "text-emerald-700" : value >= 50 ? "text-amber-700" : "text-rose-700"; }

export default function DigitalMonitoringDashboard({ locale }: { locale: string }) {
  const fr = locale === "fr";
  const [url, setUrl] = useState(""); const [records, setRecords] = useState<RecordItem[]>([]); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  useEffect(() => { try { const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"); if (Array.isArray(value)) setRecords(value); } catch { /* Ignore invalid browser data. */ } trackAnalyticsEvent("monitoring_preview_opened"); }, []);
  const latest = records[records.length - 1]; const previous = records[records.length - 2];
  const metrics = useMemo(() => [
    { label: fr ? "Performance mobile" : "Mobile lab performance", value: latest?.mobile ?? null, previous: previous?.mobile ?? null },
    { label: fr ? "Performance ordinateur" : "Desktop lab performance", value: latest?.desktop ?? null, previous: previous?.desktop ?? null },
    { label: fr ? "Présentation sociale" : "Social setup", value: latest?.social ?? null, previous: previous?.social ?? null },
  ], [fr, latest, previous]);

  async function run(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const body = JSON.stringify({ url, fresh: true });
      const [technicalResponse, socialResponse] = await Promise.all([
        fetch("/api/website-visibility-snapshot", { method: "POST", headers: { "Content-Type": "application/json" }, body }),
        fetch("/api/social-presence-snapshot", { method: "POST", headers: { "Content-Type": "application/json" }, body }),
      ]);
      const technical = await technicalResponse.json(); const social = await socialResponse.json();
      if (!technical?.mobile?.snapshot && !technical?.desktop?.snapshot && !social?.snapshot) throw new Error(fr ? "La vérification n’a pas pu être produite." : "The check could not be completed.");
      const item: RecordItem = { checkedAt: new Date().toISOString(), url: social?.snapshot?.finalUrl || technical?.mobile?.snapshot?.finalUrl || url, mobile: technical?.mobile?.snapshot?.scores?.performance ?? null, desktop: technical?.desktop?.snapshot?.scores?.performance ?? null, social: social?.snapshot?.score ?? null };
      const next = [...records.filter((record) => record.url === item.url).slice(-11), item]; setRecords(next); window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (caught) { setError(caught instanceof Error ? caught.message : fr ? "Veuillez réessayer." : "Please try again."); } finally { setLoading(false); }
  }

  function clear() { window.localStorage.removeItem(STORAGE_KEY); setRecords([]); }
  const contactHref = `/${locale}/contact?intent=visibility&goal=${encodeURIComponent(fr ? "Je souhaite discuter du suivi numérique mensuel." : "I would like to discuss monthly digital monitoring.")}&from_page=${encodeURIComponent("/tools/digital-monitoring-dashboard")}`;

  return <div className="space-y-7">
    <aside className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5"><div className="flex gap-3"><LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-primary-dark" aria-hidden /><div><h2 className="font-bold text-slate-950">{fr ? "Prévisualisation privée dans votre navigateur" : "Private browser preview"}</h2><p className="mt-1 text-sm leading-6 text-slate-700">{fr ? "Cette page enregistre jusqu’à douze vérifications uniquement dans ce navigateur. Elle ne crée pas un compte et ne démarre aucun suivi automatique. Les espaces clients sécurisés sont configurés dans le cadre d’un mandat approuvé." : "This page stores up to twelve checks only in this browser. It does not create an account or start automatic monitoring. Secure client workspaces are configured as part of an approved engagement."}</p></div></div></aside>
    <form onSubmit={run} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><label className="block text-sm font-semibold text-slate-900">{fr ? "Adresse du site Web" : "Website address"}<input type="text" inputMode="url" required maxLength={2048} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 px-4 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><div className="mt-4 flex flex-wrap gap-3"><button disabled={loading} className="inline-flex min-h-[48px] items-center rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60">{loading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" aria-hidden /> : <RefreshCw className="mr-2 h-5 w-5" aria-hidden />}{loading ? (fr ? "Vérification en cours" : "Running check") : (fr ? "Ajouter une vérification" : "Add a fresh check")}</button>{records.length ? <button type="button" onClick={clear} className="px-4 text-sm font-semibold text-slate-600 underline underline-offset-4">{fr ? "Effacer les données locales" : "Clear local data"}</button> : null}</div>{error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800" role="alert">{error}</p> : null}</form>
    {latest ? <><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-primary-dark">{fr ? "Dernière référence" : "Latest baseline"}</p><h2 className="mt-1 break-all text-xl font-serif font-bold text-slate-950">{latest.url}</h2><p className="mt-1 text-xs text-slate-500">{new Intl.DateTimeFormat(fr ? "fr-CA" : "en-CA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(latest.checkedAt))}</p></div><Gauge className="h-8 w-8 text-primary" aria-hidden /></div><dl className="mt-6 grid gap-4 sm:grid-cols-3">{metrics.map((metric) => { const delta = metric.value != null && metric.previous != null ? metric.value - metric.previous : null; return <div key={metric.label} className="rounded-xl bg-slate-50 p-5"><dt className="text-xs font-semibold text-slate-600">{metric.label}</dt><dd className={`mt-1 text-3xl font-bold ${tone(metric.value)}`}>{metric.value ?? (fr ? "S.O." : "N/A")}</dd>{delta != null ? <p className={`mt-1 text-xs font-semibold ${delta > 0 ? "text-emerald-700" : delta < 0 ? "text-rose-700" : "text-slate-500"}`}>{delta > 0 ? "+" : ""}{delta} {fr ? "depuis la vérification précédente" : "since the previous check"}</p> : null}</div>; })}</dl></section><section className="grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-serif font-bold text-slate-950">{fr ? "Rythme d’amélioration suggéré" : "Suggested improvement rhythm"}</h2><ol className="mt-5 space-y-3">{(fr ? ["Examiner les changements et les problèmes importants.", "Choisir une amélioration liée à une priorité d’affaires.", "Livrer, mesurer et consigner ce qui a changé."] : ["Review changes and important issues.", "Choose one improvement tied to a business priority.", "Deliver, measure, and record what changed."]).map((item, i) => <li key={item} className="flex gap-3 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden /><span><strong>{i + 1}.</strong> {item}</span></li>)}</ol></article><article className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-6"><h2 className="text-xl font-serif font-bold text-slate-950">{fr ? "Besoin d’un suivi continu?" : "Need ongoing monitoring?"}</h2><p className="mt-3 text-sm leading-6 text-slate-700">{fr ? "ROALLA peut confirmer les actifs, les alertes, la cadence, les responsabilités et les améliorations incluses avant le début du service." : "ROALLA can confirm the assets, alerts, cadence, responsibilities, and included improvements before service begins."}</p><a href={contactHref} className="mt-5 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">{fr ? "Discuter du suivi mensuel" : "Discuss monthly monitoring"}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></a></article></section></> : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center"><p className="font-semibold text-slate-800">{fr ? "Ajoutez votre première vérification pour établir une référence." : "Add your first check to establish a baseline."}</p></div>}
  </div>;
}
