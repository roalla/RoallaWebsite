"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Download, LockKeyhole, Sparkles } from "lucide-react";
import {
  SCALE_SEAT_DEFAULTS,
  buildCommunicationsValueBrief,
  type CommunicationsApproachKey,
  type CommunicationsFriction,
  type CommunicationsScale,
  type CommunicationsScope,
  type CommunicationsSituation,
  type CommunicationsUrgency,
  type CommunicationsValueBriefInput,
} from "@/lib/communications-value-brief";
import { trackAnalyticsEvent } from "@/lib/analytics";

const money = (value: number, locale: string) =>
  new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);

const MAX_FRICTIONS = 3;

const approachCopy = {
  en: {
    names: {
      "pots-modernization": "Legacy phone modernization path",
      "provider-value-review": "Current provider value review",
      "contact-centre-readiness": "Contact centre readiness path",
      "unified-stack-rationalization": "Communications stack rationalization",
    } as Record<CommunicationsApproachKey, string>,
    reasons: {
      "pots-modernization":
        "Your answers point to plain old telephone or a legacy PBX. A needs-led cloud calling and contact path can reduce line cost, recover missed reach, and prepare a controlled cutover—without locking you into a vendor pitch first.",
      "provider-value-review":
        "You already have a modern or cloud stack, but renewal or value is unclear. A structured review of spend, unused features, contract terms, and real requirements often recovers more than another feature demo.",
      "contact-centre-readiness":
        "Queues, abandoned interactions, CRM, or recording are in scope. Clarifying journeys and agent workflows before comparing options reduces expensive misfits and builds a shortlist around outcomes—not brand names.",
      "unified-stack-rationalization":
        "Overlapping tools are creating cost and confusion. Collapsing to one decision path—covering calling, collaboration, and contact needs—usually beats stacking another licence.",
    } as Record<CommunicationsApproachKey, string>,
  },
  fr: {
    names: {
      "pots-modernization": "Parcours de modernisation du téléphone traditionnel",
      "provider-value-review": "Revue de valeur des fournisseurs actuels",
      "contact-centre-readiness": "Parcours de préparation du centre de contact",
      "unified-stack-rationalization": "Rationalisation de la pile de communications",
    } as Record<CommunicationsApproachKey, string>,
    reasons: {
      "pots-modernization":
        "Vos réponses indiquent un téléphone traditionnel ou un PBX héritage. Un parcours d’appels et de contact infonuagique fondé sur les besoins peut réduire le coût des lignes, récupérer les appels manqués et préparer une bascule contrôlée—sans pitch fournisseur d’abord.",
      "provider-value-review":
        "Vous avez déjà une pile moderne ou infonuagique, mais le renouvellement ou la valeur est flou. Une revue structurée des coûts, fonctions inutilisées, contrats et exigences réelles récupère souvent plus qu’une autre démo.",
      "contact-centre-readiness":
        "Les files, abandons, CRM ou enregistrement sont en jeu. Clarifier les parcours et le travail des agents avant de comparer réduit les mauvais choix coûteux et bâtit une liste restreinte autour des résultats—pas des marques.",
      "unified-stack-rationalization":
        "Des outils qui se chevauchent créent coût et confusion. Condenser vers un seul parcours décisionnel—appels, collaboration et contact—bat généralement l’ajout d’une autre licence.",
    } as Record<CommunicationsApproachKey, string>,
  },
} as const;

const priorityFr: Record<string, string> = {
  "Business outcome and measurable calling or contact requirements":
    "Résultat d’affaires et exigences mesurables d’appels ou de contact",
  "Total cost, contract commitments, and exit options":
    "Coût total, engagements contractuels et options de sortie",
  "Number porting, migration sequencing, and interim coverage":
    "Portabilité des numéros, séquence de migration et couverture temporaire",
  "Queue design, CRM handoffs, and reporting that agents will actually use":
    "Conception des files, transferts CRM et rapports que les agents utiliseront vraiment",
  "Recording, retention, privacy, and compliance controls":
    "Enregistrement, conservation, confidentialité et contrôles de conformité",
  "Mobility, adoption, training, and accountable day-to-day ownership":
    "Mobilité, adoption, formation et responsabilité quotidienne claire",
  "Transition risk, interim controls, and realistic decision milestones":
    "Risques de transition, contrôles temporaires et étapes réalistes",
};

const copy = {
  en: {
    situationLabel: "What describes your communications setup today?",
    situations: {
      "pots-legacy": "Plain old telephone, copper lines, or a legacy on-prem phone system",
      "current-cloud-unsure": "We have cloud calling or contact tools, but value is unclear",
      fragmented: "Several overlapping calling, meeting, and contact tools",
      renewal: "A renewal or contract decision is coming up",
    },
    scopeLabel: "What do you need to cover?",
    scopes: {
      uc: "Internal calling and collaboration",
      cc: "Customer queues, IVR, or agents",
      both: "Both internal calling and customer contact",
    },
    scaleLabel: "Roughly how many people are involved?",
    scales: {
      "1-10": "1–10",
      "11-50": "11–50",
      "51-200": "51–200",
      "200-plus": "200+",
    },
    frictionLabel: "Where does friction show up most? (choose up to 3)",
    frictions: {
      "missed-calls": "Missed or abandoned calls",
      "high-line-cost": "High line or seat cost",
      "no-mobility": "No reliable mobile or remote calling",
      "no-crm": "No useful CRM or ticket handoff",
      "recording-compliance": "Recording, retention, or compliance gaps",
      "fragmented-tools": "Too many overlapping tools",
      "poor-reporting": "Weak reporting or visibility",
      "contract-lock-in": "Contract lock-in or unclear exit",
    },
    urgencyLabel: "When do you need a decision?",
    urgencies: {
      exploring: "Exploring / no fixed date",
      "six-months": "Within six months",
      "three-months": "Within three months",
      urgent: "Urgent",
    },
    numbersLabel: "Planning numbers (editable)",
    monthlySpend: "Monthly communications spend (CAD)",
    seatCount: "Users, seats, or agents",
    missedPerWeek: "Missed or abandoned interactions per week",
    valuePerMissed: "Approximate value per missed interaction (CAD)",
    submit: "Create my communications value brief",
    report: "ROALLA Communications Value Brief",
    why: "Why this approach fits",
    valueTitle: "Indicative annual opportunity",
    valueSpend: "From current spend assumptions",
    valueMissed: "From missed or abandoned interactions",
    priorities: "Decision priorities",
    plan: "Your 30, 60, and 90-day engagement direction",
    days: ["First 30 days", "By 60 days", "By 90 days"],
    private: "This brief stays in your browser unless you choose to send it to ROALLA.",
    save: "Save this brief in my browser",
    saved: "Brief saved",
    print: "Print or save as PDF",
    review: "Request a free communications review",
    estimateNote:
      "These are planning estimates based only on your assumptions. They are not guaranteed savings, a quote, or financial advice.",
    disclaimer:
      "This is an initial planning guide based on your answers. ROALLA confirms scope, feasibility, dependencies, pricing, and expected measures before any engagement. ROALLA may receive compensation from some providers if you choose to purchase through us. We confirm this before any recommendation. This brief does not recommend a provider or replace security, legal, or financial review.",
    liveHint: "Indicative opportunity updates as you adjust the numbers.",
  },
  fr: {
    situationLabel: "Qu’est-ce qui décrit votre configuration de communications aujourd’hui?",
    situations: {
      "pots-legacy": "Téléphone traditionnel, lignes cuivre ou système téléphonique sur site héritage",
      "current-cloud-unsure": "Nous avons des outils d’appels ou de contact infonuagiques, mais la valeur est floue",
      fragmented: "Plusieurs outils d’appels, de réunions et de contact qui se chevauchent",
      renewal: "Un renouvellement ou une décision contractuelle approche",
    },
    scopeLabel: "Que devez-vous couvrir?",
    scopes: {
      uc: "Appels internes et collaboration",
      cc: "Files clients, SVI ou agents",
      both: "Appels internes et contact client",
    },
    scaleLabel: "Environ combien de personnes sont concernées?",
    scales: {
      "1-10": "1–10",
      "11-50": "11–50",
      "51-200": "51–200",
      "200-plus": "200+",
    },
    frictionLabel: "Où la friction apparaît-elle le plus? (jusqu’à 3)",
    frictions: {
      "missed-calls": "Appels manqués ou abandonnés",
      "high-line-cost": "Coût élevé des lignes ou sièges",
      "no-mobility": "Pas d’appels mobiles ou à distance fiables",
      "no-crm": "Pas de transfert CRM ou ticket utile",
      "recording-compliance": "Lacunes d’enregistrement, conservation ou conformité",
      "fragmented-tools": "Trop d’outils qui se chevauchent",
      "poor-reporting": "Rapports ou visibilité faibles",
      "contract-lock-in": "Verrouillage contractuel ou sortie floue",
    },
    urgencyLabel: "Quand faut-il une décision?",
    urgencies: {
      exploring: "Exploration / pas de date fixe",
      "six-months": "Dans les six mois",
      "three-months": "Dans les trois mois",
      urgent: "Urgent",
    },
    numbersLabel: "Chiffres de planification (modifiables)",
    monthlySpend: "Dépenses mensuelles de communications (CAD)",
    seatCount: "Utilisateurs, sièges ou agents",
    missedPerWeek: "Interactions manquées ou abandonnées par semaine",
    valuePerMissed: "Valeur approximative par interaction manquée (CAD)",
    submit: "Créer ma fiche de valeur communications",
    report: "Fiche de valeur communications ROALLA",
    why: "Pourquoi cette approche convient",
    valueTitle: "Occasion annuelle indicative",
    valueSpend: "À partir des hypothèses de dépenses actuelles",
    valueMissed: "À partir des interactions manquées ou abandonnées",
    priorities: "Priorités de décision",
    plan: "Votre direction d’engagement sur 30, 60 et 90 jours",
    days: ["Les 30 premiers jours", "D’ici 60 jours", "D’ici 90 jours"],
    private: "Cette fiche reste dans votre navigateur, sauf si vous choisissez de l’envoyer à ROALLA.",
    save: "Enregistrer cette fiche dans mon navigateur",
    saved: "Fiche enregistrée",
    print: "Imprimer ou enregistrer en PDF",
    review: "Demander une revue communications gratuite",
    estimateNote:
      "Il s’agit d’estimations de planification fondées uniquement sur vos hypothèses. Elles ne représentent pas des économies garanties, un devis ou un conseil financier.",
    disclaimer:
      "Il s’agit d’un guide initial fondé sur vos réponses. ROALLA confirme la portée, la faisabilité, les dépendances, le prix et les mesures avant tout mandat. ROALLA peut recevoir une rémunération de certains fournisseurs si vous choisissez d’acheter par notre intermédiaire. Nous le confirmons avant toute recommandation. Cette fiche ne recommande aucun fournisseur et ne remplace pas un examen de sécurité, juridique ou financier.",
    liveHint: "L’occasion indicative se met à jour lorsque vous ajustez les chiffres.",
  },
} as const;

const initial: CommunicationsValueBriefInput = {
  situation: "pots-legacy",
  scope: "both",
  scale: "11-50",
  frictions: ["high-line-cost", "missed-calls"],
  urgency: "exploring",
  monthlySpend: 1200,
  seatCount: SCALE_SEAT_DEFAULTS["11-50"],
  missedPerWeek: 8,
  valuePerMissed: 75,
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const radioCard = (active: boolean) =>
  `cursor-pointer rounded-xl border p-4 text-sm font-medium transition ${
    active
      ? "border-primary bg-primary/[0.06] text-primary-dark"
      : "border-slate-200 text-slate-700 hover:border-primary/50"
  }`;

export default function CommunicationsValueBrief({ locale }: { locale: string }) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const approaches = approachCopy[language];
  const [input, setInput] = useState(initial);
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("roalla-communications-value-brief") || "{}");
      if (stored && typeof stored === "object") {
        setInput((current) => ({
          ...current,
          ...stored,
          frictions: Array.isArray(stored.frictions)
            ? stored.frictions.slice(0, MAX_FRICTIONS)
            : current.frictions,
        }));
        if (stored.complete) setComplete(true);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const result = useMemo(() => buildCommunicationsValueBrief(input), [input]);
  const showMissedFields =
    input.scope !== "uc" || input.frictions.includes("missed-calls");

  function update<K extends keyof CommunicationsValueBriefInput>(
    key: K,
    value: CommunicationsValueBriefInput[K],
  ) {
    setInput((current) => {
      const next = { ...current, [key]: value };
      if (key === "scale") {
        next.seatCount = SCALE_SEAT_DEFAULTS[value as CommunicationsScale];
      }
      return next;
    });
    setSaved(false);
  }

  function toggleFriction(friction: CommunicationsFriction) {
    setInput((current) => {
      const exists = current.frictions.includes(friction);
      if (exists) {
        return { ...current, frictions: current.frictions.filter((item) => item !== friction) };
      }
      if (current.frictions.length >= MAX_FRICTIONS) return current;
      return { ...current, frictions: [...current.frictions, friction] };
    });
    setSaved(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComplete(true);
    setSaved(false);
    trackAnalyticsEvent("communications_value_brief_completed", {
      situation: input.situation,
      scope: input.scope,
      approach: result.approachKey,
    });
    window.setTimeout(() => document.getElementById("communications-value-result")?.focus(), 0);
  }

  function save() {
    window.localStorage.setItem(
      "roalla-communications-value-brief",
      JSON.stringify({ ...input, complete: true, approachKey: result.approachKey, savedAt: new Date().toISOString() }),
    );
    setSaved(true);
  }

  const contactGoal = `${t.report}: ${approaches.names[result.approachKey]}. ${money(result.indicativeAnnualValue, language)} indicative.`.slice(0, 500);
  const contactHref = `/${locale}/contact?intent=consulting&focus=technology&need=communications-modernization&goal=${encodeURIComponent(contactGoal)}&from_page=${encodeURIComponent("/tools/communications-value-brief")}`;

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 print:hidden">
        <fieldset>
          <legend className="text-xl font-serif font-bold text-slate-950">{t.situationLabel}</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(Object.keys(t.situations) as CommunicationsSituation[]).map((key) => (
              <label key={key} className={radioCard(input.situation === key)}>
                <input
                  className="sr-only"
                  type="radio"
                  name="situation"
                  checked={input.situation === key}
                  onChange={() => update("situation", key)}
                />
                {t.situations[key]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="text-xl font-serif font-bold text-slate-950">{t.scopeLabel}</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(Object.keys(t.scopes) as CommunicationsScope[]).map((key) => (
              <label key={key} className={radioCard(input.scope === key)}>
                <input
                  className="sr-only"
                  type="radio"
                  name="scope"
                  checked={input.scope === key}
                  onChange={() => update("scope", key)}
                />
                {t.scopes[key]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="text-xl font-serif font-bold text-slate-950">{t.scaleLabel}</legend>
          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
            {(Object.keys(t.scales) as CommunicationsScale[]).map((key) => (
              <label key={key} className={radioCard(input.scale === key)}>
                <input
                  className="sr-only"
                  type="radio"
                  name="scale"
                  checked={input.scale === key}
                  onChange={() => update("scale", key)}
                />
                {t.scales[key]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="text-xl font-serif font-bold text-slate-950">{t.frictionLabel}</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(t.frictions) as CommunicationsFriction[]).map((key) => {
              const active = input.frictions.includes(key);
              return (
                <label key={key} className={radioCard(active)}>
                  <input
                    className="sr-only"
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleFriction(key)}
                  />
                  {t.frictions[key]}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="text-xl font-serif font-bold text-slate-950">{t.urgencyLabel}</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(t.urgencies) as CommunicationsUrgency[]).map((key) => (
              <label key={key} className={radioCard(input.urgency === key)}>
                <input
                  className="sr-only"
                  type="radio"
                  name="urgency"
                  checked={input.urgency === key}
                  onChange={() => update("urgency", key)}
                />
                {t.urgencies[key]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-serif font-bold text-slate-950">{t.numbersLabel}</h3>
          <p className="mt-1 text-sm text-slate-600">{t.liveHint}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-900">
              {t.monthlySpend}
              <input
                type="number"
                min={0}
                step={50}
                value={input.monthlySpend}
                onChange={(e) => update("monthlySpend", Number(e.target.value))}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-900">
              {t.seatCount}
              <input
                type="number"
                min={1}
                step={1}
                value={input.seatCount}
                onChange={(e) => update("seatCount", Number(e.target.value))}
                className={inputClass}
              />
            </label>
            {showMissedFields ? (
              <>
                <label className="block text-sm font-semibold text-slate-900">
                  {t.missedPerWeek}
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={input.missedPerWeek}
                    onChange={(e) => update("missedPerWeek", Number(e.target.value))}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-900">
                  {t.valuePerMissed}
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={input.valuePerMissed}
                    onChange={(e) => update("valuePerMissed", Number(e.target.value))}
                    className={inputClass}
                  />
                </label>
              </>
            ) : null}
          </div>
          <p className="mt-4 text-2xl font-serif font-bold text-primary-dark">
            {money(result.indicativeAnnualValue, language)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{t.estimateNote}</p>
        </div>

        <button
          type="submit"
          disabled={!ready}
          className="mt-6 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          <Sparkles className="mr-2 h-5 w-5" aria-hidden />
          {t.submit}
        </button>
      </form>

      {complete ? (
        <section
          id="communications-value-result"
          tabIndex={-1}
          className="space-y-6 outline-none"
          aria-live="polite"
        >
          <article className="rounded-2xl border border-primary/20 bg-white p-6 shadow-lg sm:p-9">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-dark">{t.report}</p>
              <h2 className="mt-2 text-3xl font-serif font-bold text-slate-950">
                {approaches.names[result.approachKey]}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {t.situations[input.situation]} · {t.scopes[input.scope]}
              </p>
            </div>

            <div className="mt-7 grid gap-7 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-950">{t.why}</h3>
                <p className="mt-3 leading-7 text-slate-700">{approaches.reasons[result.approachKey]}</p>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-amber-900">{t.valueTitle}</p>
                  <p className="mt-2 text-3xl font-serif font-bold text-amber-950">
                    {money(result.indicativeAnnualValue, language)}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-amber-950">
                    <li>
                      {t.valueSpend}: {money(result.spendOpportunity, language)} ({result.recoverablePercent}%)
                    </li>
                    {result.showMissedOpportunity && result.missedOpportunity > 0 ? (
                      <li>
                        {t.valueMissed}: {money(result.missedOpportunity, language)}
                      </li>
                    ) : null}
                  </ul>
                  <p className="mt-3 text-xs leading-5 text-amber-900">{t.estimateNote}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-slate-950">{t.priorities}</h3>
                <ol className="mt-4 space-y-3">
                  {result.priorities.map((item, index) => (
                    <li key={item} className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                      <span className="font-bold text-primary-dark">{index + 1}</span>
                      {language === "fr" ? priorityFr[item] ?? item : item}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-serif font-bold text-slate-950">{t.plan}</h3>
              <ol className="mt-4 space-y-3">
                {result.plan30_60_90.map((action, index) => (
                  <li key={action} className="flex gap-3 rounded-lg border border-slate-200 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-dark">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.days[index]}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {language === "fr"
                          ? (
                              {
                                "Confirm line counts, call patterns, must-keep numbers, and the business outcome that replaces the legacy phone system.":
                                  "Confirmer le nombre de lignes, les modèles d’appels, les numéros à conserver et le résultat d’affaires qui remplace le système téléphonique héritage.",
                                "Compare a short private shortlist against those requirements, total cost, and migration risk—without committing to a vendor prematurely.":
                                  "Comparer une courte liste privée à ces exigences, au coût total et au risque de migration—sans s’engager trop tôt envers un fournisseur.",
                                "Decide on the path, sequence number porting and cutover, and set adoption measures for the first 90 days.":
                                  "Choisir le parcours, séquencer la portabilité et la bascule, et fixer les mesures d’adoption pour les 90 premiers jours.",
                                "Baseline what you pay today, which features are used, and where contracts, seats, or add-ons no longer match the work.":
                                  "Établir ce que vous payez aujourd’hui, quelles fonctions sont utilisées, et où contrats, sièges ou options ne correspondent plus au travail.",
                                "Challenge renewal assumptions with a needs-led shortlist and clear exit or consolidate options.":
                                  "Remettre en question les hypothèses de renouvellement avec une liste restreinte fondée sur les besoins et des options claires de sortie ou de consolidation.",
                                "Choose renew, renegotiate, or replace—and document the measures that prove the change was worth it.":
                                  "Choisir renouveler, renégocier ou remplacer—et documenter les mesures qui prouvent que le changement en valait la peine.",
                                "Map inbound journeys, queue pain, CRM gaps, recording needs, and what “good” looks like for agents and customers.":
                                  "Cartographier les parcours entrants, la douleur des files, les lacunes CRM, les besoins d’enregistrement et ce qu’est un « bon » résultat pour agents et clients.",
                                "Pressure-test contact-centre options against those requirements, integrations, and total cost of ownership.":
                                  "Mettre à l’épreuve les options de centre de contact face à ces exigences, intégrations et coût total de possession.",
                                "Pilot the smallest useful improvement path, measure abandon and handle metrics, then decide whether to expand.":
                                  "Piloter le plus petit parcours d’amélioration utile, mesurer abandons et traitements, puis décider d’élargir ou non.",
                                "Inventory overlapping calling, meeting, and contact tools and name the single outcome the stack must serve.":
                                  "Inventorier les outils d’appels, de réunions et de contact qui se chevauchent et nommer le résultat unique que la pile doit servir.",
                                "Collapse the shortlist to options that cover the real workload, then compare cost, risk, and adoption load.":
                                  "Réduire la liste aux options qui couvrent la charge réelle, puis comparer coût, risque et charge d’adoption.",
                                "Pick one decision path, retire redundant tools on a schedule, and assign ownership for the resulting stack.":
                                  "Choisir un parcours décisionnel, retirer les outils redondants selon un calendrier et assigner la responsabilité de la pile résultante.",
                              } as Record<string, string>
                            )[action] ?? action
                          : action}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-7 text-xs leading-5 text-slate-500">{t.disclaimer}</p>
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <a
                href={contactHref}
                onClick={save}
                className="inline-flex min-h-[48px] items-center rounded-lg bg-brand-gold px-5 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light"
              >
                {t.review}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </a>
              <button
                type="button"
                onClick={save}
                className="inline-flex min-h-[48px] items-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-primary"
              >
                <LockKeyhole className="mr-2 h-4 w-4" aria-hidden />
                {saved ? t.saved : t.save}
              </button>
              <button
                type="button"
                onClick={() => {
                  save();
                  window.print();
                }}
                className="inline-flex min-h-[48px] items-center px-4 py-3 text-sm font-semibold text-slate-700 underline underline-offset-4"
              >
                <Download className="mr-2 h-4 w-4" aria-hidden />
                {t.print}
              </button>
            </div>
            <p className="mt-3 flex gap-2 text-xs text-slate-500 print:hidden">
              <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden />
              {t.private}
            </p>
          </article>
        </section>
      ) : null}
    </div>
  );
}
