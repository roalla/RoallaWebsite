"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";

const matches = {
  focus: ["focus-circle", "Focus Circle", "Protect focused work and turn priorities into a practical weekly rhythm."],
  workload: ["workload-conversation", "The Workload Conversation", "Make workload tradeoffs visible and easier to discuss."],
  calm: ["digital-calm", "Digital Calm", "Reduce avoidable interruptions and set healthier communication norms."],
  decisions: ["decision-hour", "The Decision Hour", "Move a stuck decision forward with clear criteria and ownership."],
  offer: ["offer-page", "The One-Page Offer", "Clarify an offer so a buyer can understand the value quickly."],
  ideas: ["ideation", "The Shortlist", "Turn many ideas into a focused, testable shortlist."],
  first: ["first-offer", "Your First Offer", "Shape experience and expertise into a clear first service offer."],
} as const;

export default function WorkshopFinder({ locale }: { locale: string }) {
  const fr = locale === "fr";
  const [need, setNeed] = useState<keyof typeof matches>("focus");
  const result = matches[need];
  const labels: Array<[keyof typeof matches, string]> = [["focus", fr ? "Priorités et concentration" : "Priorities and focus"], ["workload", fr ? "Charge de travail" : "Workload pressure"], ["calm", fr ? "Interruptions et communication" : "Interruptions and communication"], ["decisions", fr ? "Décisions et réunions" : "Decisions and meetings"], ["offer", fr ? "Message ou offre" : "Message or offer"], ["ideas", fr ? "Trop d'idées" : "Too many ideas"], ["first", fr ? "Première offre de service" : "First service offer"]];
  return <section className="mb-14 rounded-2xl border border-primary/25 bg-white p-6 shadow-sm lg:p-8"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">{fr ? "Sélecteur d'atelier" : "Workshop finder"}</p><h2 className="mt-2 text-2xl font-serif font-bold text-slate-950">{fr ? "Quel problème voulez-vous améliorer?" : "What would you like your team to improve?"}</h2><div className="mt-5 grid gap-2">{labels.map(([value, label]) => <button key={value} type="button" onClick={() => { setNeed(value); trackAnalyticsEvent("workshop_finder_completed", { need: value }); }} className={`rounded-lg border px-4 py-3 text-left text-sm font-medium ${need === value ? "border-primary bg-primary/[.07] text-primary-dark" : "border-slate-200 text-slate-700 hover:border-primary/50"}`}>{label}</button>)}</div></div><div className="self-center rounded-xl bg-slate-950 p-6 text-white"><p className="text-xs font-semibold uppercase tracking-wider text-primary-light">{fr ? "Meilleur point de départ" : "Best starting point"}</p><h3 className="mt-2 text-2xl font-serif font-bold">{result[1]}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{result[2]}</p><Link href={`/programs/workshops/${result[0]}`} className="mt-5 inline-flex items-center font-semibold text-primary-light">{fr ? "Explorer cet atelier" : "Explore this workshop"}<ArrowRight className="ml-2 h-4 w-4" /></Link></div></div>
    <div className="mt-8 border-t border-slate-200 pt-7"><h3 className="text-lg font-serif font-bold text-slate-950">{fr ? "Choisissez le niveau de soutien" : "Choose the level of support"}</h3><div className="mt-4 grid gap-4 md:grid-cols-3">{[
      [fr ? "Session ciblée" : "Focused Session", fr ? "Un atelier pratique pour débloquer un besoin précis et repartir avec une prochaine étape." : "One practical workshop to unlock a specific need and leave with a next step."],
      [fr ? "Série appliquée" : "Applied Series", fr ? "Plusieurs sessions avec du temps pour appliquer, ajuster et renforcer les nouvelles pratiques." : "Several sessions with time to apply, adjust, and strengthen new practices."],
      [fr ? "Programme d'adoption" : "Team Adoption Program", fr ? "Ateliers, suivi et responsabilisation pour intégrer le changement dans le travail quotidien." : "Workshops, follow-through, and accountability to embed change in daily work."],
    ].map(([title, body]) => <div key={title} className="rounded-xl border border-slate-200 p-4"><CheckCircle className="h-5 w-5 text-primary-dark"/><p className="mt-3 font-bold text-slate-900">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></div>)}</div></div>
  </section>;
}
