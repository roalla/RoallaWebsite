"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Gauge,
  LoaderCircle,
  RefreshCw,
  SearchCheck,
  Share2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AgenticScoreTile, PresenceScoreTiles } from "@/components/visibility/PresenceScoreTiles";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { buildDigitalPresenceActions } from "@/lib/digital-presence/actions";
import { buildSnapshotNarrative } from "@/lib/digital-presence/narrative";
import type { SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";
import type {
  ScoreName,
  WebsiteVisibilitySnapshot,
} from "@/lib/website-visibility/pagespeed";
import { isSamePublicPage } from "@/lib/website-visibility/page-url";

type TechnicalReport = {
  snapshot?: WebsiteVisibilitySnapshot;
  cached?: boolean;
  error?: string;
};

type TechnicalResponse = {
  mobile?: TechnicalReport;
  desktop?: TechnicalReport;
  error?: string;
};

type SnapshotHistory = {
  checkedAt: string;
  mobilePerformance: number | null;
  desktopPerformance: number | null;
  socialScore: number | null;
};

type CompetitorResult = {
  url: string;
  technical: TechnicalResponse | null;
  social: SocialPresenceSnapshot | null;
};

const HISTORY_PREFIX = "roalla-digital-snapshot:";

function storageKey(value: string) {
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(candidate);
    parsed.search = "";
    parsed.hash = "";
    return `${HISTORY_PREFIX}${parsed.toString()}`;
  } catch {
    return `${HISTORY_PREFIX}${value.trim().toLowerCase()}`;
  }
}

function readHistory(value: string): SnapshotHistory | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(storageKey(value));
    return stored ? (JSON.parse(stored) as SnapshotHistory) : null;
  } catch {
    return null;
  }
}

function saveHistory(
  value: string,
  technical: TechnicalResponse | null,
  social: SocialPresenceSnapshot | null,
) {
  if (typeof window === "undefined") return;
  const history: SnapshotHistory = {
    checkedAt: new Date().toISOString(),
    mobilePerformance: technical?.mobile?.snapshot?.scores.performance ?? null,
    desktopPerformance: technical?.desktop?.snapshot?.scores.performance ?? null,
    socialScore: social?.score ?? null,
  };
  try {
    window.localStorage.setItem(storageKey(value), JSON.stringify(history));
  } catch {
    // The report still works when private browsing blocks local storage.
  }
}

function scoreDelta(current: number | null | undefined, previous: number | null | undefined) {
  if (current == null || previous == null) return null;
  return current - previous;
}

const scoreOrder: ScoreName[] = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
];

const copy = {
  en: {
    urlLabel: "Your website address",
    placeholder: "https://example.com",
    submit: "Check my website",
    starting: "Starting your website check…",
    both: "Checking your website and social sharing setup…",
    technicalOnly: "Your social sharing results are ready. Finishing the website check…",
    socialOnly: "Your website results are ready. Finishing the social sharing check…",
    resultsTitle: "Your website results",
    resultsIntro: "These scores show how your website works for visitors, search engines, and social sharing. Each area is shown separately so you can see what needs attention.",
    technicalTitle: "Website experience",
    technicalDescription: "How your website performs on phones and computers",
    socialTitle: "Social sharing setup",
    socialDescription: "How well your website connects to your social profiles and creates sharing previews",
    mobile: "Mobile",
    desktop: "Desktop",
    detailedSocial: "See profiles and the sharing preview",
    notScored: "Not scored",
    fresh: "Fresh Google test",
    cached: "Result cached for up to 15 minutes",
    tested: "Tested",
    finalUrl: "Final page tested",
    redirectNote: "You entered {requested}. That address redirects, so these scores are for the landing page, matching the page Google PageSpeed reports.",
    lighthouse: "Lighthouse version",
    compareGoogle: "Compare this run with Google PageSpeed",
    fieldTitle: "Real visitor experience",
    fieldIntro: "Public Chrome visitor data from the previous 28 days",
    fieldPage: "This page",
    fieldOrigin: "Whole website",
    noFieldData: "Google does not have enough public visitor data for this page yet.",
    labTitle: "Page speed details",
    opportunitiesTitle: "Ways to improve page speed",
    freshTest: "Run a fresh Google test",
    freshHelp: "Performance can change between tests because traffic, hosting, and page content change. A fresh test bypasses ROALLA’s 15-minute cache.",
    previousTitle: "Change since your previous check",
    previousIntro: "Stored only in this browser. This comparison is not shared with ROALLA.",
    previousChecked: "Previous check",
    improved: "improved",
    declined: "lower",
    unchanged: "no change",
    competitorTitle: "Compare with another public website",
    competitorIntro: "Enter a competitor or peer website to compare the same public setup checks. This does not compare business quality, revenue, or market position.",
    competitorLabel: "Website to compare",
    competitorButton: "Compare websites",
    competitorLoading: "Checking the comparison website…",
    competitorError: "We could not complete the comparison. Check the website address and try again.",
    yourWebsite: "Your website",
    comparisonWebsite: "Comparison website",
    mobilePerformance: "Mobile lab performance",
    desktopPerformance: "Desktop lab performance",
    socialScore: "Social sharing setup",
    impact: "Likely impact",
    effort: "Typical effort",
    high: "High",
    medium: "Medium",
    low: "Low",
    actionsTitle: "What to improve first",
    actionsIntro: "Start with these areas. They are likely to make the greatest difference based on this check.",
    fixNow: "Fix now",
    planNext: "Plan next",
    automatedStrong: "Your results are strong. The next step is to make sure the message, content, and customer journey are helping visitors take action.",
    humanTitle: "What the scores cannot tell you",
    human: [
      "Whether visitors quickly understand what you offer",
      "Which social channels are right for your customers",
      "Whether your content builds trust and encourages inquiries",
    ],
    methodology: "How we calculate the results",
    methodologyBody:
      "Website category scores come from a Lighthouse lab test run by Google PageSpeed Insights. When the address redirects, the test uses the landing page, which is what Google PageSpeed scores. Real visitor information, when available, comes from aggregated Chrome data over the previous 28 days. Social sharing results come from public information on the page you entered. These results stay separate because they measure different parts of your online presence.",
    print: "Save my branded action plan",
    reportLabel: "ROALLA Digital Presence Action Plan",
    reportPrepared: "Prepared",
    executiveTitle: "Executive summary",
    recommendedTitle: "Recommended ROALLA starting point",
    recommendationVisibility: "Visibility Improvement Sprint",
    recommendationVisibilityBody: "Improve the search, social, and technical signals that help people and digital systems find and understand the business.",
    recommendationConversion: "Website Conversion Refresh",
    recommendationConversionBody: "Address experience and customer-journey barriers before deciding whether a complete rebuild is necessary.",
    recommendationManaged: "Digital Baseline and Managed Optimization",
    recommendationManagedBody: "Protect the current foundation, monitor change, and improve the next highest-value opportunity over time.",
    blueprintLink: "Build my 90-day value blueprint",
    calculatorsLink: "Estimate potential business value",
    monitoringLink: "Preview ongoing monitoring",
    ctaTitle: "Get a free 15-minute review of your results",
    ctaBody: "A ROALLA specialist will explain your biggest opportunity, answer your questions, and recommend a practical next step.",
    ctaSteps: ["We review your results", "You receive one clear priority", "You decide whether to continue"],
    ctaProof: "30+ years of business and technology experience across 500+ engagements.",
    ctaReassurance: "Free review. No obligation. Personal reply within one business day.",
    cta: "Request my free results review",
    sprintEyebrow: "Optional paid next step",
    sprintTitle: "Digital Presence Improvement Sprint",
    sprintTimeline: "Focused delivery, usually 1 to 2 weeks after scope is confirmed",
    sprintBody: "Turn the findings into a practical improvement plan with clear priorities, implementation guidance, and a follow-up check.",
    sprintItems: ["Priority action plan", "Effort and implementation guidance", "Follow-up measurement"],
    sprintPrice: "Scope and pricing are confirmed after your free results review.",
    sprintCta: "Discuss the improvement sprint",
    partialTitle: "We could not complete every part of the check",
    technicalError: "We could not measure the website experience.",
    socialError: "We could not measure the social sharing setup.",
    actionTechnical: {
      performance: "Help the page load and respond faster",
      accessibility: "Make the page easier for everyone to use",
      bestPractices: "Improve website reliability and security",
      seo: "Help search engines understand the page",
    },
    actionSocial: {
      profileLinks: "Make your main social profiles easy to find",
      structuredProfiles: "Help search engines connect your website to your social profiles",
      openGraph: "Improve how your page looks when it is shared",
      socialCards: "Add a clear image and message for social sharing",
      organizationSchema: "Help search engines recognize your business name and logo",
      pageIdentity: "Add a clear page title, description, and preferred address",
    },
    actionCost: {
      performance: "On {strategies}, people leave a slow page before they see the offer. Current score: {score}/100.",
      accessibility: "On {strategies}, missed labels, contrast, or controls can stop a ready visitor from sending an inquiry. Current score: {score}/100.",
      bestPractices: "On {strategies}, errors and trust gaps interrupt the visit before it becomes a conversation. Current score: {score}/100.",
      seo: "On {strategies}, an unclear page is harder for the right customers to find. Current score: {score}/100.",
      profileLinks: "People cannot easily reach your main social profiles from this page. Current result: {score}%.",
      structuredProfiles: "Search systems cannot reliably connect this website to your social profiles. Current result: {score}%.",
      openGraph: "A shared link can arrive without a clear title, description, or image. Current result: {score}%.",
      socialCards: "A social preview can arrive without a clear image and message. Current result: {score}%.",
      organizationSchema: "Search systems may not recognize the business name and logo. Current result: {score}%.",
      pageIdentity: "Without a clear title, description, or preferred address, the page is harder to choose. Current result: {score}%.",
      agentic: "Search readiness does not measure this. An assistant needs text it can quote, facts it can trust, and permission to retrieve the page. Current score: {score}/100.",
    },
    phoneGap: "Your phone result averages {mobile} and your computer result averages {desktop}. Most visitors will feel the phone result.",
    agenticGap: "Search readiness averages {seo}. Agentic readiness is {agentic}. A page can be easy to find in search and still be hard for an assistant to quote or describe.",
    actionAgentic: "Make the page easier for an assistant to describe",
    findingTitle: "One finding from this check",
    findingDevice: { mobile: "a phone", desktop: "a computer" },
    findingOpportunity: "On {strategy}, the largest measured slowdown is “{title}”.{detail}",
    findingDelay: "That delay is what people feel before they see the offer.",
    findingSocial: {
      profileLinks: "The clearest sharing gap is the path to your social profiles. People cannot easily reach them from this page.",
      structuredProfiles: "The clearest sharing gap is the connection between this website and your social profiles.",
      openGraph: "The clearest sharing gap is the link preview. A shared link can arrive without a clear title, description, or image.",
      socialCards: "The clearest sharing gap is the social card. A preview can arrive without a clear image and message.",
      organizationSchema: "The clearest sharing gap is business identity. Search systems may not recognize the name and logo.",
      pageIdentity: "The clearest sharing gap is the page identity. Without a clear title, description, or preferred address, the page is harder to choose.",
    },
    lead: {
      seo: "Search readiness averages {score}. The useful starting point is making this page easier for the right customers to find.",
      social: "Social sharing setup is {score} out of 100. A shared link is not yet carrying a clear message.",
      performance: "Lab performance averages {score}. Visitors are waiting before they can see the offer.",
      accessibility: "Accessibility averages {score}. Missed details on this page are where inquiries slip.",
      strong: "The measured scores are in a strong range. The useful next step is protecting that foundation and improving the next detail that can still grow inquiries.",
    },
    genericError: "The snapshot could not be completed. Please try again.",
    note: "Digital presence snapshot",
  },
  fr: {
    urlLabel: "Adresse de votre site Web",
    placeholder: "https://exemple.ca",
    submit: "Vérifier mon site",
    starting: "Démarrage de la vérification…",
    both: "Vérification de votre site et du partage social…",
    technicalOnly: "Les résultats du partage social sont prêts. La vérification du site se termine…",
    socialOnly: "Les résultats du site sont prêts. La vérification du partage social se termine…",
    resultsTitle: "Les résultats de votre site",
    resultsIntro: "Ces scores montrent comment votre site fonctionne pour les visiteurs, les moteurs de recherche et le partage social. Chaque aspect est présenté séparément pour faciliter la lecture.",
    technicalTitle: "Expérience du site Web",
    technicalDescription: "Le fonctionnement de votre site sur téléphone et ordinateur",
    socialTitle: "Partage sur les réseaux sociaux",
    socialDescription: "La façon dont votre site présente vos profils et crée des aperçus de partage",
    mobile: "Mobile",
    desktop: "Ordinateur",
    detailedSocial: "Voir les profils et l’aperçu de partage",
    notScored: "Non évalué",
    fresh: "Nouveau test Google",
    cached: "Résultat conservé pendant un maximum de 15 minutes",
    tested: "Vérifié",
    finalUrl: "Page finale vérifiée",
    redirectNote: "Vous avez entré {requested}. Cette adresse redirige les visiteurs, donc ces scores portent sur la page d’arrivée, la même page que Google PageSpeed évalue.",
    lighthouse: "Version de Lighthouse",
    compareGoogle: "Comparer ce test dans Google PageSpeed",
    fieldTitle: "Expérience des visiteurs réels",
    fieldIntro: "Données publiques des visiteurs Chrome des 28 derniers jours",
    fieldPage: "Cette page",
    fieldOrigin: "Tout le site",
    noFieldData: "Google ne dispose pas encore de suffisamment de données publiques sur les visiteurs de cette page.",
    labTitle: "Détails sur la vitesse de la page",
    opportunitiesTitle: "Façons d’améliorer la vitesse de la page",
    freshTest: "Lancer un nouveau test Google",
    freshHelp: "La performance peut changer entre les tests selon le trafic, l’hébergement et le contenu. Un nouveau test contourne la mise en cache de 15 minutes de ROALLA.",
    previousTitle: "Changement depuis votre vérification précédente",
    previousIntro: "Ces données sont conservées uniquement dans ce navigateur et ne sont pas transmises à ROALLA.",
    previousChecked: "Vérification précédente",
    improved: "amélioration",
    declined: "baisse",
    unchanged: "aucun changement",
    competitorTitle: "Comparer avec un autre site public",
    competitorIntro: "Entrez le site d’un concurrent ou d’une entreprise comparable pour appliquer les mêmes vérifications publiques. Cette comparaison ne mesure pas la qualité de l’entreprise, ses revenus ni sa position sur le marché.",
    competitorLabel: "Site à comparer",
    competitorButton: "Comparer les sites",
    competitorLoading: "Vérification du site de comparaison…",
    competitorError: "Nous n’avons pas pu terminer la comparaison. Vérifiez l’adresse du site et réessayez.",
    yourWebsite: "Votre site",
    comparisonWebsite: "Site de comparaison",
    mobilePerformance: "Performance mobile en laboratoire",
    desktopPerformance: "Performance ordinateur en laboratoire",
    socialScore: "Configuration du partage social",
    impact: "Impact probable",
    effort: "Effort habituel",
    high: "Élevé",
    medium: "Moyen",
    low: "Faible",
    actionsTitle: "Les améliorations à faire en premier",
    actionsIntro: "Commencez par ces aspects. Selon cette vérification, ce sont ceux qui pourraient faire la plus grande différence.",
    fixNow: "Corriger maintenant",
    planNext: "Planifier ensuite",
    automatedStrong: "Vos résultats sont solides. La prochaine étape consiste à vérifier si le message, le contenu et le parcours client encouragent les visiteurs à agir.",
    humanTitle: "Ce que les scores ne peuvent pas évaluer",
    human: [
      "La rapidité avec laquelle les visiteurs comprennent votre offre",
      "Les réseaux sociaux les plus pertinents pour votre clientèle",
      "La capacité du contenu à inspirer confiance et à générer des demandes",
    ],
    methodology: "Comment les résultats sont calculés",
    methodologyBody:
      "Les scores du site proviennent d’un test de laboratoire Lighthouse exécuté par Google PageSpeed Insights. Si l’adresse redirige, le test utilise la page d’arrivée, soit celle que Google PageSpeed évalue. Les renseignements sur les visiteurs réels, lorsqu’ils sont disponibles, proviennent de données Chrome regroupées sur les 28 derniers jours. Les résultats du partage social proviennent des renseignements publics de la page entrée. Ces résultats restent séparés puisqu’ils évaluent différentes parties de votre présence en ligne.",
    print: "Enregistrer mon plan d’action ROALLA",
    reportLabel: "Plan d’action de présence numérique ROALLA",
    reportPrepared: "Préparé le",
    executiveTitle: "Sommaire exécutif",
    recommendedTitle: "Point de départ ROALLA recommandé",
    recommendationVisibility: "Sprint d’amélioration de la visibilité",
    recommendationVisibilityBody: "Améliorez les signaux de recherche, de partage social et de santé technique qui aident les personnes et les systèmes numériques à comprendre l’entreprise.",
    recommendationConversion: "Rafraîchissement de conversion du site",
    recommendationConversionBody: "Corrigez les obstacles de l’expérience et du parcours client avant de décider si une reconstruction complète est nécessaire.",
    recommendationManaged: "Référence numérique et optimisation gérée",
    recommendationManagedBody: "Protégez la fondation actuelle, suivez les changements et améliorez progressivement la prochaine possibilité de grande valeur.",
    blueprintLink: "Créer mon plan de valeur sur 90 jours",
    calculatorsLink: "Estimer la valeur d’affaires possible",
    monitoringLink: "Prévisualiser le suivi continu",
    ctaTitle: "Obtenez un examen gratuit de 15 minutes de vos résultats",
    ctaBody: "Un spécialiste de ROALLA expliquera votre principale possibilité d’amélioration, répondra à vos questions et recommandera une prochaine étape pratique.",
    ctaSteps: ["Nous examinons vos résultats", "Vous recevez une priorité claire", "Vous décidez si vous souhaitez poursuivre"],
    ctaProof: "Plus de 30 ans d’expérience en affaires et en technologie dans plus de 500 mandats.",
    ctaReassurance: "Examen gratuit. Sans obligation. Réponse personnelle dans un délai d’un jour ouvrable.",
    cta: "Demander mon examen gratuit",
    sprintEyebrow: "Prochaine étape payante optionnelle",
    sprintTitle: "Sprint d’amélioration de la présence numérique",
    sprintTimeline: "Livraison ciblée, généralement de 1 à 2 semaines après la confirmation de la portée",
    sprintBody: "Transformez les constats en plan pratique avec des priorités claires, des conseils de mise en œuvre et une vérification de suivi.",
    sprintItems: ["Plan d’action priorisé", "Effort et conseils de mise en œuvre", "Mesure de suivi"],
    sprintPrice: "La portée et le prix sont confirmés après votre examen gratuit des résultats.",
    sprintCta: "Discuter du sprint d’amélioration",
    partialTitle: "Nous n’avons pas pu terminer toutes les vérifications",
    technicalError: "Nous n’avons pas pu mesurer l’expérience du site.",
    socialError: "Nous n’avons pas pu mesurer le partage social.",
    actionTechnical: {
      performance: "Accélérer le chargement et la réaction de la page",
      accessibility: "Rendre la page plus facile à utiliser pour tous",
      bestPractices: "Améliorer la fiabilité et la sécurité du site",
      seo: "Aider les moteurs de recherche à comprendre la page",
    },
    actionSocial: {
      profileLinks: "Rendre vos principaux profils sociaux faciles à trouver",
      structuredProfiles: "Aider les moteurs de recherche à relier votre site à vos profils sociaux",
      openGraph: "Améliorer l’apparence de votre page lorsqu’elle est partagée",
      socialCards: "Ajouter une image et un message clairs pour le partage social",
      organizationSchema: "Aider les moteurs de recherche à reconnaître votre entreprise et son logo",
      pageIdentity: "Ajouter un titre, une description et une adresse de page clairs",
    },
    actionCost: {
      performance: "Sur {strategies}, les gens quittent une page lente avant de voir l’offre. Score actuel : {score}/100.",
      accessibility: "Sur {strategies}, des libellés, un contraste ou des commandes manqués peuvent empêcher un visiteur prêt d’envoyer une demande. Score actuel : {score}/100.",
      bestPractices: "Sur {strategies}, des erreurs et des doutes interrompent la visite avant qu’elle devienne une conversation. Score actuel : {score}/100.",
      seo: "Sur {strategies}, une page peu claire est plus difficile à trouver pour les bons clients. Score actuel : {score}/100.",
      profileLinks: "Les gens ne peuvent pas facilement atteindre vos principaux profils sociaux depuis cette page. Résultat actuel : {score} %.",
      structuredProfiles: "Les moteurs de recherche ne peuvent pas relier de façon fiable ce site à vos profils sociaux. Résultat actuel : {score} %.",
      openGraph: "Un lien partagé peut arriver sans titre, description ou image clairs. Résultat actuel : {score} %.",
      socialCards: "Un aperçu social peut arriver sans image ni message clairs. Résultat actuel : {score} %.",
      organizationSchema: "Les moteurs de recherche peuvent ne pas reconnaître le nom et le logo de l’entreprise. Résultat actuel : {score} %.",
      pageIdentity: "Sans titre, description ou adresse de page clairs, la page est plus difficile à choisir. Résultat actuel : {score} %.",
      agentic: "La préparation à la recherche ne mesure pas cela. Un assistant a besoin d’un texte à citer, de faits fiables et de l’autorisation de récupérer la page. Score actuel : {score}/100.",
    },
    phoneGap: "Le résultat sur téléphone est de {mobile} en moyenne et le résultat sur ordinateur est de {desktop}. La plupart des visiteurs ressentiront le résultat du téléphone.",
    agenticGap: "La préparation à la recherche est de {seo} en moyenne. La préparation agentique est de {agentic}. Une page peut être facile à trouver en recherche et rester difficile à citer ou à décrire pour un assistant.",
    actionAgentic: "Rendre la page plus facile à décrire pour un assistant",
    findingTitle: "Un constat de cette vérification",
    findingDevice: { mobile: "téléphone", desktop: "ordinateur" },
    findingOpportunity: "Sur {strategy}, le plus grand ralentissement mesuré est « {title} ».{detail}",
    findingDelay: "C’est ce délai que les gens ressentent avant de voir l’offre.",
    findingSocial: {
      profileLinks: "L’écart de partage le plus clair est le chemin vers vos profils sociaux. Les gens ne peuvent pas les atteindre facilement depuis cette page.",
      structuredProfiles: "L’écart de partage le plus clair est le lien entre ce site et vos profils sociaux.",
      openGraph: "L’écart de partage le plus clair est l’aperçu du lien. Un lien partagé peut arriver sans titre, description ou image clairs.",
      socialCards: "L’écart de partage le plus clair est la carte sociale. Un aperçu peut arriver sans image ni message clairs.",
      organizationSchema: "L’écart de partage le plus clair est l’identité de l’entreprise. Les moteurs de recherche peuvent ne pas reconnaître le nom et le logo.",
      pageIdentity: "L’écart de partage le plus clair est l’identité de la page. Sans titre, description ou adresse clairs, la page est plus difficile à choisir.",
    },
    lead: {
      seo: "La préparation à la recherche est de {score} en moyenne. Le point de départ utile est de rendre cette page plus facile à trouver pour les bons clients.",
      social: "Le partage social est à {score} sur 100. Un lien partagé ne porte pas encore un message clair.",
      performance: "La performance de laboratoire est de {score} en moyenne. Les visiteurs attendent avant de voir l’offre.",
      accessibility: "L’accessibilité est de {score} en moyenne. Les détails manqués sur cette page sont là où les demandes se perdent.",
      strong: "Les scores mesurés sont dans une bonne zone. La prochaine étape utile est de protéger cette base et d’améliorer le prochain détail qui peut encore faire croître les demandes.",
    },
    genericError: "L’aperçu n’a pas pu être produit. Veuillez réessayer.",
    note: "Aperçu de présence numérique",
  },
} as const;

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function scoreTone(score: number | null) {
  if (score == null) return "text-slate-500";
  if (score >= 90) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-rose-700";
}

export default function DigitalPresenceSnapshot({
  locale,
  initialUrl = "",
}: {
  locale: string;
  initialUrl?: string;
}) {
  const language = locale === "fr" ? "fr" : "en";
  const t = copy[language];
  const [url, setUrl] = useState(initialUrl);
  const [technical, setTechnical] = useState<TechnicalResponse | null>(null);
  const [social, setSocial] = useState<SocialPresenceSnapshot | null>(null);
  const [technicalError, setTechnicalError] = useState("");
  const [socialError, setSocialError] = useState("");
  const [technicalLoading, setTechnicalLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [previous, setPrevious] = useState<SnapshotHistory | null>(null);
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [competitor, setCompetitor] = useState<CompetitorResult | null>(null);
  const [competitorLoading, setCompetitorLoading] = useState(false);
  const [competitorError, setCompetitorError] = useState("");
  const resultsRef = useRef<HTMLElement>(null);

  const technicalSnapshots = useMemo(
    () => [technical?.mobile?.snapshot, technical?.desktop?.snapshot].filter(
      (snapshot): snapshot is WebsiteVisibilitySnapshot => Boolean(snapshot),
    ),
    [technical],
  );
  const actions = useMemo(
    () => buildDigitalPresenceActions(technicalSnapshots, social ?? undefined),
    [technicalSnapshots, social],
  );
  const narrative = useMemo(
    () => buildSnapshotNarrative(technicalSnapshots, social ?? undefined),
    [technicalSnapshots, social],
  );

  useEffect(() => {
    if (started && !technicalLoading && !socialLoading && (technical || social)) {
      resultsRef.current?.focus();
    }
  }, [started, technicalLoading, socialLoading, technical, social]);

  async function runSnapshot(forceFresh = false, honeypot: FormDataEntryValue | null = "") {
    const body = JSON.stringify({ url, website: honeypot, fresh: forceFresh });
    const previousResult = readHistory(url);
    setPrevious(previousResult);
    setStarted(true);
    setTechnical(null);
    setSocial(null);
    setTechnicalError("");
    setSocialError("");
    setTechnicalLoading(true);
    setSocialLoading(true);
    trackAnalyticsEvent(forceFresh ? "digital_snapshot_fresh" : "digital_snapshot_started");

    let completedTechnical: TechnicalResponse | null = null;
    let completedSocial: SocialPresenceSnapshot | null = null;

    const technicalRequest = fetch("/api/website-visibility-snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as TechnicalResponse;
        if (!payload.mobile?.snapshot && !payload.desktop?.snapshot) {
          throw new Error(payload.error || t.technicalError);
        }
        completedTechnical = payload;
        setTechnical(payload);
      })
      .catch((error) => setTechnicalError(error instanceof Error ? error.message : t.technicalError))
      .finally(() => setTechnicalLoading(false));

    const socialRequest = fetch("/api/social-presence-snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as {
          snapshot?: SocialPresenceSnapshot;
          error?: string;
        };
        if (!response.ok || !payload.snapshot) throw new Error(payload.error || t.socialError);
        completedSocial = payload.snapshot;
        setSocial(payload.snapshot);
      })
      .catch((error) => setSocialError(error instanceof Error ? error.message : t.socialError))
      .finally(() => setSocialLoading(false));

    await Promise.allSettled([technicalRequest, socialRequest]);
    if (completedTechnical || completedSocial) {
      saveHistory(url, completedTechnical, completedSocial);
    }
    trackAnalyticsEvent("digital_snapshot_completed");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await runSnapshot(false, form.get("website"));
  }

  async function compareWebsite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCompetitorLoading(true);
    setCompetitorError("");
    setCompetitor(null);
    try {
      const body = JSON.stringify({ url: competitorUrl });
      const [technicalResponse, socialResponse] = await Promise.all([
        fetch("/api/website-visibility-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }),
        fetch("/api/social-presence-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }),
      ]);
      const technicalPayload = (await technicalResponse.json().catch(() => ({}))) as TechnicalResponse;
      const socialPayload = (await socialResponse.json().catch(() => ({}))) as {
        snapshot?: SocialPresenceSnapshot;
      };
      if (!technicalPayload.mobile?.snapshot && !technicalPayload.desktop?.snapshot && !socialPayload.snapshot) {
        throw new Error(t.competitorError);
      }
      setCompetitor({
        url: competitorUrl,
        technical: technicalPayload,
        social: socialPayload.snapshot ?? null,
      });
      trackAnalyticsEvent("digital_snapshot_compared");
    } catch {
      setCompetitorError(t.competitorError);
    } finally {
      setCompetitorLoading(false);
    }
  }

  const loadingMessage = technicalLoading && socialLoading
    ? t.both
    : technicalLoading
      ? t.technicalOnly
      : socialLoading
        ? t.socialOnly
        : t.starting;
  const resultUrl = social?.finalUrl || technicalSnapshots[0]?.finalUrl || url;
  const detailQuery = { url: resultUrl };
  const note = `${t.note}: ${resultUrl}. ${technicalSnapshots
    .map((snapshot) => `${snapshot.strategy} ${scoreOrder.map((name) => `${name} ${snapshot.scores[name] ?? t.notScored}`).join(", ")}`)
    .join(". ")}${social ? `. social ${social.score}/100` : ""}`.slice(0, 420);
  const dateFormatter = new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const currentMobilePerformance = technical?.mobile?.snapshot?.scores.performance ?? null;
  const currentDesktopPerformance = technical?.desktop?.snapshot?.scores.performance ?? null;
  const lead = narrative.offer.kind === "strong"
    ? t.lead.strong
    : fill(t.lead[narrative.offer.kind], { score: String(narrative.offer.score) });
  const recommendation = narrative.offer.kind === "seo" || narrative.offer.kind === "social"
    ? { title: t.recommendationVisibility, body: t.recommendationVisibilityBody, intent: "visibility" }
    : narrative.offer.kind === "performance" || narrative.offer.kind === "accessibility"
      ? { title: t.recommendationConversion, body: t.recommendationConversionBody, intent: "website" }
      : { title: t.recommendationManaged, body: t.recommendationManagedBody, intent: "website" };
  const seoScores = technicalSnapshots.map((snapshot) => snapshot.scores.seo).filter((score): score is number => score != null);
  const averageSeo = seoScores.length ? Math.round(seoScores.reduce((sum, score) => sum + score, 0) / seoScores.length) : null;
  const agenticScore = social?.agentic?.score ?? null;
  const agenticGap = averageSeo != null && agenticScore != null && averageSeo - agenticScore >= 15
    ? fill(t.agenticGap, { seo: String(averageSeo), agentic: String(agenticScore) })
    : "";
  const reviewGoal = `${note} ${lead} ${recommendation.title}`.slice(0, 700);
  const finding = narrative.finding;
  const findingText = finding?.kind === "opportunity"
    ? `${fill(t.findingOpportunity, {
        strategy: t.findingDevice[finding.strategy],
        title: finding.title,
        detail: finding.detail ? ` ${finding.detail}${/[.!?]$/.test(finding.detail) ? "" : "."}` : "",
      })} ${t.findingDelay}`
    : finding?.kind === "social"
      ? t.findingSocial[finding.key]
      : "";
  const comparisonRows = [
    {
      label: t.mobilePerformance,
      primary: currentMobilePerformance,
      comparison: competitor?.technical?.mobile?.snapshot?.scores.performance ?? null,
    },
    {
      label: t.desktopPerformance,
      primary: currentDesktopPerformance,
      comparison: competitor?.technical?.desktop?.snapshot?.scores.performance ?? null,
    },
    {
      label: t.socialScore,
      primary: social?.score ?? null,
      comparison: competitor?.social?.score ?? null,
    },
  ];
  const historyRows = previous
    ? [
        { label: t.mobilePerformance, current: currentMobilePerformance, old: previous.mobilePerformance },
        { label: t.desktopPerformance, current: currentDesktopPerformance, old: previous.desktopPerformance },
        { label: t.socialScore, current: social?.score ?? null, old: previous.socialScore },
      ]
    : [];

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7 print:hidden">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">{t.urlLabel}</span>
            <input type="text" inputMode="url" autoComplete="url" required maxLength={2048} value={url} onChange={(event) => setUrl(event.target.value)} placeholder={t.placeholder} className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 px-4 text-slate-950 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <button type="submit" disabled={technicalLoading || socialLoading} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70">
            {technicalLoading || socialLoading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <SearchCheck className="h-5 w-5" aria-hidden />}
            {technicalLoading || socialLoading ? loadingMessage : t.submit}
          </button>
        </div>
        {technicalLoading || socialLoading ? <p className="mt-4 text-sm text-slate-600" role="status">{loadingMessage}</p> : null}
      </form>

      {started && (technical || social || technicalError || socialError) ? (
        <section ref={resultsRef} tabIndex={-1} className="space-y-7 outline-none" aria-live="polite">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="hidden border-b border-slate-200 pb-4 print:block">
              <p className="text-sm font-bold uppercase tracking-wide text-primary-dark">{t.reportLabel}</p>
              <p className="mt-1 break-all text-sm text-slate-600">{resultUrl}</p>
              <p className="mt-1 text-xs text-slate-500">{t.reportPrepared} {dateFormatter.format(new Date())}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-950">{t.resultsTitle}</h2>
                <p className="mt-2 max-w-3xl text-slate-700">{t.resultsIntro}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 print:hidden">
                <button type="button" disabled={technicalLoading || socialLoading} onClick={() => runSnapshot(true)} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary-dark hover:border-primary disabled:opacity-60">
                  <RefreshCw className={`h-4 w-4 ${technicalLoading || socialLoading ? "animate-spin" : ""}`} aria-hidden />{t.freshTest}
                </button>
                <button type="button" onClick={() => window.print()} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary-dark">
                  <Download className="h-4 w-4" aria-hidden />{t.print}
                </button>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500 print:hidden">{t.freshHelp}</p>
          </div>

          <article className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t.executiveTitle}</p>
            <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-950">{t.recommendedTitle}</h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-950">{lead}</p>
                <h3 className="mt-3 text-lg font-bold text-primary-dark">{recommendation.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{recommendation.body}</p>
              </div>
              <Link href={{ pathname: "/contact", query: { intent: recommendation.intent, website: resultUrl, from_page: "/tools/digital-presence-snapshot", goal: reviewGoal } }} className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark print:hidden">
                {t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-primary/15 pt-5 text-sm font-semibold print:hidden">
              <a href={`/${locale}/tools/digital-value-blueprint`} className="text-primary-dark underline underline-offset-4">{t.blueprintLink}</a>
              <a href={`/${locale}/tools/business-value-calculators`} className="text-primary-dark underline underline-offset-4">{t.calculatorsLink}</a>
              <a href={`/${locale}/tools/digital-monitoring-dashboard`} className="text-primary-dark underline underline-offset-4">{t.monitoringLink}</a>
            </div>
          </article>

          {(technicalError || socialError) ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">{t.partialTitle}</h2>
              {technicalError ? <p className="mt-2 text-sm text-amber-800">{technicalError}</p> : null}
              {socialError ? <p className="mt-2 text-sm text-amber-800">{socialError}</p> : null}
            </div>
          ) : null}

          <div className="space-y-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <Gauge className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
                <div><h2 className="text-2xl font-serif font-bold text-slate-950">{t.technicalTitle}</h2><p className="mt-1 text-sm text-slate-600">{t.technicalDescription}</p></div>
              </div>
              {technicalSnapshots.length ? (
                <div className="mt-6 space-y-5">
                  {technicalSnapshots.every((item) => item.finalUrl === technicalSnapshots[0].finalUrl) ? (
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{t.finalUrl}: </span>
                      <span className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-[13px] text-slate-800">{technicalSnapshots[0].finalUrl}</span>
                    </p>
                  ) : null}
                  <div className="space-y-1">
                  {technicalSnapshots.every((item) => item.analyzedAt === technicalSnapshots[0].analyzedAt) ? (
                    <p className="text-xs text-slate-600"><span className="font-semibold text-slate-700">{t.tested}: </span>{dateFormatter.format(new Date(technicalSnapshots[0].analyzedAt))}</p>
                  ) : null}
                  {technicalSnapshots[0].lighthouseVersion && technicalSnapshots.every((item) => item.lighthouseVersion === technicalSnapshots[0].lighthouseVersion) ? (
                    <p className="text-xs text-slate-600"><span className="font-semibold text-slate-700">{t.lighthouse}: </span>{technicalSnapshots[0].lighthouseVersion}</p>
                  ) : null}
                  </div>
                  {technicalSnapshots.some((item) => !isSamePublicPage(item.requestedUrl, item.finalUrl)) ? (
                    <p className="text-xs leading-5 text-slate-600">{fill(t.redirectNote, { requested: technicalSnapshots.find((item) => !isSamePublicPage(item.requestedUrl, item.finalUrl))?.requestedUrl ?? "" })}</p>
                  ) : null}
                  <div className="grid gap-4 lg:grid-cols-2">
                  {technicalSnapshots.map((snapshot) => {
                    const report = snapshot.strategy === "mobile" ? technical?.mobile : technical?.desktop;
                    const googleUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(snapshot.finalUrl)}&form_factor=${snapshot.strategy}`;
                    const urlShared = technicalSnapshots.every((item) => item.finalUrl === snapshot.finalUrl);
                    const testedShared = technicalSnapshots.every((item) => item.analyzedAt === snapshot.analyzedAt);
                    return (
                    <div key={snapshot.strategy} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-950">{snapshot.strategy === "mobile" ? t.mobile : t.desktop}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${report?.cached ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>
                          {report?.cached ? t.cached : t.fresh}
                        </span>
                      </div>
                      <PresenceScoreTiles scores={snapshot.scores} language={language} />
                      {!urlShared || !testedShared ? (
                        <dl className="mt-4 grid gap-2 text-xs text-slate-600">
                          {!testedShared ? <div><dt className="inline font-semibold text-slate-700">{t.tested}: </dt><dd className="inline">{dateFormatter.format(new Date(snapshot.analyzedAt))}</dd></div> : null}
                          {!urlShared ? <div><dt className="inline font-semibold text-slate-700">{t.finalUrl}: </dt><dd className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-[13px] text-slate-800">{snapshot.finalUrl}</dd></div> : null}
                        </dl>
                      ) : null}
                      <div className="mt-4 rounded-lg bg-slate-50 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">{t.fieldTitle}</h4>
                          {snapshot.fieldMetrics.length ? <span className="text-[11px] font-semibold text-slate-500">{snapshot.fieldScope === "page" ? t.fieldPage : t.fieldOrigin}</span> : null}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{t.fieldIntro}</p>
                        {snapshot.fieldMetrics.length ? (
                          <dl className="mt-3 grid gap-2 sm:grid-cols-3">
                            {snapshot.fieldMetrics.map((metric) => <div key={metric.key}><dt className="text-[11px] text-slate-500">{metric.label}</dt><dd className="font-semibold text-slate-900">{metric.displayValue}</dd></div>)}
                          </dl>
                        ) : <p className="mt-3 text-xs text-slate-600">{t.noFieldData}</p>}
                      </div>
                      {snapshot.labMetrics.length ? (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-slate-900">{t.labTitle}</h4>
                          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                            {snapshot.labMetrics.map((metric) => (
                              <div key={metric.key} className="rounded-lg bg-slate-50 p-3">
                                <dt className="text-[11px] text-slate-500">{metric.label}</dt>
                                <dd className="font-semibold text-slate-900">{metric.displayValue}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ) : null}
                      {snapshot.opportunities.length ? (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-slate-900">{t.opportunitiesTitle}</h4>
                          <ol className="mt-2 space-y-2">
                            {snapshot.opportunities.map((opportunity, index) => (
                              <li key={opportunity.id} className="flex gap-3 text-sm text-slate-700">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-dark">{index + 1}</span>
                                <span>
                                  <span className="block font-semibold text-slate-900">{opportunity.title}</span>
                                  {opportunity.displayValue ? <span className="mt-0.5 block text-slate-600">{opportunity.displayValue}</span> : null}
                                </span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      ) : null}
                      <a href={googleUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-primary-dark underline underline-offset-4 print:hidden">{t.compareGoogle}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></a>
                    </div>
                    );
                  })}
                  </div>
                  {narrative.phoneGap ? <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950">{fill(t.phoneGap, { mobile: String(narrative.phoneGap.mobile), desktop: String(narrative.phoneGap.desktop) })}</p> : null}
                </div>
              ) : technicalLoading ? <p className="mt-6 text-sm text-slate-600">{loadingMessage}</p> : <p className="mt-6 text-sm text-slate-600">{t.technicalError}</p>}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <Share2 className="mt-1 h-7 w-7 text-primary-dark" aria-hidden />
                <div><h2 className="text-2xl font-serif font-bold text-slate-950">{t.socialTitle}</h2><p className="mt-1 text-sm text-slate-600">{t.socialDescription}</p></div>
              </div>
              {social ? (
                <div className="mt-6">
                  <div className={`grid gap-3 ${agenticScore != null ? "sm:grid-cols-2" : ""} sm:max-w-xl`}>
                    <div className="flex h-full flex-col rounded-lg bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold leading-4 text-slate-500">{t.socialScore}</p>
                      <p className={`mt-auto pt-1 text-4xl font-bold ${scoreTone(social.score)}`}>{social.score}<span className="text-lg font-semibold text-slate-500">/100</span></p>
                    </div>
                    {agenticScore != null ? <AgenticScoreTile score={agenticScore} language={language} /> : null}
                  </div>
                  {agenticGap ? <p className="mt-4 max-w-3xl rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">{agenticGap}</p> : null}
                  <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {social.checks.map((check) => (
                      <div key={check.id} className="rounded-lg bg-slate-50 p-3">
                        <dt className="text-[11px] font-semibold text-slate-500">{t.actionSocial[check.id]}</dt>
                        <dd className="mt-1 font-bold text-slate-900">{check.points}/{check.maxPoints}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link href={{ pathname: "/tools/social-presence-snapshot", query: detailQuery }} className="mt-5 inline-flex font-semibold text-primary-dark underline underline-offset-4 print:hidden">{t.detailedSocial}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
                </div>
              ) : socialLoading ? <p className="mt-6 text-sm text-slate-600">{loadingMessage}</p> : <p className="mt-6 text-sm text-slate-600">{t.socialError}</p>}
            </article>
          </div>

          {historyRows.some((row) => row.current != null && row.old != null) ? (
            <article className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-950">{t.previousTitle}</h2>
              <p className="mt-2 text-sm text-slate-600">{t.previousIntro}</p>
              <p className="mt-1 text-xs text-slate-500">{t.previousChecked}: {dateFormatter.format(new Date(previous!.checkedAt))}</p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                {historyRows.map((row) => {
                  const delta = scoreDelta(row.current, row.old);
                  if (delta == null) return null;
                  const label = delta > 0 ? t.improved : delta < 0 ? t.declined : t.unchanged;
                  return <div key={row.label} className="rounded-xl bg-white p-4"><dt className="text-xs font-semibold text-slate-600">{row.label}</dt><dd className={`mt-1 text-xl font-bold ${delta > 0 ? "text-emerald-700" : delta < 0 ? "text-rose-700" : "text-slate-700"}`}>{delta > 0 ? "+" : ""}{delta} <span className="text-xs font-semibold">{label}</span></dd></div>;
                })}
              </dl>
            </article>
          ) : null}

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 print:hidden">
            <h2 className="text-2xl font-serif font-bold text-slate-950">{t.competitorTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t.competitorIntro}</p>
            <form onSubmit={compareWebsite} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1"><span className="text-sm font-semibold text-slate-900">{t.competitorLabel}</span><input type="text" inputMode="url" autoComplete="url" required maxLength={2048} value={competitorUrl} onChange={(event) => setCompetitorUrl(event.target.value)} placeholder={t.placeholder} className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
              <button type="submit" disabled={competitorLoading} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60">{competitorLoading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : null}{competitorLoading ? t.competitorLoading : t.competitorButton}</button>
            </form>
            {competitorError ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800" role="alert">{competitorError}</p> : null}
            {competitor ? (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead><tr className="border-b border-slate-200"><th className="px-3 py-3 text-slate-600"> </th><th className="px-3 py-3 text-slate-900">{t.yourWebsite}</th><th className="px-3 py-3 text-slate-900">{t.comparisonWebsite}</th></tr></thead>
                  <tbody>{comparisonRows.map((row) => <tr key={row.label} className="border-b border-slate-100"><th className="px-3 py-3 font-medium text-slate-700">{row.label}</th><td className="px-3 py-3 text-xl font-bold text-slate-950">{row.primary ?? t.notScored}</td><td className="px-3 py-3 text-xl font-bold text-slate-950">{row.comparison ?? t.notScored}</td></tr>)}</tbody>
                </table>
                <p className="mt-3 break-all text-xs text-slate-500">{competitor.url}</p>
              </div>
            ) : null}
          </article>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-950">{t.actionsTitle}</h2>
              <p className="mt-2 text-sm text-slate-600">{t.actionsIntro}</p>
              {findingText ? <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700"><span className="font-semibold text-slate-950">{t.findingTitle}. </span>{findingText}</p> : null}
              {actions.length ? (
                <ol className="mt-5 space-y-3">
                  {actions.map((action, index) => {
                    const title = action.source === "technical"
                      ? t.actionTechnical[action.key]
                      : action.source === "agentic"
                        ? t.actionAgentic
                        : t.actionSocial[action.key];
                    const strategies = action.source === "technical"
                      ? action.strategies.map((strategy) => strategy === "mobile" ? t.mobile : t.desktop).join(` ${language === "fr" ? "et" : "and"} `)
                      : "";
                    const why = action.source === "agentic"
                      ? fill(t.actionCost.agentic, { score: String(action.score) })
                      : fill(t.actionCost[action.key], { score: String(action.score), strategies });
                    return (
                      <li key={`${action.source}-${action.key}`} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary-dark">{index + 1}</span>
                        <div><span className={`text-xs font-bold uppercase tracking-wide ${action.priority === "fixNow" ? "text-rose-700" : "text-amber-700"}`}>{action.priority === "fixNow" ? t.fixNow : t.planNext}</span><h3 className="mt-1 font-semibold text-slate-950">{title}</h3><p className="mt-1 text-sm text-slate-600">{why}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-primary/[0.08] px-2.5 py-1 text-[11px] font-semibold text-primary-dark">{t.impact}: {t[action.impact]}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{t.effort}: {t[action.effort]}</span></div></div>
                      </li>
                    );
                  })}
                </ol>
              ) : <p className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{t.automatedStrong}</p>}
            </article>

            <article className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-950">{t.humanTitle}</h2>
              <ul className="mt-5 space-y-3">
                {t.human.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}
              </ul>
            </article>
          </div>

          <details className="rounded-xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer font-semibold text-slate-950">{t.methodology}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-700">{t.methodologyBody}</p>
          </details>

          <aside className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-7 sm:p-9 print:hidden">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700">{t.sprintEyebrow}</p>
            <h2 className="mt-3 text-2xl font-serif font-bold text-slate-950">{t.sprintTitle}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-700">{t.sprintTimeline}</p>
            <p className="mt-3 max-w-3xl text-slate-700">{t.sprintBody}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">{t.sprintItems.map((item) => <li key={item} className="flex gap-2 rounded-lg bg-white/70 p-3 text-sm text-slate-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{item}</li>)}</ul>
            <p className="mt-4 text-sm text-slate-600">{t.sprintPrice}</p>
            <Link href={{ pathname: "/contact", query: { intent: "visibility", review: "results", website: resultUrl, from_page: "/tools/digital-presence-snapshot", goal: `${note} ${t.sprintTitle}` } }} className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">{t.sprintCta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
          </aside>

          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9 print:hidden">
            <SearchCheck className="h-8 w-8 text-primary-light" aria-hidden />
            <h2 className="mt-4 text-2xl font-serif font-bold text-white">{t.ctaTitle}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{t.ctaBody}</p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              {t.ctaSteps.map((step, index) => <li key={step} className="rounded-lg border border-white/15 bg-white/[0.04] p-3 text-sm text-slate-200"><span className="mr-2 font-bold text-brand-gold">{index + 1}.</span>{step}</li>)}
            </ol>
            <p className="mt-5 text-sm font-semibold text-white">{t.ctaProof}</p>
            <Link href={{ pathname: "/contact", query: { intent: "visibility", review: "results", website: resultUrl, from_page: "/tools/digital-presence-snapshot", goal: reviewGoal } }} onClick={() => trackAnalyticsEvent("digital_snapshot_cta")} className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-gold px-6 py-3 font-semibold text-slate-950 hover:bg-brand-gold-light">{t.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
            <p className="mt-3 text-xs text-slate-400">{t.ctaReassurance}</p>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
