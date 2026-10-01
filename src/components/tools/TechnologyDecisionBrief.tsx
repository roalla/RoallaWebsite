"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, LockKeyhole, ShieldCheck, X } from "lucide-react";
import {
  technologyDecisionPriorities,
  type TechnologyBriefInput,
} from "@/lib/business-advisory-tools";
import { trackAnalyticsEvent } from "@/lib/analytics";
import TechnologyDecisionBriefPrintSheet from "@/components/tools/TechnologyDecisionBriefPrintSheet";

const TOTAL_STEPS = 5;

const copy = {
  en: {
    stepOf: "Step",
    modeAll: "See all at once",
    modeWizard: "Guided steps",
    modeHint: "On mobile, guided steps are often easier. On desktop, see priorities update as you choose.",
    back: "Back",
    next: "Continue",
    contextTitle: "Your decision context",
    resultsTitle: "Recommended decision priorities",
    processLabel: "Suggested process",
    nextStepsTitle: "What happens next",
    nextSteps: [
      "A short needs review (about 20–30 minutes)",
      "A private shortlist based on your requirements—not a vendor pitch first",
      "A clear buy, renew, renegotiate, or wait recommendation",
    ],
    saveReminder: "Save or print this brief before you leave—easy to share with leadership.",
    save: "Save in this browser",
    saved: "Brief saved",
    print: "Save branded PDF",
    printEyebrow: "Technology advisory · provider-neutral",
    contextLabel: "Your context",
    prioritiesHint: "Verify these before speaking with providers",
    private: "This brief stays in your browser unless you choose to send it to ROALLA.",
    disclaimer:
      "ROALLA may receive compensation from some providers if you choose to purchase through us. We confirm this before any recommendation. This brief does not recommend a provider or replace security, legal, or financial review.",
    ctas: {
      replace: "Get a replacement shortlist review",
      consolidate: "Help me collapse overlapping tools",
      introduce: "Validate this capability before we buy",
      renew: "Challenge this renewal before I sign",
    } as Record<TechnologyBriefInput["objective"], string>,
    printTitles: {
      replace: "Replacement decision brief",
      consolidate: "Consolidation decision brief",
      introduce: "New capability decision brief",
      renew: "Renewal decision brief",
    } as Record<TechnologyBriefInput["objective"], string>,
    processes: {
      replace:
        "Confirm the outcome the current tool fails to deliver, compare a private shortlist, verify migration risk and total cost, then plan cutover and adoption.",
      consolidate:
        "Inventory overlapping tools and owners, name the single outcome the stack must serve, compare consolidation options, then retire redundant licences on a schedule.",
      introduce:
        "Define the business outcome and success measures, validate the smallest useful capability, check integration and adoption load, then pilot before a broader rollout.",
      renew:
        "Baseline what you pay and use today, challenge renewal assumptions with a needs-led shortlist, compare exit or renegotiate options, then decide renew, renegotiate, or replace.",
    } as Record<TechnologyBriefInput["objective"], string>,
    fields: {
      objective: {
        label: "What do you need to accomplish?",
        options: {
          replace: "Replace a tool",
          consolidate: "Consolidate tools",
          introduce: "Introduce a new capability",
          renew: "Review a renewal",
        },
      },
      urgency: {
        label: "When is the decision needed?",
        options: {
          planned: "Long-range planning",
          "six-months": "Within six months",
          "three-months": "Within three months",
          urgent: "Urgent",
        },
      },
      dataSensitivity: {
        label: "What kind of data is involved?",
        options: {
          standard: "Standard business data",
          personal: "Personal information",
          regulated: "Regulated data",
          critical: "Critical or highly sensitive data",
        },
      },
      integrations: {
        label: "How much integration is required?",
        options: {
          none: "None",
          few: "A few systems",
          several: "Several systems",
          complex: "Complex environment",
        },
      },
      adoption: {
        label: "Who must adopt the solution?",
        options: {
          small: "Small team",
          department: "A department",
          organization: "The organization",
          external: "Employees and external users",
        },
      },
    },
  },
  fr: {
    stepOf: "Étape",
    modeAll: "Tout voir",
    modeWizard: "Étapes guidées",
    modeHint: "Sur mobile, les étapes guidées sont souvent plus simples. Sur ordinateur, voyez les priorités se mettre à jour.",
    back: "Retour",
    next: "Continuer",
    contextTitle: "Votre contexte de décision",
    resultsTitle: "Priorités de décision recommandées",
    processLabel: "Processus suggéré",
    nextStepsTitle: "Ce qui se passe ensuite",
    nextSteps: [
      "Une courte revue des besoins (environ 20 à 30 minutes)",
      "Une liste restreinte privée selon vos exigences—pas un pitch fournisseur d’abord",
      "Une recommandation claire : acheter, renouveler, renégocier ou attendre",
    ],
    saveReminder: "Enregistrez ou imprimez cette fiche avant de partir—facile à partager avec la direction.",
    save: "Enregistrer dans ce navigateur",
    saved: "Fiche enregistrée",
    print: "Enregistrer le PDF de marque",
    printEyebrow: "Conseil technologique · sans fournisseur",
    contextLabel: "Votre contexte",
    prioritiesHint: "À vérifier avant de parler aux fournisseurs",
    private: "Cette fiche reste dans votre navigateur, sauf si vous choisissez de l’envoyer à ROALLA.",
    disclaimer:
      "ROALLA peut recevoir une rémunération de certains fournisseurs si vous choisissez d’acheter par notre intermédiaire. Nous le confirmons avant toute recommandation. Cette fiche ne recommande aucun fournisseur et ne remplace pas un examen de sécurité, juridique ou financier.",
    ctas: {
      replace: "Obtenir une revue de liste restreinte de remplacement",
      consolidate: "M’aider à regrouper des outils qui se chevauchent",
      introduce: "Valider cette capacité avant d’acheter",
      renew: "Remettre en question ce renouvellement avant de signer",
    } as Record<TechnologyBriefInput["objective"], string>,
    printTitles: {
      replace: "Fiche de décision de remplacement",
      consolidate: "Fiche de décision de consolidation",
      introduce: "Fiche de décision pour une nouvelle capacité",
      renew: "Fiche de décision de renouvellement",
    } as Record<TechnologyBriefInput["objective"], string>,
    processes: {
      replace:
        "Confirmer le résultat que l’outil actuel ne livre pas, comparer une liste restreinte privée, vérifier le risque de migration et le coût total, puis planifier la bascule et l’adoption.",
      consolidate:
        "Inventorier les outils et propriétaires qui se chevauchent, nommer le résultat unique que la pile doit servir, comparer les options de consolidation, puis retirer les licences redondantes selon un calendrier.",
      introduce:
        "Définir le résultat d’affaires et les mesures de succès, valider la plus petite capacité utile, vérifier l’intégration et la charge d’adoption, puis piloter avant un déploiement plus large.",
      renew:
        "Établir ce que vous payez et utilisez aujourd’hui, remettre en question les hypothèses de renouvellement avec une liste restreinte fondée sur les besoins, comparer sortie ou renégociation, puis décider renouveler, renégocier ou remplacer.",
    } as Record<TechnologyBriefInput["objective"], string>,
    fields: {
      objective: {
        label: "Que devez-vous accomplir?",
        options: {
          replace: "Remplacer un outil",
          consolidate: "Regrouper plusieurs outils",
          introduce: "Ajouter une nouvelle capacité",
          renew: "Évaluer un renouvellement",
        },
      },
      urgency: {
        label: "Quand la décision est-elle nécessaire?",
        options: {
          planned: "Planification à long terme",
          "six-months": "Dans les six mois",
          "three-months": "Dans les trois mois",
          urgent: "Urgent",
        },
      },
      dataSensitivity: {
        label: "Quel type de données sera traité?",
        options: {
          standard: "Données d’affaires courantes",
          personal: "Renseignements personnels",
          regulated: "Données réglementées",
          critical: "Données essentielles ou très sensibles",
        },
      },
      integrations: {
        label: "Quel niveau d’intégration est requis?",
        options: {
          none: "Aucune",
          few: "Quelques systèmes",
          several: "Plusieurs systèmes",
          complex: "Environnement complexe",
        },
      },
      adoption: {
        label: "Qui devra utiliser la solution?",
        options: {
          small: "Petite équipe",
          department: "Un service",
          organization: "Toute l’organisation",
          external: "Employés et utilisateurs externes",
        },
      },
    },
  },
} as const;

const priorityFr: Record<string, string> = {
  "Business outcome and measurable requirements": "Résultat d’affaires et exigences mesurables",
  "Total cost, contract commitments, and exit options": "Coût total, engagements contractuels et options de sortie",
  "Security, privacy, compliance, and data handling review":
    "Examen de la sécurité, de la confidentialité, de la conformité et des données",
  "Integration, migration, data quality, and failure-path review":
    "Examen des intégrations, de la migration, de la qualité des données et des scénarios d’échec",
  "Adoption, training, support, and accountable ownership":
    "Adoption, formation, soutien et responsabilité claire",
  "Transition risk, interim controls, and realistic decision milestones":
    "Risques de transition, contrôles temporaires et étapes réalistes",
};

const fieldOrder: Array<keyof TechnologyBriefInput> = [
  "objective",
  "urgency",
  "dataSensitivity",
  "integrations",
  "adoption",
];

const initial: TechnologyBriefInput = {
  objective: "replace",
  urgency: "planned",
  dataSensitivity: "standard",
  integrations: "few",
  adoption: "department",
};

function choiceButton(active: boolean) {
  return active
    ? "cursor-pointer rounded-xl border-2 border-primary bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition"
    : "cursor-pointer rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:border-primary/50 hover:bg-slate-50";
}

export default function TechnologyDecisionBrief({ locale }: { locale: string }) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [input, setInput] = useState(initial);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wizardMode, setWizardMode] = useState(false);
  const [step, setStep] = useState(1);
  const [showSaveReminder, setShowSaveReminder] = useState(false);
  const trackedSteps = useRef<Set<number>>(new Set());

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("roalla-technology-decision-brief") || "{}");
      if (stored && typeof stored === "object") {
        setInput((current) => ({ ...current, ...stored }));
      }
    } catch {
      /* ignore */
    }
    const preferWizard = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
    setWizardMode(preferWizard);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!wizardMode || trackedSteps.current.has(step)) return;
    trackedSteps.current.add(step);
    trackAnalyticsEvent("technology_brief_step", { step, total: TOTAL_STEPS });
  }, [step, wizardMode]);

  const priorities = useMemo(() => technologyDecisionPriorities(input), [input]);
  const processText = t.processes[input.objective];
  const printTitle = t.printTitles[input.objective];
  const ctaLabel = t.ctas[input.objective];

  function update<K extends keyof TechnologyBriefInput>(key: K, value: TechnologyBriefInput[K], advance = false) {
    setInput((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setShowSaveReminder(true);
    if (advance && wizardMode && step < TOTAL_STEPS) {
      window.setTimeout(() => setStep((current) => Math.min(TOTAL_STEPS, current + 1)), 180);
    }
  }

  function save(markComplete = false) {
    localStorage.setItem("roalla-technology-decision-brief", JSON.stringify({ ...input, savedAt: new Date().toISOString() }));
    setSaved(true);
    setShowSaveReminder(false);
    if (markComplete) {
      trackAnalyticsEvent("technology_brief_completed", {
        objective: input.objective,
        urgency: input.urgency,
        dataSensitivity: input.dataSensitivity,
      });
    }
  }

  const fieldLabels = (key: keyof TechnologyBriefInput) => {
    const field = t.fields[key];
    const value = input[key] as string;
    return field.options[value as keyof typeof field.options] as string;
  };

  const contactGoal = [
    printTitle,
    `Objective: ${fieldLabels("objective")}`,
    `Urgency: ${fieldLabels("urgency")}`,
    `Data: ${fieldLabels("dataSensitivity")}`,
    `Integrations: ${fieldLabels("integrations")}`,
    `Adoption: ${fieldLabels("adoption")}`,
    `Priorities: ${priorities.join("; ")}`,
    "Source: Technology Decision Brief",
  ]
    .join("\n")
    .slice(0, 900);

  const contactHref = `/${locale}/contact?intent=consulting&focus=technology&goal=${encodeURIComponent(contactGoal)}&from_page=${encodeURIComponent("/tools/technology-decision-brief")}`;

  const translatedPriority = (value: string) => (language === "fr" ? priorityFr[value] ?? value : value);

  function ChoiceLabel({ active, children }: { active: boolean; children: React.ReactNode }) {
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

  function FieldChoices({
    fieldKey,
    advance = false,
  }: {
    fieldKey: keyof TechnologyBriefInput;
    advance?: boolean;
  }) {
    const field = t.fields[fieldKey];
    const options = Object.entries(field.options) as Array<[string, string]>;
    return (
      <fieldset>
        <legend className="text-lg font-serif font-bold text-slate-950 sm:text-xl">{field.label}</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {options.map(([value, label]) => (
            <label key={value} className="block">
              <input
                className="sr-only"
                type="radio"
                name={fieldKey}
                checked={input[fieldKey] === value}
                onChange={() => update(fieldKey, value as TechnologyBriefInput[typeof fieldKey], advance)}
              />
              <ChoiceLabel active={input[fieldKey] === value}>{label}</ChoiceLabel>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  const resultsPanel = (
    <section className="rounded-2xl border border-primary/25 bg-white p-6 shadow-sm sm:p-8">
      <ShieldCheck className="h-8 w-8 text-primary-dark" />
      <h2 className="mt-4 text-2xl font-serif font-bold text-slate-950">{printTitle}</h2>
      <p className="mt-1 text-sm text-slate-600">{t.resultsTitle}</p>
      <ol className="mt-5 space-y-3">
        {priorities.map((item, index) => (
          <li key={item} className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <span className="font-bold text-primary-dark">{index + 1}</span>
            {translatedPriority(item)}
          </li>
        ))}
      </ol>
      <div className="mt-6 rounded-lg border border-slate-200 p-4 text-sm leading-6 text-slate-700">
        <strong>{t.processLabel}:</strong> {processText}
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-bold uppercase tracking-[.14em] text-primary-dark">{t.nextStepsTitle}</h3>
        <ol className="mt-3 space-y-2">
          {t.nextSteps.map((item, index) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
              <span className="font-bold text-primary-dark">{index + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-5 flex flex-wrap gap-3 print:hidden">
        <a
          href={contactHref}
          onClick={() => {
            save(true);
            trackAnalyticsEvent("technology_brief_contact", { objective: input.objective });
          }}
          className="inline-flex min-h-[48px] items-center rounded-lg bg-brand-gold px-5 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light"
        >
          {ctaLabel}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </a>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            save(true);
            setShowSaveReminder(false);
          }}
          className="inline-flex min-h-[48px] items-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-primary disabled:opacity-60"
        >
          <LockKeyhole className="mr-2 h-4 w-4" aria-hidden />
          {saved ? t.saved : t.save}
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            save(true);
            trackAnalyticsEvent("technology_brief_pdf", { objective: input.objective });
            window.print();
          }}
          className="inline-flex min-h-[48px] items-center rounded-lg border border-primary px-4 py-3 text-sm font-semibold text-primary-dark hover:bg-primary/5 disabled:opacity-60"
        >
          <Download className="mr-2 h-4 w-4" aria-hidden />
          {t.print}
        </button>
      </div>
      <p className="mt-4 flex gap-2 text-xs text-slate-500 print:hidden">
        <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden />
        {t.private}
      </p>
      <p className="mt-4 text-xs leading-5 text-slate-500">{t.disclaimer}</p>
    </section>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 print:hidden">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setWizardMode(true)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              wizardMode ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.modeWizard}
          </button>
          <button
            type="button"
            onClick={() => setWizardMode(false)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              !wizardMode ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.modeAll}
          </button>
        </div>
        <p className="text-sm text-slate-600">{t.modeHint}</p>
      </div>

      {showSaveReminder ? (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-brand-gold/40 bg-brand-gold/15 px-4 py-3 text-sm text-slate-900 print:hidden">
          <p className="font-medium">{t.saveReminder}</p>
          <button type="button" onClick={() => setShowSaveReminder(false)} className="rounded-md p-1 text-slate-600 hover:bg-white/70" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {wizardMode ? (
        <div className="space-y-6 print:hidden">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-primary-dark">
                {t.stepOf} {step}/{TOTAL_STEPS}
              </p>
            </div>
            <div className="mt-4 flex gap-2" aria-hidden>
              {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${index + 1 <= step ? "bg-primary" : "bg-slate-200"}`}
                />
              ))}
            </div>
            <div className="mt-6">
              <FieldChoices fieldKey={fieldOrder[step - 1]} advance />
            </div>
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
                  type="button"
                  onClick={() => {
                    setShowSaveReminder(true);
                    save(true);
                    document.getElementById("technology-decision-result")?.focus();
                  }}
                  className="inline-flex min-h-[48px] items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  {t.next}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          </section>
          <div id="technology-decision-result" tabIndex={-1} className="outline-none">
            {resultsPanel}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] print:hidden">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-950">{t.contextTitle}</h2>
            <div className="mt-6 space-y-8">
              {fieldOrder.map((key) => (
                <FieldChoices key={key} fieldKey={key} />
              ))}
            </div>
          </section>
          {resultsPanel}
        </div>
      )}

      <TechnologyDecisionBriefPrintSheet
        locale={locale}
        eyebrow={t.printEyebrow}
        title={printTitle}
        subtitle={processText}
        contextLabel={t.contextLabel}
        contextValue={fieldOrder.map((key) => fieldLabels(key)).join(" · ")}
        processLabel={t.processLabel}
        processValue={processText}
        fields={[
          {
            label: t.resultsTitle,
            hint: t.prioritiesHint,
            value: priorities.map((item, index) => `${index + 1}. ${translatedPriority(item)}`).join("\n"),
            accent: "teal",
          },
          {
            label: t.nextStepsTitle,
            value: t.nextSteps.map((item, index) => `${index + 1}. ${item}`).join("\n"),
            accent: "gold",
          },
        ]}
        disclaimer={t.disclaimer}
      />
    </div>
  );
}
