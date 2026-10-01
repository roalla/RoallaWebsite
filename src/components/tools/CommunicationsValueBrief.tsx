"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, LockKeyhole, Sparkles, X } from "lucide-react";
import {
  MAX_COMMUNICATIONS_FRICTIONS,
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
import CommunicationsValueBriefPrintSheet from "@/components/tools/CommunicationsValueBriefPrintSheet";

const money = (value: number, locale: string) =>
  new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);

function fill(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value), template);
}

const TOTAL_STEPS = 6;

const approachCopy = {
  en: {
    names: {
      "pots-modernization": "Legacy phone modernization path",
      "provider-value-review": "Current provider value review",
      "contact-centre-readiness": "Contact centre readiness path",
      "unified-stack-rationalization": "Communications stack rationalization",
    } as Record<CommunicationsApproachKey, string>,
    printTitles: {
      "pots-modernization": "Modernization brief for legacy phone",
      "provider-value-review": "Renewal value review",
      "contact-centre-readiness": "Contact centre readiness brief",
      "unified-stack-rationalization": "Communications stack rationalization brief",
    } as Record<CommunicationsApproachKey, string>,
    ctas: {
      "pots-modernization": "Plan a modernization review",
      "provider-value-review": "Challenge my renewal before I sign",
      "contact-centre-readiness": "Review my contact centre options",
      "unified-stack-rationalization": "Simplify my communications stack",
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
    printTitles: {
      "pots-modernization": "Fiche de modernisation pour téléphone traditionnel",
      "provider-value-review": "Revue de valeur avant renouvellement",
      "contact-centre-readiness": "Fiche de préparation du centre de contact",
      "unified-stack-rationalization": "Fiche de rationalisation des communications",
    } as Record<CommunicationsApproachKey, string>,
    ctas: {
      "pots-modernization": "Planifier une revue de modernisation",
      "provider-value-review": "Remettre en question mon renouvellement",
      "contact-centre-readiness": "Examiner mes options de centre de contact",
      "unified-stack-rationalization": "Simplifier ma pile de communications",
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

const planFr: Record<string, string> = {
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
};

const copy = {
  en: {
    stepOf: "Step",
    back: "Back",
    next: "Continue",
    editAnswers: "Edit answers",
    reset: "Start over",
    resetConfirm: "Clear your answers and start again?",
    situationLabel: "What best describes your phone setup today?",
    situations: {
      "pots-legacy": "Traditional phone lines or an old on-site system",
      "current-cloud-unsure": "We already have cloud tools, but value is unclear",
      fragmented: "Several overlapping calling and contact tools",
      renewal: "A renewal or contract decision is coming up",
    },
    scopeLabel: "What do you need to cover?",
    scopes: {
      uc: "Internal calling & collaboration",
      cc: "Customer queues, IVR, or agents",
      both: "Both internal + customer contact",
    },
    scaleLabel: "About how many people are involved?",
    scales: {
      "1-10": "1–10 people",
      "11-50": "11–50 people",
      "51-200": "51–200 people",
      "200-plus": "200+ people",
    },
    frictionLabel: "Where does friction show up most?",
    frictionHint: "Choose up to 2. A new choice replaces the oldest one.",
    frictionCount: "{count} of 2 selected",
    frictions: {
      "missed-calls": "Missed or abandoned calls",
      "high-line-cost": "High line or seat cost",
      "no-mobility": "Weak mobile / remote calling",
      "no-crm": "No useful CRM handoff",
      "recording-compliance": "Recording or compliance gaps",
      "fragmented-tools": "Too many overlapping tools",
      "poor-reporting": "Weak reporting",
      "contract-lock-in": "Contract lock-in",
    },
    urgencyLabel: "When do you need a decision?",
    urgencies: {
      exploring: "Just exploring",
      "six-months": "Within 6 months",
      "three-months": "Within 3 months",
      urgent: "Urgent",
    },
    numbersLabel: "What do you pay for phones each month?",
    numbersHint:
      "A rough number is fine. Include phone lines, calling apps, and tools your team uses to reach customers.",
    monthlySpend: "Monthly cost",
    peopleLabel: "How many people use the phones?",
    peopleHint: "We filled this in from your earlier answer. Change it if it is off.",
    reviewTitle: "Here is what that means",
    yearlyLine: "You pay about {amount} a year.",
    perPersonLine: "That is about {amount} a person each month.",
    reviewLine: "About {amount} of that yearly bill is worth a closer look.",
    reviewShare: "That is about {percent} dollars out of every 100 on the bill.",
    reviewCaveat: "This is a planning guess, not money you are guaranteed to save.",
    billReasons: {
      "pots-legacy": "An older phone system often leaves a larger share of the bill worth checking.",
      fragmented: "Overlapping tools often mean part of the bill is paying for the same job twice.",
      "current-cloud-unsure": "When the tools are already online, the check is smaller: are you paying for things the team does not use?",
      renewal: "A renewal is a good time to check a modest share of the bill before you sign again.",
    },
    missedTitle: "Calls that go unanswered",
    missedHint: "Optional. Leave this at 0 if you are not sure.",
    missedPerWeek: "Unanswered calls in a typical week",
    valuePerMissed: "Rough value of one missed call",
    valuePerMissedHint: "A common starting guess is $50 to $100. Change it to match your business.",
    missedLine:
      "That is about {amount} a year in business you may be missing. This is separate from your phone bill. It is not savings.",
    submit: "See my communications value brief",
    report: "ROALLA Communications Value Brief",
    printEyebrow: "Technology advisory · communications",
    why: "Why this approach fits",
    valueTitle: "What is worth a closer look",
    valueSpend: "Of the yearly phone bill",
    valueMissed: "Unanswered calls, kept separate from the bill",
    priorities: "Decision priorities",
    plan: "Your 30, 60, and 90-day engagement direction",
    days: ["First 30 days", "By 60 days", "By 90 days"],
    nextStepsTitle: "What happens next",
    nextSteps: [
      "A short needs review (about 20–30 minutes)",
      "A private shortlist based on your requirements—not a vendor pitch first",
      "A clear renew, renegotiate, or replace recommendation",
    ],
    saveReminder: "Save or print this brief before you leave—easy to share internally.",
    private: "This brief stays in your browser unless you choose to send it to ROALLA.",
    save: "Save this brief in my browser",
    saved: "Brief saved",
    print: "Save branded PDF",
    disclaimer:
      "This is an initial planning guide based on your answers. ROALLA confirms scope, feasibility, dependencies, pricing, and expected measures before any engagement. ROALLA may receive compensation from some providers if you choose to purchase through us. We confirm this before any recommendation. This brief does not recommend a provider or replace security, legal, or financial review.",
    opportunityLabel: "Your yearly phone bill",
    contextLabel: "Your situation",
    printWhyHint: "Recommended engagement approach",
    printValueHint: "Based on your planning numbers",
    printPrioritiesHint: "What to verify before choosing a path",
    printPlanHint: "How ROALLA can help you move forward",
  },
  fr: {
    stepOf: "Étape",
    back: "Retour",
    next: "Continuer",
    editAnswers: "Modifier les réponses",
    reset: "Recommencer",
    resetConfirm: "Effacer vos réponses et recommencer?",
    situationLabel: "Qu’est-ce qui décrit le mieux votre téléphone aujourd’hui?",
    situations: {
      "pots-legacy": "Lignes traditionnelles ou ancien système sur site",
      "current-cloud-unsure": "Nous avons déjà des outils infonuagiques, mais la valeur est floue",
      fragmented: "Plusieurs outils d’appels et de contact qui se chevauchent",
      renewal: "Un renouvellement ou une décision contractuelle approche",
    },
    scopeLabel: "Que devez-vous couvrir?",
    scopes: {
      uc: "Appels internes et collaboration",
      cc: "Files clients, SVI ou agents",
      both: "Appels internes + contact client",
    },
    scaleLabel: "Environ combien de personnes sont concernées?",
    scales: {
      "1-10": "1–10 personnes",
      "11-50": "11–50 personnes",
      "51-200": "51–200 personnes",
      "200-plus": "200+ personnes",
    },
    frictionLabel: "Où la friction apparaît-elle le plus?",
    frictionHint: "Choisissez jusqu’à 2. Un nouveau choix remplace le plus ancien.",
    frictionCount: "{count} sur 2 sélectionnés",
    frictions: {
      "missed-calls": "Appels manqués ou abandonnés",
      "high-line-cost": "Coût élevé des lignes ou sièges",
      "no-mobility": "Appels mobiles / à distance faibles",
      "no-crm": "Pas de transfert CRM utile",
      "recording-compliance": "Lacunes d’enregistrement ou conformité",
      "fragmented-tools": "Trop d’outils qui se chevauchent",
      "poor-reporting": "Rapports faibles",
      "contract-lock-in": "Verrouillage contractuel",
    },
    urgencyLabel: "Quand faut-il une décision?",
    urgencies: {
      exploring: "Simple exploration",
      "six-months": "Dans les 6 mois",
      "three-months": "Dans les 3 mois",
      urgent: "Urgent",
    },
    numbersLabel: "Combien payez-vous pour le téléphone chaque mois?",
    numbersHint:
      "Un chiffre approximatif suffit. Incluez les lignes, les applications d’appels et les outils pour joindre les clients.",
    monthlySpend: "Coût mensuel",
    peopleLabel: "Combien de personnes utilisent le téléphone?",
    peopleHint: "Ce nombre vient de votre réponse précédente. Changez-le s’il est inexact.",
    reviewTitle: "Voici ce que cela veut dire",
    yearlyLine: "Vous payez environ {amount} par année.",
    perPersonLine: "Cela fait environ {amount} par personne chaque mois.",
    reviewLine: "Environ {amount} de cette facture annuelle mérite un examen plus attentif.",
    reviewShare: "C’est environ {percent} dollars sur chaque 100 dollars de la facture.",
    reviewCaveat: "C’est une estimation pour planifier, pas de l’argent que vous êtes certain d’économiser.",
    billReasons: {
      "pots-legacy": "Un ancien système téléphonique laisse souvent une plus grande part de la facture à vérifier.",
      fragmented: "Des outils qui se chevauchent font souvent payer deux fois une partie de la facture.",
      "current-cloud-unsure":
        "Quand les outils sont déjà en ligne, la question est plus petite : payez-vous pour des fonctions que l’équipe n’utilise pas?",
      renewal: "Un renouvellement est le bon moment pour vérifier une petite part de la facture avant de signer de nouveau.",
    },
    missedTitle: "Appels sans réponse",
    missedHint: "Facultatif. Laissez 0 si vous n’êtes pas sûr.",
    missedPerWeek: "Appels sans réponse dans une semaine typique",
    valuePerMissed: "Valeur approximative d’un appel manqué",
    valuePerMissedHint: "Un point de départ courant est 50 $ à 100 $. Ajustez selon votre entreprise.",
    missedLine:
      "Cela représente environ {amount} par année en affaires possiblement manquées. C’est distinct de la facture de téléphone. Ce n’est pas une économie.",
    submit: "Voir ma fiche de valeur communications",
    report: "Fiche de valeur communications ROALLA",
    printEyebrow: "Conseil technologique · communications",
    why: "Pourquoi cette approche convient",
    valueTitle: "Ce qui mérite un examen",
    valueSpend: "De la facture téléphonique annuelle",
    valueMissed: "Appels sans réponse, séparés de la facture",
    priorities: "Priorités de décision",
    plan: "Votre direction d’engagement sur 30, 60 et 90 jours",
    days: ["Les 30 premiers jours", "D’ici 60 jours", "D’ici 90 jours"],
    nextStepsTitle: "Ce qui se passe ensuite",
    nextSteps: [
      "Une courte revue des besoins (environ 20 à 30 minutes)",
      "Une liste restreinte privée selon vos exigences—pas un pitch fournisseur d’abord",
      "Une recommandation claire : renouveler, renégocier ou remplacer",
    ],
    saveReminder: "Enregistrez ou imprimez cette fiche avant de partir—facile à partager en interne.",
    private: "Cette fiche reste dans votre navigateur, sauf si vous choisissez de l’envoyer à ROALLA.",
    save: "Enregistrer cette fiche dans mon navigateur",
    saved: "Fiche enregistrée",
    print: "Enregistrer le PDF de marque",
    disclaimer:
      "Il s’agit d’un guide initial fondé sur vos réponses. ROALLA confirme la portée, la faisabilité, les dépendances, le prix et les mesures avant tout mandat. ROALLA peut recevoir une rémunération de certains fournisseurs si vous choisissez d’acheter par notre intermédiaire. Nous le confirmons avant toute recommandation. Cette fiche ne recommande aucun fournisseur et ne remplace pas un examen de sécurité, juridique ou financier.",
    opportunityLabel: "Votre facture téléphonique annuelle",
    contextLabel: "Votre situation",
    printWhyHint: "Parcours d’engagement recommandé",
    printValueHint: "Selon vos chiffres de planification",
    printPrioritiesHint: "Ce qu’il faut vérifier avant de choisir",
    printPlanHint: "Comment ROALLA peut vous aider à avancer",
  },
} as const;

const initial: CommunicationsValueBriefInput = {
  situation: "pots-legacy",
  scope: "both",
  scale: "11-50",
  frictions: [],
  urgency: "exploring",
  monthlySpend: 1200,
  seatCount: SCALE_SEAT_DEFAULTS["11-50"],
  missedPerWeek: 0,
  valuePerMissed: 50,
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function choiceButton(active: boolean) {
  if (active) {
    return "cursor-pointer rounded-xl border-2 border-primary bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2";
  }
  return "cursor-pointer rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:border-primary/50 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2";
}

function StepHeading({
  step,
  label,
  as = "legend",
}: {
  step: number;
  label: string;
  as?: "legend" | "h3";
}) {
  const Tag = as;
  return (
    <Tag className="w-full">
      <span className="inline-flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
          {step}
        </span>
        <span className="text-xl font-serif font-bold text-slate-950 sm:text-2xl">{label}</span>
      </span>
    </Tag>
  );
}

export default function CommunicationsValueBrief({ locale }: { locale: string }) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const approaches = approachCopy[language];
  const [input, setInput] = useState(initial);
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [showSaveReminder, setShowSaveReminder] = useState(true);
  const trackedSteps = useRef<Set<number>>(new Set());

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("roalla-communications-value-brief") || "{}");
      if (stored && typeof stored === "object") {
        setInput((current) => ({
          ...current,
          situation: stored.situation ?? current.situation,
          scope: stored.scope ?? current.scope,
          scale: stored.scale ?? current.scale,
          frictions: Array.isArray(stored.frictions)
            ? stored.frictions.slice(0, MAX_COMMUNICATIONS_FRICTIONS)
            : current.frictions,
          urgency: stored.urgency ?? current.urgency,
          monthlySpend: typeof stored.monthlySpend === "number" ? stored.monthlySpend : current.monthlySpend,
          seatCount: typeof stored.seatCount === "number" ? stored.seatCount : current.seatCount,
          missedPerWeek: typeof stored.missedPerWeek === "number" ? stored.missedPerWeek : current.missedPerWeek,
          valuePerMissed: typeof stored.valuePerMissed === "number" ? stored.valuePerMissed : current.valuePerMissed,
        }));
        // Never auto-open results — user must finish the wizard again.
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (complete || trackedSteps.current.has(step)) return;
    trackedSteps.current.add(step);
    trackAnalyticsEvent("communications_value_brief_step", { step, total: TOTAL_STEPS });
  }, [step, complete]);

  const result = useMemo(() => buildCommunicationsValueBrief(input), [input]);

  function resetBrief() {
    if (typeof window !== "undefined" && !window.confirm(t.resetConfirm)) return;
    window.localStorage.removeItem("roalla-communications-value-brief");
    setInput(initial);
    setComplete(false);
    setSaved(false);
    setStep(1);
    setShowSaveReminder(false);
    trackedSteps.current = new Set();
  }

  function update<K extends keyof CommunicationsValueBriefInput>(
    key: K,
    value: CommunicationsValueBriefInput[K],
    advance = false,
  ) {
    setInput((current) => {
      const next = { ...current, [key]: value };
      if (key === "scale") {
        next.seatCount = SCALE_SEAT_DEFAULTS[value as CommunicationsScale];
      }
      return next;
    });
    setSaved(false);
    if (advance && step < TOTAL_STEPS) {
      window.setTimeout(() => setStep((current) => Math.min(TOTAL_STEPS, current + 1)), 180);
    }
  }

  function toggleFriction(friction: CommunicationsFriction) {
    setInput((current) => {
      const exists = current.frictions.includes(friction);
      if (exists) {
        return { ...current, frictions: current.frictions.filter((item) => item !== friction) };
      }
      if (current.frictions.length >= MAX_COMMUNICATIONS_FRICTIONS) {
        return { ...current, frictions: [...current.frictions.slice(1), friction] };
      }
      return { ...current, frictions: [...current.frictions, friction] };
    });
    setSaved(false);
  }

  function finishBrief() {
    setComplete(true);
    setSaved(false);
    setShowSaveReminder(true);
    trackAnalyticsEvent("communications_value_brief_completed", {
      situation: input.situation,
      scope: input.scope,
      approach: result.approachKey,
      step_reached: step,
    });
    window.setTimeout(() => document.getElementById("communications-value-result")?.focus(), 0);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
      return;
    }
    finishBrief();
  }

  function save() {
    window.localStorage.setItem(
      "roalla-communications-value-brief",
      JSON.stringify({
        ...input,
        complete: true,
        approachKey: result.approachKey,
        savedAt: new Date().toISOString(),
      }),
    );
    setSaved(true);
    setShowSaveReminder(false);
  }

  const frictionLabels = input.frictions.map((key) => t.frictions[key]).join("; ");
  const yearlyAmount = money(result.annualSpend, language);
  const reviewAmount = money(result.spendOpportunity, language);
  const perPersonAmount = money(result.costPerPersonMonthly, language);
  const yearlyLine = fill(t.yearlyLine, { amount: yearlyAmount });
  const perPersonLine =
    result.costPerPersonMonthly > 0 ? fill(t.perPersonLine, { amount: perPersonAmount }) : "";
  const reviewLine = fill(t.reviewLine, { amount: reviewAmount });
  const reviewShare = fill(t.reviewShare, { percent: String(result.recoverablePercent) });
  const billReason = t.billReasons[input.situation];
  const missedLine =
    result.missedOpportunity > 0
      ? fill(t.missedLine, { amount: money(result.missedOpportunity, language) })
      : "";
  const contactGoal = [
    `${approaches.printTitles[result.approachKey]}`,
    `Yearly phone bill: ${yearlyAmount}`,
    `Worth a closer look: ${reviewAmount} (${result.recoverablePercent} dollars out of every 100)`,
    missedLine ? `Unanswered calls, separate from the bill: ${money(result.missedOpportunity, language)}` : null,
    `Situation: ${t.situations[input.situation]}`,
    `Scope: ${t.scopes[input.scope]}`,
    `Scale: ${t.scales[input.scale]}`,
    frictionLabels ? `Top friction: ${frictionLabels}` : null,
    `Urgency: ${t.urgencies[input.urgency]}`,
    "Source: Communications Value Brief",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 900);

  const contactHref = `/${locale}/contact?intent=consulting&focus=technology&need=communications-modernization&goal=${encodeURIComponent(contactGoal)}&from_page=${encodeURIComponent("/tools/communications-value-brief")}`;
  const translatedPriority = (item: string) => (language === "fr" ? priorityFr[item] ?? item : item);
  const translatedPlan = (item: string) => (language === "fr" ? planFr[item] ?? item : item);
  const printTitle = approaches.printTitles[result.approachKey];
  const ctaLabel = approaches.ctas[result.approachKey];

  const printFields = [
    {
      label: t.why,
      hint: t.printWhyHint,
      value: approaches.reasons[result.approachKey],
      accent: "teal" as const,
    },
    {
      label: t.valueTitle,
      hint: t.printValueHint,
      value: [yearlyLine, perPersonLine, reviewLine, reviewShare, billReason, missedLine, t.reviewCaveat]
        .filter(Boolean)
        .join("\n"),
      accent: "gold" as const,
    },
    {
      label: t.priorities,
      hint: t.printPrioritiesHint,
      value: result.priorities.map((item, index) => `${index + 1}. ${translatedPriority(item)}`).join("\n"),
      accent: "teal" as const,
    },
    {
      label: t.plan,
      hint: t.printPlanHint,
      value: result.plan30_60_90
        .map((action, index) => `${t.days[index]}\n${translatedPlan(action)}`)
        .join("\n\n"),
      accent: "gold" as const,
    },
  ];

  function ChoiceLabel({
    active,
    children,
  }: {
    active: boolean;
    children: React.ReactNode;
  }) {
    return (
      <span className={`flex h-full items-start gap-2.5 ${choiceButton(active)}`}>
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            active ? "border-white bg-white text-primary" : "border-slate-300 bg-transparent text-transparent"
          }`}
          aria-hidden
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <span className="text-left leading-snug">{children}</span>
      </span>
    );
  }

  return (
    <div className="space-y-8">
      {!complete ? (
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 print:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-primary-dark">
              {t.stepOf} {step}/{TOTAL_STEPS}
            </p>
            <button
              type="button"
              onClick={resetBrief}
              className="text-sm font-semibold text-slate-600 underline underline-offset-4 hover:text-slate-900"
            >
              {t.reset}
            </button>
          </div>
          <div className="mt-4 flex gap-2" aria-hidden>
            {Array.from({ length: TOTAL_STEPS }, (_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index + 1 <= step ? "bg-primary" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {step === 1 ? (
            <fieldset className="mt-6">
              <StepHeading step={1} label={t.situationLabel} />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(Object.keys(t.situations) as CommunicationsSituation[]).map((key) => (
                  <label key={key} className="block">
                    <input
                      className="sr-only"
                      type="radio"
                      name="situation"
                      checked={input.situation === key}
                      onChange={() => update("situation", key, true)}
                    />
                    <ChoiceLabel active={input.situation === key}>{t.situations[key]}</ChoiceLabel>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 2 ? (
            <fieldset className="mt-6">
              <StepHeading step={2} label={t.scopeLabel} />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {(Object.keys(t.scopes) as CommunicationsScope[]).map((key) => (
                  <label key={key} className="block">
                    <input
                      className="sr-only"
                      type="radio"
                      name="scope"
                      checked={input.scope === key}
                      onChange={() => update("scope", key, true)}
                    />
                    <ChoiceLabel active={input.scope === key}>{t.scopes[key]}</ChoiceLabel>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 3 ? (
            <fieldset className="mt-6">
              <StepHeading step={3} label={t.scaleLabel} />
              <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
                {(Object.keys(t.scales) as CommunicationsScale[]).map((key) => (
                  <label key={key} className="block">
                    <input
                      className="sr-only"
                      type="radio"
                      name="scale"
                      checked={input.scale === key}
                      onChange={() => update("scale", key, true)}
                    />
                    <ChoiceLabel active={input.scale === key}>{t.scales[key]}</ChoiceLabel>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 4 ? (
            <fieldset className="mt-6">
              <StepHeading step={4} label={t.frictionLabel} />
              <p className="mt-2 text-sm text-slate-600">{t.frictionHint}</p>
              <p className="mt-1 text-sm font-semibold text-primary-dark">
                {t.frictionCount.replace("{count}", String(input.frictions.length))}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(Object.keys(t.frictions) as CommunicationsFriction[]).map((key) => {
                  const active = input.frictions.includes(key);
                  return (
                    <label key={key} className="block">
                      <input
                        className="sr-only"
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleFriction(key)}
                      />
                      <ChoiceLabel active={active}>{t.frictions[key]}</ChoiceLabel>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          {step === 5 ? (
            <fieldset className="mt-6">
              <StepHeading step={5} label={t.urgencyLabel} />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(Object.keys(t.urgencies) as CommunicationsUrgency[]).map((key) => (
                  <label key={key} className="block">
                    <input
                      className="sr-only"
                      type="radio"
                      name="urgency"
                      checked={input.urgency === key}
                      onChange={() => update("urgency", key, true)}
                    />
                    <ChoiceLabel active={input.urgency === key}>{t.urgencies[key]}</ChoiceLabel>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 6 ? (
            <div className="mt-6">
              <StepHeading step={6} label={t.numbersLabel} as="h3" />
              <p className="mt-2 text-sm leading-6 text-slate-600">{t.numbersHint}</p>
              <label className="mt-4 block text-sm font-semibold text-slate-900">
                {t.monthlySpend}
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={input.monthlySpend}
                  onChange={(e) => update("monthlySpend", Number(e.target.value))}
                  className={inputClass}
                  required
                />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-900">
                {t.peopleLabel}
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={input.seatCount}
                  onChange={(e) => update("seatCount", Number(e.target.value))}
                  className={inputClass}
                />
                <span className="mt-1 block text-sm font-normal text-slate-600">{t.peopleHint}</span>
              </label>
              {result.showMissedOpportunity ? (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{t.missedTitle}</p>
                  <p className="mt-1 text-sm text-slate-600">{t.missedHint}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                      <span className="mt-1 block text-sm font-normal text-slate-600">{t.valuePerMissedHint}</span>
                    </label>
                  </div>
                </div>
              ) : null}
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-primary-dark">{t.reviewTitle}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[.14em] text-slate-500">{t.opportunityLabel}</p>
                <p className="mt-1 text-3xl font-serif font-bold text-slate-950">{yearlyAmount}</p>
                {perPersonLine ? <p className="mt-1 text-sm text-slate-600">{perPersonLine}</p> : null}
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-900">{t.valueSpend}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{reviewLine}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{reviewShare}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{billReason}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{t.reviewCaveat}</p>
                </div>
                {missedLine ? (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="text-sm font-semibold text-slate-900">{t.valueMissed}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{missedLine}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              disabled={step <= 1}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              className="inline-flex min-h-[48px] items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              {t.back}
            </button>
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(TOTAL_STEPS, current + 1))}
                className="inline-flex min-h-[48px] items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                {t.next}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!ready}
                className="inline-flex min-h-[48px] items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                <Sparkles className="mr-2 h-4 w-4" aria-hidden />
                {t.submit}
              </button>
            )}
          </div>
        </form>
      ) : null}

      {complete ? (
        <section
          id="communications-value-result"
          tabIndex={-1}
          className="space-y-6 outline-none print:hidden"
          aria-live="polite"
        >
          {showSaveReminder ? (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-brand-gold/40 bg-brand-gold/15 px-4 py-3 text-sm text-slate-900">
              <p className="font-medium">{t.saveReminder}</p>
              <button
                type="button"
                onClick={() => setShowSaveReminder(false)}
                className="rounded-md p-1 text-slate-600 hover:bg-white/70"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <article className="rounded-2xl border border-primary/20 bg-white p-6 shadow-lg sm:p-9">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-dark">{t.report}</p>
              <h2 className="mt-2 text-3xl font-serif font-bold text-slate-950">{printTitle}</h2>
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
                  <p className="mt-3 text-xs font-bold uppercase tracking-[.14em] text-amber-800">{t.opportunityLabel}</p>
                  <p className="mt-1 text-3xl font-serif font-bold text-amber-950">{yearlyAmount}</p>
                  {perPersonLine ? <p className="mt-1 text-sm text-amber-950">{perPersonLine}</p> : null}
                  <p className="mt-4 text-sm font-semibold text-amber-950">{t.valueSpend}</p>
                  <p className="mt-1 text-sm leading-6 text-amber-950">{reviewLine}</p>
                  <p className="mt-1 text-sm leading-6 text-amber-950">{reviewShare}</p>
                  <p className="mt-2 text-sm leading-6 text-amber-900">{billReason}</p>
                  {missedLine ? (
                    <>
                      <p className="mt-4 text-sm font-semibold text-amber-950">{t.valueMissed}</p>
                      <p className="mt-1 text-sm leading-6 text-amber-950">{missedLine}</p>
                    </>
                  ) : null}
                  <p className="mt-3 text-xs leading-5 text-amber-900">{t.reviewCaveat}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-950">{t.priorities}</h3>
                <ol className="mt-4 space-y-3">
                  {result.priorities.map((item, index) => (
                    <li key={item} className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                      <span className="font-bold text-primary-dark">{index + 1}</span>
                      {translatedPriority(item)}
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
                      <p className="mt-1 text-sm leading-6 text-slate-600">{translatedPlan(action)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-serif font-bold text-slate-950">{t.nextStepsTitle}</h3>
              <ol className="mt-3 space-y-2">
                {t.nextSteps.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <span className="font-bold text-primary-dark">{index + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-7 text-xs leading-5 text-slate-500">{t.disclaimer}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={contactHref}
                onClick={() => {
                  save();
                  trackAnalyticsEvent("communications_value_brief_contact", {
                    approach: result.approachKey,
                  });
                }}
                className="inline-flex min-h-[48px] items-center rounded-lg bg-brand-gold px-5 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light"
              >
                {ctaLabel}
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
                  trackAnalyticsEvent("communications_value_brief_pdf", {
                    approach: result.approachKey,
                  });
                  window.print();
                }}
                className="inline-flex min-h-[48px] items-center rounded-lg border border-primary px-4 py-3 text-sm font-semibold text-primary-dark hover:bg-primary/5"
              >
                <Download className="mr-2 h-4 w-4" aria-hidden />
                {t.print}
              </button>
              <button
                type="button"
                onClick={() => {
                  setComplete(false);
                  setStep(1);
                }}
                className="inline-flex min-h-[48px] items-center px-4 py-3 text-sm font-semibold text-slate-700 underline underline-offset-4"
              >
                {t.editAnswers}
              </button>
              <button
                type="button"
                onClick={resetBrief}
                className="inline-flex min-h-[48px] items-center px-4 py-3 text-sm font-semibold text-slate-700 underline underline-offset-4"
              >
                {t.reset}
              </button>
            </div>
            <p className="mt-3 flex gap-2 text-xs text-slate-500">
              <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden />
              {t.private}
            </p>
          </article>
        </section>
      ) : null}

      {complete ? (
        <CommunicationsValueBriefPrintSheet
          locale={locale}
          eyebrow={t.printEyebrow}
          title={printTitle}
          subtitle={approaches.reasons[result.approachKey]}
          opportunityLabel={t.opportunityLabel}
          opportunityValue={yearlyAmount}
          opportunityNote={`${reviewLine} ${t.reviewCaveat}`}
          contextLabel={t.contextLabel}
          contextValue={`${t.situations[input.situation]} · ${t.scopes[input.scope]} · ${t.scales[input.scale]}`}
          fields={printFields}
          disclaimer={t.disclaimer}
        />
      ) : null}
    </div>
  );
}
