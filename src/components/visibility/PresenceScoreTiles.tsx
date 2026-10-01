"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Info, X } from "lucide-react";
import type { ScoreName } from "@/lib/website-visibility/pagespeed";

const SCORE_ORDER: ScoreName[] = ["performance", "accessibility", "bestPractices", "seo"];

type ScoreHelp = {
  means: string;
  improve: string;
  adoption: string;
};

const guidance = {
  en: {
    scoreLabels: {
      performance: "Lighthouse lab performance",
      accessibility: "Accessibility",
      bestPractices: "Reliability",
      seo: "Search readiness",
    },
    tileLabels: {
      performance: "Page speed",
      accessibility: "Accessibility",
      bestPractices: "Reliability",
      seo: "Search readiness",
    },
    notScored: "Not scored",
    scoreInfo: "About this score",
    closeInfo: "Close",
    aodaLabel: "AODA and WCAG",
    aodaBody:
      "The same details support both the standard and the visit. These automated checks follow WCAG criteria Lighthouse can test. Ontario’s AODA uses WCAG 2.0 Level AA as the public-website standard for designated public-sector organizations and for businesses or non-profits with 50 or more employees. This score is a lab signal. It is not an AODA or WCAG conformance certificate, and it does not decide whether the AODA applies.",
    aodaBand: {
      strong: "No major WCAG barriers showed up. That care in the details helps more visitors inquire and convert, and it lines up with WCAG Level AA, the level Ontario’s website standard names.",
      gaps: "Gaps showed up that can affect WCAG Level AA, the level Ontario’s website standard names. Those missed details are also where inquiries and conversions slip.",
      barriers: "Serious barriers showed up. They often map to WCAG failures when the AODA website standard applies, and they stop people from using the page and converting.",
    },
    scoreHelpLabels: {
      means: "What this score means",
      improve: "Why a higher score helps",
      adoption: "Impact on adoption",
    },
    scoreHelp: {
      performance: {
        means: "A lab test of how fast this page loads and becomes usable on a simulated connection. 90 or above is strong. 50 to 89 has room to improve. Below 50 feels slow.",
        improve: "Raising it shortens the wait before text, images, and buttons are ready. That is the difference between someone seeing your offer and leaving.",
        adoption: "People on phones abandon slow pages before they read or contact you. A faster page keeps more of the visitors you already earned.",
      },
      accessibility: {
        means: "How carefully the page handles the details people rely on: labels, contrast, text size, and controls that work with a keyboard or a screen reader. A high score means fewer of those details get in the way.",
        improve: "A higher score is attention to those details. Clearer labels, contrast, and controls help more people read the offer, trust the page, and finish an inquiry.",
        adoption: "Clients adopt and convert when the page is easy to finish. Missed details turn ready visitors away before they inquire. Fixing them keeps more of those visits moving toward a conversation.",
      },
      bestPractices: {
        means: "Whether the page follows current, safe practices, such as a secure connection and features that work in modern browsers.",
        improve: "A higher score reduces errors, warnings, and trust gaps that interrupt a visit.",
        adoption: "People hesitate or leave when a site feels broken or unsafe. Reliability keeps the visit moving toward a conversation.",
      },
      seo: {
        means: "How clearly the page describes itself to search engines through its title, description, and structure. This score is not a ranking guarantee.",
        improve: "Clearer search signals make the right page easier to understand and more likely to appear for searches your customers already make.",
        adoption: "People cannot choose a business they never find. Search readiness turns an existing search into a visit.",
      },
    } satisfies Record<ScoreName, ScoreHelp>,
    agenticLabel: "Agentic (AI) readiness",
    agenticHelp: {
      means: "How ready this page is for an AI assistant that fetches it and answers a question about the business. Search readiness can be high while this score stays low.",
      improve: "A higher score means the page has text an assistant can quote, business facts it can trust, and permission to retrieve the page.",
      adoption: "People increasingly ask an assistant before they search. If the assistant cannot describe the offer, that inquiry never reaches you.",
    },
    agenticNoteLabel: "Separate from search",
    agenticNote: "This score reads public signals on the page. It is not a search ranking, and it does not promise that an assistant will mention the business.",
  },
  fr: {
    scoreLabels: {
      performance: "Performance de laboratoire Lighthouse",
      accessibility: "Accessibilité",
      bestPractices: "Fiabilité",
      seo: "Préparation à la recherche",
    },
    tileLabels: {
      performance: "Vitesse",
      accessibility: "Accessibilité",
      bestPractices: "Fiabilité",
      seo: "Recherche",
    },
    notScored: "Non évalué",
    scoreInfo: "À propos de ce score",
    closeInfo: "Fermer",
    aodaLabel: "LAPHO et WCAG",
    aodaBody:
      "Les mêmes détails servent à la fois la norme et la visite. Ces vérifications automatisées suivent des critères WCAG que Lighthouse peut tester. En Ontario, la LAPHO (AODA) utilise les WCAG 2.0 niveau AA comme norme pour les sites publics des organismes désignés du secteur public et des entreprises ou organismes sans but lucratif de 50 employés ou plus. Ce score est un signal de laboratoire. Ce n’est pas un certificat de conformité à la LAPHO ou aux WCAG, et il ne détermine pas si la loi s’applique.",
    aodaBand: {
      strong: "Aucun obstacle WCAG important n’est apparu. Ce soin du détail aide plus de visiteurs à demander et à convertir, et il rejoint le niveau AA des WCAG, celui que vise la norme ontarienne pour les sites Web.",
      gaps: "Des écarts sont apparus qui peuvent toucher le niveau AA des WCAG, celui que vise la norme ontarienne. Ces détails manqués sont aussi là où les demandes et les conversions se perdent.",
      barriers: "Des obstacles importants sont apparus. Ils correspondent souvent à des échecs WCAG lorsque la norme de la LAPHO s’applique, et ils empêchent d’utiliser la page et de convertir.",
    },
    scoreHelpLabels: {
      means: "Ce que ce score signifie",
      improve: "Pourquoi l’améliorer",
      adoption: "Effet sur l’adoption",
    },
    scoreHelp: {
      performance: {
        means: "Un test de laboratoire mesure la vitesse de chargement et le moment où la page devient utilisable, sur une connexion simulée. 90 ou plus est solide. De 50 à 89, il reste du travail. Sous 50, la page paraît lente.",
        improve: "Un score plus élevé réduit l’attente avant que le texte, les images et les boutons soient prêts. C’est ce qui sépare une visite où l’offre est vue d’une visite abandonnée.",
        adoption: "Sur téléphone, les gens quittent une page lente avant de lire ou d’écrire. Une page plus rapide garde davantage de visiteurs que vous avez déjà attirés.",
      },
      accessibility: {
        means: "Le soin apporté aux détails dont les gens dépendent : libellés, contraste, taille du texte et commandes utilisables au clavier ou avec un lecteur d’écran. Un score élevé veut dire que moins de ces détails gênent la visite.",
        improve: "Un score plus élevé, c’est de l’attention à ces détails. Des libellés, un contraste et des commandes plus clairs aident plus de gens à lire l’offre, à faire confiance à la page et à terminer une demande.",
        adoption: "Les clients adoptent et convertissent quand la page est facile à terminer. Des détails manqués font partir des visiteurs prêts à agir avant qu’ils écrivent. Les corriger garde plus de ces visites en route vers une conversation.",
      },
      bestPractices: {
        means: "La page suit des pratiques actuelles et sûres, comme une connexion sécurisée et des fonctions qui marchent dans les navigateurs récents.",
        improve: "Un score plus élevé réduit les erreurs, les avertissements et les doutes qui interrompent une visite.",
        adoption: "Les gens hésitent ou partent quand un site semble brisé ou peu sûr. La fiabilité laisse la visite avancer vers une conversation.",
      },
      seo: {
        means: "La clarté avec laquelle la page se décrit aux moteurs de recherche : titre, description et structure. Ce score ne garantit pas une position dans les résultats.",
        improve: "Des signaux plus clairs aident la bonne page à être comprise et proposée pour les recherches que vos clients font déjà.",
        adoption: "On ne choisit pas une entreprise qu’on ne trouve pas. La préparation à la recherche transforme une recherche existante en visite.",
      },
    } satisfies Record<ScoreName, ScoreHelp>,
    agenticLabel: "Préparation agentique (IA)",
    agenticHelp: {
      means: "La capacité d’un assistant d’IA à récupérer cette page et à décrire l’entreprise. La préparation à la recherche peut être élevée pendant que ce score reste bas.",
      improve: "Un score plus élevé veut dire que la page offre un texte à citer, des faits d’entreprise fiables et l’autorisation de récupérer la page.",
      adoption: "De plus en plus de gens demandent à un assistant avant de chercher. Si l’assistant ne peut pas décrire l’offre, cette demande ne vous rejoint pas.",
    },
    agenticNoteLabel: "Distinct de la recherche",
    agenticNote: "Ce score lit des signaux publics de la page. Ce n’est pas une position dans les résultats et il ne promet pas qu’un assistant mentionnera l’entreprise.",
  },
} as const;

function wcagReading(score: number | null): "strong" | "gaps" | "barriers" | null {
  if (score == null) return null;
  if (score >= 90) return "strong";
  if (score >= 50) return "gaps";
  return "barriers";
}

function scoreTone(score: number | null) {
  if (score == null) return "text-slate-500";
  if (score >= 90) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-rose-700";
}

function ScoreInfoButton({
  title,
  help,
  labels,
  openLabel,
  closeLabel,
  compliance,
}: {
  title: string;
  help: ScoreHelp;
  labels: { means: string; improve: string; adoption: string };
  openLabel: string;
  closeLabel: string;
  compliance?: { label: string; body: string; reading?: string };
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) triggerRef.current?.focus();
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`${openLabel}: ${title}`}
        onClick={() => setOpen(true)}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-white hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 print:hidden"
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center print:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 id={titleId} className="text-lg font-serif font-bold text-slate-950">{title}</h3>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={closeLabel}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <dl className="mt-4 space-y-4">
              {([
                ["means", help.means],
                ["improve", help.improve],
                ["adoption", help.adoption],
              ] as const).map(([key, body]) => (
                <div key={key}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-primary-dark">{labels[key]}</dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-700">{body}</dd>
                </div>
              ))}
              {compliance ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-primary-dark">{compliance.label}</dt>
                  {compliance.reading ? <dd className="mt-1 text-sm font-semibold leading-6 text-slate-900">{compliance.reading}</dd> : null}
                  <dd className="mt-1 text-sm leading-6 text-slate-700">{compliance.body}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function AgenticScoreTile({
  score,
  language,
}: {
  score: number;
  language: "en" | "fr";
}) {
  const t = guidance[language];
  return (
    <div className="flex h-full flex-col rounded-lg bg-slate-50 p-4">
      <p className="flex items-start justify-between gap-1 text-[11px] font-semibold leading-4 text-slate-500">
        <span>{t.agenticLabel}</span>
        <ScoreInfoButton
          title={t.agenticLabel}
          help={t.agenticHelp}
          labels={t.scoreHelpLabels}
          openLabel={t.scoreInfo}
          closeLabel={t.closeInfo}
          compliance={{ label: t.agenticNoteLabel, body: t.agenticNote }}
        />
      </p>
      <p className={`mt-auto pt-1 text-4xl font-bold ${scoreTone(score)}`}>{score}<span className="text-lg font-semibold text-slate-500">/100</span></p>
    </div>
  );
}

export function PresenceScoreTiles({
  scores,
  language,
}: {
  scores: Record<ScoreName, number | null>;
  language: "en" | "fr";
}) {
  const t = guidance[language];
  return (
    <dl className="mt-4 grid grid-cols-2 items-stretch gap-2">
      {SCORE_ORDER.map((name) => {
        const reading = name === "accessibility" ? wcagReading(scores[name]) : null;
        return (
          <div key={name} className="flex h-full flex-col rounded-lg bg-slate-50 p-3">
            <dt className="flex min-h-8 items-start justify-between gap-1 text-[11px] font-semibold leading-4 text-slate-500">
              <span>{t.tileLabels[name]}</span>
              <ScoreInfoButton
                title={t.scoreLabels[name]}
                help={t.scoreHelp[name]}
                labels={t.scoreHelpLabels}
                openLabel={t.scoreInfo}
                closeLabel={t.closeInfo}
                compliance={name === "accessibility" ? {
                  label: t.aodaLabel,
                  body: t.aodaBody,
                  reading: reading ? t.aodaBand[reading] : undefined,
                } : undefined}
              />
            </dt>
            <dd className={`mt-auto pt-1 text-2xl font-bold ${scoreTone(scores[name])}`}>{scores[name] ?? t.notScored}</dd>
          </div>
        );
      })}
    </dl>
  );
}
