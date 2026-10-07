"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { ExecutiveGuide, ExecutiveGuideCategory } from "@/lib/executive-guides";

type Filter = "all" | ExecutiveGuideCategory;
type Props = { locale: "en" | "fr"; guides: readonly ExecutiveGuide[] };

const content = {
  en: {
    eyebrow: "ROALLA Executive Insights",
    headline: "Clarity for the decisions that shape what comes next.",
    lede: "Practical executive guides that turn complex questions about growth, AI, technology, risk and enterprise value into confident, sequenced action.",
    explore: "Explore the library",
    discuss: "Discuss your priorities",
    builtFor: "Built for executive decisions",
    decisionSteps: [
      ["Frame the decision", "See the issue in commercial and operational terms."],
      ["Test readiness", "Identify gaps, dependencies and avoidable risk."],
      ["Sequence action", "Move from ambition to a realistic path forward."],
    ],
    featured: "Featured perspective",
    featuredHeadline: "AI ambition is easy. Operational readiness is the advantage.",
    featuredOutcomes: ["Separate high-value use cases from attractive distractions", "Expose governance and data dependencies early", "Build a practical path from pilot to operating capability"],
    getGuide: "Get the executive guide",
    library: "The decision library",
    libraryHeadline: "Explore by executive priority.",
    libraryIntro: "Each perspective sharpens the questions leaders ask before committing capital, changing the operating model or beginning a transformation.",
    filters: { all: "All guides", ai: "AI & automation", growth: "Growth & revenue", technology: "Technology", risk: "Risk & resilience", operations: "Operations", value: "Enterprise value" },
    exploreGuide: "Explore the guide",
    fromInsight: "From insight to action",
    approachHeadline: "A guide should begin a better decision—not end as another download.",
    approach: [["Understand", "Frame the issue around business outcomes, executive priorities and material constraints."], ["Assess", "Establish readiness, expose dependencies and distinguish symptoms from root causes."], ["Prioritize", "Build the investment logic and sequence initiatives by value, risk and feasibility."], ["Activate", "Coordinate architecture, partners, governance and execution around a practical roadmap."]],
    conversation: "A confidential executive conversation",
    conversationHeadline: "Which decision is creating the most friction in your organization?",
    conversationBody: "Bring the question, initiative or constraint. ROALLA will help clarify the decision, identify what must be true and determine the most useful next step.",
    startConversation: "Start a conversation",
    formTitle: "Get the executive guide.",
    formIntro: "Receive the selected guide and its executive readiness framework.",
    firstName: "First name", lastName: "Last name", email: "Business email", company: "Company", role: "Role",
    priority: "What decision or priority are you working through?",
    consent: "Send me occasional ROALLA executive insights. I can unsubscribe at any time.",
    privacy: "ROALLA will use your information to provide the requested guide and respond to your inquiry. Marketing updates are optional.",
    submit: "Get the guide", sending: "Preparing your guide…", success: "Your guide is ready.",
    successBody: "Use the secure link below to download it. The link expires in 48 hours.",
    emailUnavailable: "The confirmation email could not be sent. Use the download button on this page.",
    download: "Download the guide", close: "Return to insights",
    error: "We could not prepare the guide right now. Please try again or contact sales@roalla.com.",
    englishNote: "The complete PDF guide is currently available in English.",
  },
  fr: {
    eyebrow: "Perspectives ROALLA pour dirigeants",
    headline: "La clarté pour les décisions qui façonnent la suite.",
    lede: "Des guides pratiques qui transforment les questions complexes sur la croissance, l’IA, la technologie, le risque et la valeur en actions confiantes et ordonnées.",
    explore: "Explorer la bibliothèque", discuss: "Discuter de vos priorités", builtFor: "Conçu pour les décisions de direction",
    decisionSteps: [["Cadrer la décision", "Voir l’enjeu sous l’angle commercial et opérationnel."], ["Tester la préparation", "Repérer les écarts, les dépendances et les risques évitables."], ["Ordonner l’action", "Passer de l’ambition à une voie réaliste."]],
    featured: "Perspective en vedette", featuredHeadline: "L’ambition en IA est facile. La préparation opérationnelle crée l’avantage.",
    featuredOutcomes: ["Distinguer les cas d’usage à forte valeur des distractions", "Exposer tôt les dépendances de gouvernance et de données", "Créer une voie pratique du projet pilote à la capacité opérationnelle"],
    getGuide: "Obtenir le guide", library: "La bibliothèque décisionnelle", libraryHeadline: "Explorer par priorité de direction.",
    libraryIntro: "Chaque perspective affine les questions à poser avant d’engager des capitaux, de modifier le modèle opérationnel ou de lancer une transformation.",
    filters: { all: "Tous les guides", ai: "IA et automatisation", growth: "Croissance et revenus", technology: "Technologie", risk: "Risque et résilience", operations: "Opérations", value: "Valeur d’entreprise" },
    exploreGuide: "Explorer le guide", fromInsight: "De la perspective à l’action", approachHeadline: "Un guide devrait amorcer une meilleure décision, pas finir comme un autre téléchargement.",
    approach: [["Comprendre", "Cadrer l’enjeu autour des résultats, des priorités et des contraintes."], ["Évaluer", "Établir la préparation, exposer les dépendances et distinguer les symptômes des causes."], ["Prioriser", "Construire la logique d’investissement et ordonner les initiatives selon la valeur, le risque et la faisabilité."], ["Activer", "Coordonner l’architecture, les partenaires, la gouvernance et l’exécution autour d’une feuille de route."]],
    conversation: "Une conversation confidentielle avec la direction", conversationHeadline: "Quelle décision crée le plus de friction dans votre organisation?",
    conversationBody: "Apportez la question, l’initiative ou la contrainte. ROALLA vous aidera à clarifier la décision, les conditions de réussite et la prochaine étape utile.", startConversation: "Commencer une conversation",
    formTitle: "Obtenir le guide.", formIntro: "Recevez le guide sélectionné et son cadre de préparation pour dirigeants.", firstName: "Prénom", lastName: "Nom", email: "Courriel professionnel", company: "Entreprise", role: "Rôle",
    priority: "Sur quelle décision ou priorité travaillez-vous?", consent: "Envoyez-moi occasionnellement les perspectives de ROALLA. Je peux me désabonner en tout temps.",
    privacy: "ROALLA utilisera vos renseignements pour fournir le guide demandé et répondre à votre demande. Les communications marketing sont facultatives.", submit: "Obtenir le guide", sending: "Préparation du guide…", success: "Votre guide est prêt.",
    successBody: "Utilisez le lien sécurisé ci-dessous. Il expire dans 48 heures.",
    emailUnavailable: "Le courriel de confirmation n’a pas pu être envoyé. Utilisez le bouton de téléchargement sur cette page.",
    download: "Télécharger le guide", close: "Retourner aux perspectives", error: "Nous ne pouvons pas préparer le guide maintenant. Réessayez ou écrivez à sales@roalla.com.", englishNote: "Le guide PDF complet est actuellement offert en anglais.",
  },
} as const;

export default function ExecutiveInsightsLibrary({ locale, guides }: Props) {
  const c = content[locale];
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<ExecutiveGuide | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [emailSent, setEmailSent] = useState(true);
  const featured = guides.find((guide) => guide.featured) ?? guides[0];
  const visible = useMemo(() => filter === "all" ? guides : guides.filter((guide) => guide.category === filter), [filter, guides]);

  function openGuide(guide: ExecutiveGuide) {
    setSelected(guide); setError(""); setDownloadUrl(""); setEmailSent(true);
    trackAnalyticsEvent("executive_guide_cta_click", { guide: guide.slug });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setSubmitting(true); setError("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/executive-guides/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, guide: selected.slug, locale, updates: new FormData(form).get("updates") === "on", sourcePage: window.location.href }) });
      const result = await response.json() as { downloadUrl?: string; emailSent?: boolean; error?: string };
      if (!response.ok || !result.downloadUrl) throw new Error(result.error || c.error);
      setDownloadUrl(result.downloadUrl);
      setEmailSent(result.emailSent !== false);
      trackAnalyticsEvent("executive_guide_request", { guide: selected.slug, locale });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : c.error);
    } finally { setSubmitting(false); }
  }

  return <>
    <section className="relative isolate overflow-hidden bg-[#090b0e] px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
      <Image src="/images/executive-insights/hero.avif" alt="" fill priority sizes="100vw" className="-z-30 object-cover object-center opacity-45" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#050608] via-[#050608]/95 to-[#050608]/70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/65" />
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.24em] text-primary-light">{c.eyebrow}</p><h1 className="mt-7 max-w-4xl font-serif text-5xl font-normal leading-[.98] tracking-[-.04em] text-white [text-shadow:_0_3px_24px_rgb(0_0_0_/_95%)] sm:text-6xl lg:text-8xl">{c.headline}</h1><p className="mt-8 max-w-2xl border-l-2 border-primary bg-black/45 px-5 py-3 text-lg leading-8 text-slate-100 backdrop-blur-[2px]">{c.lede}</p><div className="mt-10 flex flex-wrap gap-3"><a href="#executive-library" className="inline-flex min-h-12 items-center gap-8 bg-primary px-6 text-sm font-bold text-slate-950">{c.explore}<ArrowDownRight className="h-4 w-4" /></a><Link href="/contact" className="inline-flex min-h-12 items-center border border-white/40 bg-black/35 px-6 text-sm font-bold text-white backdrop-blur-[2px] hover:bg-white/10">{c.discuss}</Link></div></div>
        <div className="border-l border-white/20 pl-7"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">{c.builtFor}</p><ol className="mt-5">{c.decisionSteps.map((step, index) => <li key={step[0]} className="grid grid-cols-[32px_1fr] gap-3 border-t border-white/15 py-5"><span className="text-xs font-bold text-primary">0{index + 1}</span><div><strong className="font-serif text-xl font-normal">{step[0]}</strong><p className="mt-1 text-sm leading-6 text-slate-400">{step[1]}</p></div></li>)}</ol></div>
      </div>
    </section>

    <main>
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-primary-dark">{c.featured}</p><h2 className="mt-5 max-w-4xl font-serif text-4xl font-normal leading-tight tracking-[-.035em] text-slate-950 sm:text-5xl">{c.featuredHeadline}</h2>
        <article className="mt-12 grid overflow-hidden bg-[#0b0d10] text-white lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[360px]"><Image src={featured.image} alt="" fill sizes="(min-width:1024px) 52vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/10 to-black/65" /><span className="absolute left-6 top-6 bg-black/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em] shadow-lg">Executive guide · 2026</span></div>
          <div className="flex flex-col p-7 sm:p-10 lg:p-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">{featured[locale].categoryLabel}</p><h3 className="mt-5 font-serif text-4xl font-normal leading-tight text-white [text-shadow:_0_2px_14px_rgb(0_0_0_/_90%)]">{featured[locale].title}</h3><p className="mt-5 leading-7 text-slate-300">{featured[locale].summary}</p><ul className="mt-8 border-t border-white/15 py-5">{c.featuredOutcomes.map(item => <li key={item} className="flex gap-3 py-2 text-sm text-slate-200"><span className="mt-1.5 h-2 w-2 shrink-0 border border-primary" />{item}</li>)}</ul><button type="button" onClick={() => openGuide(featured)} className="mt-auto flex items-center justify-between border-t border-white/20 pt-5 text-left text-sm font-bold text-white">{c.getGuide}<ArrowRight className="h-5 w-5 text-primary" /></button></div>
        </article>
      </section>

      <section id="executive-library" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-28 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-primary-dark">{c.library}</p><h2 className="mt-5 font-serif text-4xl font-normal tracking-[-.035em] text-slate-950 sm:text-5xl">{c.libraryHeadline}</h2></div><p className="leading-7 text-slate-600">{c.libraryIntro}</p></div>
        <div className="mt-12 flex gap-2 overflow-x-auto pb-2" role="group" aria-label={c.library}>{(Object.keys(c.filters) as Filter[]).map(key => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} className={`whitespace-nowrap border px-4 py-3 text-xs font-semibold transition ${filter === key ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-transparent text-slate-700 hover:border-slate-950"}`}>{c.filters[key]}{key === "all" ? <span className="ml-2 text-slate-400">{guides.length}</span> : null}</button>)}</div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visible.map(guide => <article key={guide.slug} className="group flex min-h-[500px] flex-col border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-56 overflow-hidden bg-slate-950"><Image src={guide.image} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/90" /><span className="absolute bottom-5 left-5 bg-black/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-white shadow-md backdrop-blur-[2px]">{guide[locale].categoryLabel}</span></div><div className="flex flex-1 flex-col p-6"><p className="text-[10px] font-bold tracking-[.16em] text-slate-400">{guide.number}</p><h3 className="mt-5 font-serif text-2xl font-normal leading-tight text-slate-950">{guide[locale].title}</h3><p className="mt-4 text-sm leading-6 text-slate-600">{guide[locale].summary}</p><button type="button" onClick={() => openGuide(guide)} className="mt-auto flex w-full items-center justify-between border-t border-slate-200 pt-5 text-left text-xs font-bold text-slate-900">{c.exploreGuide}<ArrowUpRight className="h-4 w-4 text-primary-dark" /></button></div></article>)}</div>
      </section>

      <section className="bg-[#090b0e] px-4 py-24 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[.45fr_1.55fr]"><p className="text-xs font-bold uppercase tracking-[.22em] text-primary-light">{c.fromInsight}</p><h2 className="font-serif text-4xl font-normal leading-tight tracking-[-.035em] text-white sm:text-6xl">{c.approachHeadline}</h2></div><div className="mt-16 grid border-t border-white/20 md:grid-cols-2 lg:grid-cols-4">{c.approach.map((item,index) => <article key={item[0]} className="border-b border-white/20 py-8 md:px-6 md:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0"><span className="text-xs font-bold text-primary">0{index + 1}</span><h3 className="mt-8 font-serif text-2xl font-normal text-white">{item[0]}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{item[1]}</p></article>)}</div></div></section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:px-8 lg:py-32"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-primary-dark">{c.conversation}</p><h2 className="mt-5 font-serif text-4xl font-normal leading-tight tracking-[-.035em] text-slate-950 sm:text-5xl">{c.conversationHeadline}</h2></div><div><p className="leading-7 text-slate-600">{c.conversationBody}</p><Link href="/contact" onClick={() => trackAnalyticsEvent("executive_conversation_click")} className="mt-8 inline-flex min-h-12 items-center gap-8 bg-slate-950 px-6 text-sm font-bold text-white">{c.startConversation}<ArrowUpRight className="h-4 w-4" /></Link></div></section>
    </main>

    <Dialog open={Boolean(selected)} onClose={() => !submitting && setSelected(null)} className="relative z-[100]">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8"><div className="flex min-h-full items-center justify-center"><DialogPanel className="relative w-full max-w-2xl bg-[#f4f3ef] p-6 shadow-2xl sm:p-10"><button type="button" onClick={() => setSelected(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center text-slate-700" aria-label="Close"><X className="h-5 w-5" /></button><div className="mb-7 grid h-14 w-14 place-items-center bg-slate-950"><Image src="/logo.svg" alt="" width={36} height={36} /></div>
        {!downloadUrl ? <><p className="text-xs font-bold uppercase tracking-[.2em] text-primary-dark">{c.eyebrow}</p><DialogTitle className="mt-5 font-serif text-4xl font-normal tracking-[-.03em] text-slate-950">{c.formTitle}</DialogTitle><p className="mt-4 leading-7 text-slate-600">{c.formIntro} <strong>{selected?.[locale].title}</strong>.</p>{locale === "fr" ? <p className="mt-2 text-sm font-medium text-slate-500">{c.englishNote}</p> : null}
          <form onSubmit={submit} className="mt-8 grid gap-4"><input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" /><div className="grid gap-4 sm:grid-cols-2"><Field name="firstName" label={c.firstName} required /><Field name="lastName" label={c.lastName} required /></div><Field name="email" label={c.email} type="email" required /><div className="grid gap-4 sm:grid-cols-2"><Field name="company" label={c.company} required /><Field name="role" label={c.role} required /></div><label className="grid gap-2 text-xs font-bold text-slate-700">{c.priority}<textarea name="priority" rows={3} maxLength={1000} className="border border-slate-300 bg-white px-3 py-3 text-base font-normal text-slate-950 outline-none focus:border-primary" /></label><label className="flex items-start gap-3 text-xs leading-5 text-slate-600"><input type="checkbox" name="updates" className="mt-1 h-4 w-4 accent-primary" />{c.consent}</label>{error ? <p role="alert" className="text-sm font-semibold text-red-700">{error}</p> : null}<button type="submit" disabled={submitting} className="mt-1 inline-flex min-h-12 items-center justify-center gap-6 bg-slate-950 px-6 text-sm font-bold text-white disabled:opacity-60">{submitting ? c.sending : c.submit}<ArrowRight className="h-4 w-4" /></button><p className="text-[11px] leading-5 text-slate-500">{c.privacy}</p></form></> : <div className="py-8 text-center"><span className="mx-auto grid h-16 w-16 place-items-center bg-primary text-slate-950"><Check className="h-7 w-7" /></span><DialogTitle className="mt-6 font-serif text-4xl font-normal text-slate-950">{c.success}</DialogTitle><p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">{c.successBody}</p>{emailSent ? null : <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-amber-800">{c.emailUnavailable}</p>}<a href={downloadUrl} onClick={() => trackAnalyticsEvent("executive_guide_download", { guide: selected?.slug })} className="mt-8 inline-flex min-h-12 items-center gap-6 bg-slate-950 px-6 text-sm font-bold text-white">{c.download}<ArrowDownRight className="h-4 w-4" /></a><button type="button" onClick={() => setSelected(null)} className="mx-auto mt-5 block text-sm font-semibold text-primary-dark hover:underline">{c.close}</button></div>}
      </DialogPanel></div></div>
    </Dialog>
  </>;
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700">{label}<input name={name} type={type} required={required} maxLength={160} className="border border-slate-300 bg-white px-3 py-3 text-base font-normal text-slate-950 outline-none focus:border-primary" /></label>;
}
