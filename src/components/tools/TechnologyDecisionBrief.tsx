"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Download, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { technologyDecisionPriorities, type TechnologyBriefInput } from "@/lib/business-advisory-tools";
import { trackAnalyticsEvent } from "@/lib/analytics";

const initial: TechnologyBriefInput = { objective: "replace", urgency: "planned", dataSensitivity: "standard", integrations: "few", adoption: "department" };
const selectClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900";

export default function TechnologyDecisionBrief({ locale }: { locale: string }) {
  const fr = locale === "fr";
  const [input, setInput] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setInput({ ...initial, ...JSON.parse(localStorage.getItem("roalla-technology-decision-brief") || "{}") }); } catch {} setReady(true); }, []);
  const priorities = technologyDecisionPriorities(input);
  const translatedPriority = (value: string) => fr ? ({
    "Business outcome and measurable requirements": "Résultat d'affaires et exigences mesurables",
    "Total cost, contract commitments, and exit options": "Coût total, engagements contractuels et options de sortie",
    "Security, privacy, compliance, and data handling review": "Examen de la sécurité, de la confidentialité, de la conformité et des données",
    "Integration, migration, data quality, and failure-path review": "Examen des intégrations, de la migration, de la qualité des données et des scénarios d'échec",
    "Adoption, training, support, and accountable ownership": "Adoption, formation, soutien et responsabilité claire",
    "Transition risk, interim controls, and realistic decision milestones": "Risques de transition, contrôles temporaires et étapes réalistes",
  } as Record<string, string>)[value] ?? value : value;
  const update = (key: keyof TechnologyBriefInput, value: string) => setInput((current) => ({ ...current, [key]: value } as TechnologyBriefInput));
  const save = () => { localStorage.setItem("roalla-technology-decision-brief", JSON.stringify(input)); trackAnalyticsEvent("technology_brief_completed", { objective: input.objective }); };
  const fields: Array<{ key: keyof TechnologyBriefInput; label: string; options: Array<[string, string]> }> = [
    { key: "objective", label: fr ? "Que devez-vous accomplir?" : "What do you need to accomplish?", options: [["replace", fr ? "Remplacer un outil" : "Replace a tool"], ["consolidate", fr ? "Regrouper plusieurs outils" : "Consolidate tools"], ["introduce", fr ? "Ajouter une nouvelle capacité" : "Introduce a new capability"], ["renew", fr ? "Évaluer un renouvellement" : "Review a renewal"]] },
    { key: "urgency", label: fr ? "Quand la décision est-elle nécessaire?" : "When is the decision needed?", options: [["planned", fr ? "Planification à long terme" : "Long-range planning"], ["six-months", fr ? "Dans les six mois" : "Within six months"], ["three-months", fr ? "Dans les trois mois" : "Within three months"], ["urgent", fr ? "Urgent" : "Urgent"]] },
    { key: "dataSensitivity", label: fr ? "Quel type de données sera traité?" : "What kind of data is involved?", options: [["standard", fr ? "Données d'affaires courantes" : "Standard business data"], ["personal", fr ? "Renseignements personnels" : "Personal information"], ["regulated", fr ? "Données réglementées" : "Regulated data"], ["critical", fr ? "Données essentielles ou très sensibles" : "Critical or highly sensitive data"]] },
    { key: "integrations", label: fr ? "Quel niveau d'intégration est requis?" : "How much integration is required?", options: [["none", fr ? "Aucune" : "None"], ["few", fr ? "Quelques systèmes" : "A few systems"], ["several", fr ? "Plusieurs systèmes" : "Several systems"], ["complex", fr ? "Environnement complexe" : "Complex environment"]] },
    { key: "adoption", label: fr ? "Qui devra utiliser la solution?" : "Who must adopt the solution?", options: [["small", fr ? "Petite équipe" : "Small team"], ["department", fr ? "Un service" : "A department"], ["organization", fr ? "Toute l'organisation" : "The organization"], ["external", fr ? "Employés et utilisateurs externes" : "Employees and external users"]] },
  ];
  return <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-serif font-bold text-slate-950">{fr ? "Votre contexte" : "Your decision context"}</h2><div className="mt-5 space-y-4">{fields.map((field) => <label key={field.key} className="block text-sm font-semibold text-slate-700">{field.label}<select value={input[field.key]} onChange={(e) => update(field.key, e.target.value)} className={selectClass}>{field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>)}</div></section>
    <section className="rounded-2xl border border-primary/25 bg-white p-6 shadow-sm"><ShieldCheck className="h-8 w-8 text-primary-dark" /><h2 className="mt-4 text-2xl font-serif font-bold text-slate-950">{fr ? "Priorités de décision recommandées" : "Recommended decision priorities"}</h2><ol className="mt-5 space-y-3">{priorities.map((item, index) => <li key={item} className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><span className="font-bold text-primary-dark">{index + 1}</span>{translatedPriority(item)}</li>)}</ol><div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm leading-6 text-slate-700"><strong>{fr ? "Processus suggéré :" : "Suggested process:"}</strong> {fr ? "Confirmer les besoins, comparer les options, vérifier les risques et les coûts, puis planifier l'adoption." : "Confirm requirements, compare options, verify risk and cost, then plan adoption."}</div>
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" disabled={!ready} onClick={() => { save(); window.print(); }} className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"><Download className="mr-2 h-4 w-4" />{fr ? "Enregistrer et imprimer" : "Save and print"}</button><Link href={{ pathname: "/contact", query: { intent: "consulting", focus: "technology-decision" } }} onClick={save} className="inline-flex items-center rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary-dark">{fr ? "Demander un examen indépendant" : "Request an independent review"}<ArrowRight className="ml-2 h-4 w-4" /></Link></div>
      <p className="mt-5 text-xs leading-5 text-slate-500">{fr ? "ROALLA peut recevoir une rémunération de certains fournisseurs si vous choisissez d'acheter par notre intermédiaire. Nous le confirmons avant toute recommandation. Cette fiche ne recommande aucun fournisseur et ne remplace pas un examen de sécurité, juridique ou financier." : "ROALLA may receive compensation from some providers if you choose to purchase through us. We confirm this before any recommendation. This brief does not recommend a provider or replace security, legal, or financial review."}</p>
    </section>
  </div>;
}
