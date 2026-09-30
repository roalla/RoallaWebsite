"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Download, LockKeyhole, Sparkles } from "lucide-react";
import { recommendDigitalService, type DigitalGoal, type DigitalStage } from "@/lib/digital-value-planner";
import { trackAnalyticsEvent } from "@/lib/analytics";

const copy = {
  en: {
    goalLabel: "What matters most right now?",
    goals: { inquiries: "Generate more suitable inquiries", visibility: "Help more people find and understand us", operations: "Reduce repetitive work and slow handoffs", product: "Launch a portal, platform, or digital service", event: "Prepare for an event, booth, or launch", stability: "Keep an existing site or product healthy" },
    stageLabel: "Where are you today?",
    stages: { idea: "We have an idea but need clarity", "live-concern": "Something is live but not working well", "live-growing": "It works and now needs to improve", urgent: "A deadline or immediate issue is driving this" },
    barrierLabel: "What is getting in the way?", barrierPlaceholder: "For example, our website gets visits but few inquiries, or our team copies the same information between systems.",
    measureLabel: "How would you recognize progress?", measurePlaceholder: "For example, five more qualified inquiries each month or six hours saved every week.",
    submit: "Create my value blueprint", report: "ROALLA Digital Value Blueprint", why: "Why this fits", plan: "Your 30, 60, and 90-day direction",
    days: ["First 30 days", "By 60 days", "By 90 days"],
    actions: ["Confirm the baseline, intended outcome, decision owner, and most important risk.", "Complete the smallest useful improvement or pilot, then review evidence with the people affected.", "Measure the result, document what changed, and decide whether to expand, adjust, or stop."],
    private: "This blueprint stays in your browser unless you choose to send it to ROALLA.", save: "Save this blueprint in my browser", saved: "Blueprint saved", print: "Print or save as PDF", explore: "Explore the recommended service", review: "Request a free fit review",
    disclaimer: "This is an initial planning guide based on your answers. ROALLA confirms scope, feasibility, dependencies, pricing, and expected measures before any engagement.",
    names: { conversion: "Website Conversion Refresh", visibility: "Visibility Improvement Sprint", automation: "Automation Opportunity Sprint", product: "Digital Product Validation Sprint", event: "Event Digital Readiness Sprint", managed: "Digital Baseline and Managed Optimization" },
    reasons: { conversion: "Your priority depends on making the current customer journey clearer and easier to act on before assuming a complete rebuild is required.", visibility: "Your priority depends on improving how people, search engines, and intelligent systems discover and understand the business.", automation: "Your priority involves recurring operating work. A workflow and exception review can show whether automation will create enough practical value.", product: "Your priority requires a new digital capability. Validation reduces the risk of funding features before the user journey and value are clear.", event: "Your priority has a fixed moment. The digital experience, lead path, and follow-up should be designed around the event deadline.", managed: "You already have a live asset that needs an accountable baseline, improvement backlog, and regular review rhythm." },
  },
  fr: {
    goalLabel: "Qu’est-ce qui compte le plus maintenant?",
    goals: { inquiries: "Générer plus de demandes pertinentes", visibility: "Aider plus de gens à nous trouver et nous comprendre", operations: "Réduire le travail répétitif et les transferts lents", product: "Lancer un portail, une plateforme ou un service numérique", event: "Préparer un événement, un kiosque ou un lancement", stability: "Garder un site ou produit existant en santé" },
    stageLabel: "Où en êtes-vous aujourd’hui?",
    stages: { idea: "Nous avons une idée, mais il faut la clarifier", "live-concern": "Une solution est active, mais fonctionne mal", "live-growing": "Elle fonctionne et doit maintenant progresser", urgent: "Une échéance ou un problème immédiat motive le projet" },
    barrierLabel: "Qu’est-ce qui vous freine?", barrierPlaceholder: "Par exemple, notre site reçoit des visites mais peu de demandes, ou notre équipe recopie la même information.",
    measureLabel: "Comment reconnaîtrez-vous un progrès?", measurePlaceholder: "Par exemple, cinq demandes qualifiées de plus par mois ou six heures économisées par semaine.",
    submit: "Créer mon plan de valeur", report: "Plan de valeur numérique ROALLA", why: "Pourquoi cela convient", plan: "Votre direction sur 30, 60 et 90 jours",
    days: ["Les 30 premiers jours", "D’ici 60 jours", "D’ici 90 jours"],
    actions: ["Confirmer la référence, le résultat visé, la personne responsable et le principal risque.", "Réaliser la plus petite amélioration ou le plus petit pilote utile, puis examiner les preuves avec les personnes touchées.", "Mesurer le résultat, documenter le changement et décider d’élargir, d’ajuster ou d’arrêter."],
    private: "Ce plan reste dans votre navigateur, sauf si vous choisissez de l’envoyer à ROALLA.", save: "Enregistrer ce plan dans mon navigateur", saved: "Plan enregistré", print: "Imprimer ou enregistrer en PDF", explore: "Explorer le service recommandé", review: "Demander une revue gratuite",
    disclaimer: "Il s’agit d’un guide initial fondé sur vos réponses. ROALLA confirme la portée, la faisabilité, les dépendances, le prix et les mesures avant tout mandat.",
    names: { conversion: "Rafraîchissement de conversion du site", visibility: "Sprint d’amélioration de la visibilité", automation: "Sprint d’occasion d’automatisation", product: "Sprint de validation de produit numérique", event: "Sprint de préparation numérique à l’événement", managed: "Référence numérique et optimisation gérée" },
    reasons: { conversion: "Votre priorité dépend d’un parcours client plus clair et facile à utiliser avant de supposer qu’une reconstruction complète est nécessaire.", visibility: "Votre priorité dépend de la façon dont les personnes, moteurs de recherche et systèmes intelligents trouvent et comprennent l’entreprise.", automation: "Votre priorité touche un travail opérationnel récurrent. Une revue du flux et des exceptions peut confirmer la valeur pratique de l’automatisation.", product: "Votre priorité exige une nouvelle capacité numérique. La validation réduit le risque de financer des fonctions avant de clarifier le parcours et la valeur.", event: "Votre priorité repose sur une date fixe. L’expérience numérique, la collecte d’intérêt et le suivi doivent soutenir cette échéance.", managed: "Vous avez déjà un actif en ligne qui exige une référence, un carnet d’améliorations et un rythme de revue responsable." },
  },
} as const;

export default function DigitalValueBlueprint({ locale }: { locale: string }) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [goal, setGoal] = useState<DigitalGoal>("inquiries");
  const [stage, setStage] = useState<DigitalStage>("idea");
  const [barrier, setBarrier] = useState("");
  const [measure, setMeasure] = useState("");
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const recommendation = useMemo(() => recommendDigitalService(goal, stage), [goal, stage]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setComplete(true); setSaved(false);
    trackAnalyticsEvent("digital_blueprint_completed", { goal, stage, recommendation: recommendation.key });
    window.setTimeout(() => document.getElementById("digital-value-result")?.focus(), 0);
  }

  function save() {
    window.localStorage.setItem("roalla-digital-value-blueprint", JSON.stringify({ goal, stage, barrier, measure, recommendation, savedAt: new Date().toISOString() }));
    setSaved(true);
  }

  const goalText = t.goals[goal];
  const stageText = t.stages[stage];
  const contactGoal = `${t.report}: ${t.names[recommendation.key]}. ${goalText}. ${barrier}`.slice(0, 500);
  const contactHref = `/${locale}/contact?intent=${encodeURIComponent(recommendation.contactIntent)}&goal=${encodeURIComponent(contactGoal)}&from_page=${encodeURIComponent("/tools/digital-value-blueprint")}`;

  return <div className="space-y-8">
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 print:hidden">
      <fieldset><legend className="text-xl font-serif font-bold text-slate-950">{t.goalLabel}</legend><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(Object.keys(t.goals) as DigitalGoal[]).map((key) => <label key={key} className={`cursor-pointer rounded-xl border p-4 text-sm font-medium transition ${goal === key ? "border-primary bg-primary/[0.06] text-primary-dark" : "border-slate-200 text-slate-700 hover:border-primary/50"}`}><input className="sr-only" type="radio" name="goal" checked={goal === key} onChange={() => setGoal(key)} />{t.goals[key]}</label>)}</div></fieldset>
      <fieldset className="mt-7"><legend className="text-xl font-serif font-bold text-slate-950">{t.stageLabel}</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{(Object.keys(t.stages) as DigitalStage[]).map((key) => <label key={key} className={`cursor-pointer rounded-xl border p-4 text-sm font-medium transition ${stage === key ? "border-primary bg-primary/[0.06] text-primary-dark" : "border-slate-200 text-slate-700 hover:border-primary/50"}`}><input className="sr-only" type="radio" name="stage" checked={stage === key} onChange={() => setStage(key)} />{t.stages[key]}</label>)}</div></fieldset>
      <div className="mt-7 grid gap-5 md:grid-cols-2"><label className="block text-sm font-semibold text-slate-900">{t.barrierLabel}<textarea value={barrier} onChange={(e) => setBarrier(e.target.value)} maxLength={600} placeholder={t.barrierPlaceholder} className="mt-2 min-h-32 w-full rounded-lg border border-slate-300 p-3 font-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><label className="block text-sm font-semibold text-slate-900">{t.measureLabel}<textarea value={measure} onChange={(e) => setMeasure(e.target.value)} maxLength={400} placeholder={t.measurePlaceholder} className="mt-2 min-h-32 w-full rounded-lg border border-slate-300 p-3 font-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label></div>
      <button type="submit" className="mt-6 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"><Sparkles className="mr-2 h-5 w-5" aria-hidden />{t.submit}</button>
    </form>
    {complete ? <section id="digital-value-result" tabIndex={-1} className="space-y-6 outline-none" aria-live="polite"><article className="rounded-2xl border border-primary/20 bg-white p-6 shadow-lg sm:p-9"><div className="border-b border-slate-200 pb-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary-dark">{t.report}</p><h2 className="mt-2 text-3xl font-serif font-bold text-slate-950">{t.names[recommendation.key]}</h2><p className="mt-2 text-sm text-slate-600">{goalText} · {stageText}</p></div><div className="mt-7 grid gap-7 lg:grid-cols-2"><div><h3 className="text-xl font-serif font-bold text-slate-950">{t.why}</h3><p className="mt-3 leading-7 text-slate-700">{t.reasons[recommendation.key]}</p>{barrier ? <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700"><strong>{t.barrierLabel}</strong><br />{barrier}</p> : null}{measure ? <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700"><strong>{t.measureLabel}</strong><br />{measure}</p> : null}</div><div><h3 className="text-xl font-serif font-bold text-slate-950">{t.plan}</h3><ol className="mt-4 space-y-3">{t.actions.map((action, index) => <li key={action} className="flex gap-3 rounded-lg border border-slate-200 p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-dark">{index + 1}</span><div><p className="text-sm font-bold text-slate-900">{t.days[index]}</p><p className="mt-1 text-sm leading-6 text-slate-600">{action}</p></div></li>)}</ol></div></div><p className="mt-7 text-xs leading-5 text-slate-500">{t.disclaimer}</p><div className="mt-6 flex flex-wrap gap-3 print:hidden"><a href={`/${locale}${recommendation.path}`} className="inline-flex min-h-[48px] items-center rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">{t.explore}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></a><a href={contactHref} className="inline-flex min-h-[48px] items-center rounded-lg bg-brand-gold px-5 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light">{t.review}</a><button type="button" onClick={save} className="inline-flex min-h-[48px] items-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-primary"><LockKeyhole className="mr-2 h-4 w-4" aria-hidden />{saved ? t.saved : t.save}</button><button type="button" onClick={() => window.print()} className="inline-flex min-h-[48px] items-center px-4 py-3 text-sm font-semibold text-slate-700 underline underline-offset-4"><Download className="mr-2 h-4 w-4" aria-hidden />{t.print}</button></div><p className="mt-3 flex gap-2 text-xs text-slate-500 print:hidden"><LockKeyhole className="h-4 w-4 shrink-0" aria-hidden />{t.private}</p></article></section> : null}
  </div>;
}
