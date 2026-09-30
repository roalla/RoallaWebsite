"use client";

import { useState } from "react";
import { ArrowRight, Calculator, Clock3, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { annualMeetingCost, annualWorkflowFriction, decisionDelayExposure } from "@/lib/business-advisory-tools";
import { trackAnalyticsEvent } from "@/lib/analytics";

const money = (value: number, locale: string) => new Intl.NumberFormat(locale, { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
const fieldClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900";

export default function AdvisoryValueCalculators({ locale }: { locale: string }) {
  const fr = locale === "fr";
  const [workflow, setWorkflow] = useState({ people: 6, hoursPerWeek: 3, hourlyCost: 55, recoverablePercent: 30 });
  const [meeting, setMeeting] = useState({ attendees: 6, hours: 1, meetingsPerMonth: 4, hourlyCost: 55 });
  const [delay, setDelay] = useState({ weeklyImpact: 2500, weeksDelayed: 6, avoidablePercent: 40 });
  const workflowResult = annualWorkflowFriction(workflow);
  const meetingResult = annualMeetingCost(meeting);
  const delayResult = decisionDelayExposure(delay);
  const update = (setter: React.Dispatch<React.SetStateAction<any>>, key: string, value: string) => {
    setter((current: Record<string, number>) => ({ ...current, [key]: Number(value) || 0 }));
    trackAnalyticsEvent("advisory_value_calculated", { calculator: key });
  };
  const cards = [
    { icon: Clock3, title: fr ? "Temps perdu dans les processus" : "Workflow friction", body: fr ? "Estimez la capacité qui pourrait être récupérée grâce à des responsabilités et des processus plus clairs." : "Estimate capacity that clearer ownership and processes may recover.", inputs: [["people", fr ? "Personnes touchées" : "People affected"], ["hoursPerWeek", fr ? "Heures perdues par personne, par semaine" : "Hours lost per person each week"], ["hourlyCost", fr ? "Coût horaire moyen" : "Average hourly cost"], ["recoverablePercent", fr ? "Part possiblement récupérable (%)" : "Potentially recoverable (%)"]], state: workflow, setter: setWorkflow, result: money(workflowResult.potentialCapacityValue, locale), resultLabel: fr ? "Valeur annuelle de capacité possible" : "Potential annual capacity value" },
    { icon: Users, title: fr ? "Coût des réunions" : "Meeting cost", body: fr ? "Voyez le coût annuel du temps consacré à une réunion récurrente." : "See the annual time cost of one recurring meeting.", inputs: [["attendees", fr ? "Participants" : "Attendees"], ["hours", fr ? "Durée en heures" : "Meeting length in hours"], ["meetingsPerMonth", fr ? "Réunions par mois" : "Meetings per month"], ["hourlyCost", fr ? "Coût horaire moyen" : "Average hourly cost"]], state: meeting, setter: setMeeting, result: money(meetingResult, locale), resultLabel: fr ? "Coût annuel estimé" : "Estimated annual cost" },
    { icon: Calculator, title: fr ? "Coût d'une décision retardée" : "Decision delay exposure", body: fr ? "Explorez la valeur qui peut être exposée lorsqu'une décision importante attend." : "Explore the value that may be exposed while an important decision waits.", inputs: [["weeklyImpact", fr ? "Impact estimé par semaine" : "Estimated weekly impact"], ["weeksDelayed", fr ? "Semaines de retard" : "Weeks delayed"], ["avoidablePercent", fr ? "Part possiblement évitable (%)" : "Potentially avoidable (%)"]], state: delay, setter: setDelay, result: money(delayResult.potentiallyAvoidable, locale), resultLabel: fr ? "Exposition possiblement évitable" : "Potentially avoidable exposure" },
  ];
  return <div>
    <div className="grid gap-6 lg:grid-cols-3">{cards.map(({ icon: Icon, ...card }) => <section key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <Icon className="h-7 w-7 text-primary-dark" aria-hidden /><h2 className="mt-4 text-xl font-serif font-bold text-slate-950">{card.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
      <div className="mt-5 space-y-3">{card.inputs.map(([key, label]) => <label key={key} className="block text-sm font-medium text-slate-700">{label}<input type="number" min="0" value={(card.state as any)[key]} onChange={(e) => update(card.setter, key, e.target.value)} className={fieldClass} /></label>)}</div>
      <div className="mt-6 rounded-xl bg-primary/[.07] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-primary-dark">{card.resultLabel}</p><p className="mt-1 text-3xl font-bold text-slate-950">{card.result}</p></div>
    </section>)}</div>
    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950"><p><strong>{fr ? "À propos de ces résultats :" : "About these results:"}</strong> {fr ? "Il s'agit d'estimations de planification fondées uniquement sur vos hypothèses. Elles ne représentent pas des économies garanties, un devis ou une analyse financière." : "These are planning estimates based only on your assumptions. They are not guaranteed savings, a quote, or financial advice."}</p><Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "business-value" } }} className="mt-4 inline-flex items-center font-semibold text-primary-dark hover:underline">{fr ? "Examiner le scénario avec ROALLA" : "Review the scenario with ROALLA"}<ArrowRight className="ml-2 h-4 w-4" /></Link></div>
  </div>;
}
