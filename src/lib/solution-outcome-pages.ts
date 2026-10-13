import {
  SOLUTION_PATH_IDS,
  type SolutionPathId,
} from "@/lib/solutions-by-need";

export type OutcomeGroupId = "decide" | "operate" | "build";

export type OutcomeVisual = {
  src: string;
  alt: Record<"en" | "fr", string>;
  focus: Record<"en" | "fr", string>;
};

export const outcomeVisuals: Record<SolutionPathId, OutcomeVisual> = {
  strategy: {
    src: "/images/insights/library/strategic-planning.webp",
    alt: {
      en: "Leadership team aligning business priorities on a shared strategic plan",
      fr: "Équipe de direction alignant les priorités d’affaires dans un plan stratégique commun",
    },
    focus: { en: "Direction and ownership", fr: "Orientation et responsabilités" },
  },
  "cloud-infrastructure": {
    src: "/images/insights/library/cloud-backup-sync-recovery-differences.webp",
    alt: {
      en: "Connected cloud infrastructure supporting secure business continuity",
      fr: "Infrastructure infonuagique connectée soutenant la continuité sécurisée des activités",
    },
    focus: { en: "Resilience and scale", fr: "Résilience et évolutivité" },
  },
  communications: {
    src: "/images/insights/library/analog-to-ip-business-telephony.webp",
    alt: {
      en: "Modern business calling and collaboration across a connected team",
      fr: "Téléphonie et collaboration d’affaires modernes pour une équipe connectée",
    },
    focus: { en: "Clearer conversations", fr: "Conversations plus claires" },
  },
  security: {
    src: "/images/insights/library/consolidate-systems-before-soc-2-readiness.webp",
    alt: {
      en: "Business systems organized for stronger security and compliance readiness",
      fr: "Systèmes d’affaires organisés pour renforcer la sécurité et la préparation à la conformité",
    },
    focus: { en: "Risk and readiness", fr: "Risque et préparation" },
  },
  iot: {
    src: "/images/insights/library/smb-digital-efficiency.webp",
    alt: {
      en: "Connected operational data helping a team monitor work in real time",
      fr: "Données opérationnelles connectées aidant une équipe à suivre le travail en temps réel",
    },
    focus: { en: "Connected operations", fr: "Opérations connectées" },
  },
  network: {
    src: "/images/insights/library/technology-renewal-checklist.webp",
    alt: {
      en: "Business leader reviewing network reliability and technology renewal priorities",
      fr: "Dirigeant examinant la fiabilité du réseau et les priorités de renouvellement technologique",
    },
    focus: { en: "Reliable connectivity", fr: "Connectivité fiable" },
  },
  "digital-experience": {
    src: "/images/insights/library/website-portal-or-custom-app.webp",
    alt: {
      en: "Customer using a clear digital portal designed around a practical task",
      fr: "Client utilisant un portail numérique clair conçu autour d’une tâche concrète",
    },
    focus: { en: "Useful digital journeys", fr: "Parcours numériques utiles" },
  },
  "automation-ai": {
    src: "/images/insights/library/what-to-automate-first.webp",
    alt: {
      en: "Team mapping a responsible automation workflow with human review points",
      fr: "Équipe cartographiant un flux d’automatisation responsable avec des points de révision humaine",
    },
    focus: { en: "Controlled automation", fr: "Automatisation contrôlée" },
  },
  visibility: {
    src: "/images/insights/library/search-and-ai-visibility.webp",
    alt: {
      en: "Business content becoming easier to find in search and AI-assisted discovery",
      fr: "Contenu d’affaires devenant plus facile à trouver dans la recherche et la découverte assistée par l’IA",
    },
    focus: { en: "Findability and trust", fr: "Visibilité et confiance" },
  },
};

export const outcomeGroups: Record<
  "en" | "fr",
  readonly {
    id: OutcomeGroupId;
    title: string;
    description: string;
    pathwayIds: readonly SolutionPathId[];
  }[]
> = {
  en: [
    {
      id: "decide",
      title: "I need to make a confident decision",
      description: "Set direction, modernize infrastructure, or reduce security risk before committing budget.",
      pathwayIds: ["strategy", "cloud-infrastructure", "security"],
    },
    {
      id: "operate",
      title: "I need operations to work more reliably",
      description: "Improve communications, connectivity, or connected operations across people and locations.",
      pathwayIds: ["communications", "network", "iot"],
    },
    {
      id: "build",
      title: "I need to build, automate, or grow",
      description: "Create a digital experience, automate work with control, or improve visibility and conversion.",
      pathwayIds: ["digital-experience", "automation-ai", "visibility"],
    },
  ],
  fr: [
    {
      id: "decide",
      title: "Je dois prendre une décision avec confiance",
      description: "Fixer la direction, moderniser l’infrastructure ou réduire le risque de sécurité avant d’engager le budget.",
      pathwayIds: ["strategy", "cloud-infrastructure", "security"],
    },
    {
      id: "operate",
      title: "Je dois rendre les opérations plus fiables",
      description: "Améliorer les communications, la connectivité ou les opérations connectées entre les équipes et les sites.",
      pathwayIds: ["communications", "network", "iot"],
    },
    {
      id: "build",
      title: "Je dois créer, automatiser ou croître",
      description: "Créer une expérience numérique, automatiser avec contrôle ou améliorer la visibilité et la conversion.",
      pathwayIds: ["digital-experience", "automation-ai", "visibility"],
    },
  ],
};

export const outcomePageCopy = {
  en: {
    breadcrumb: "Business outcomes",
    eyebrow: "Business outcome pathway",
    plainAnswer: "The short answer",
    journeyEyebrow: "Problem → solution → benefit",
    journeyTitle: "A clear route from friction to progress",
    fitTitle: "What may be getting in the way",
    includesTitle: "What we can change together",
    resultTitle: "What better looks like",
    processEyebrow: "A practical path",
    processTitle: "Move from pressure to a decision your team can use",
    processDescription: "The exact scope changes with the situation. The sequence stays grounded in the outcome, the evidence, and the people responsible for implementation.",
    steps: [
      { title: "Clarify", description: "Confirm the current state, the result that matters, the constraints, and how success will be measured." },
      { title: "Evaluate", description: "Compare the viable approaches against the same business, technical, risk, cost, and adoption criteria." },
      { title: "Activate", description: "Turn the decision into owned next steps, implementation milestones, and a useful review rhythm." },
    ],
    proofEyebrow: "Published delivery evidence",
    proofTitle: "Relevant examples you can inspect",
    proofDescription: "These are published ROALLA product examples. They demonstrate delivery capability and are not presented as client performance claims.",
    proofCta: "Read the case study",
    supplierEyebrow: "Supplier context",
    supplierTitle: "Recommendations begin with requirements—not a preferred product",
    supplierDescription: "ROALLA may use disclosed partner and supplier relationships to expand the qualified option set. A relationship does not mean every supplier is recommended, and material commercial relationships are disclosed before a commitment.",
    supplierCta: "Review supplier access and disclosures",
    faqEyebrow: "Quick answers",
    faqTitle: "What leaders usually want to know first",
    faqOutcomeQuestion: "What result should this pathway produce?",
    faqFitQuestion: "When is this pathway a useful starting point?",
    faqScopeQuestion: "What might the work include?",
    relatedEyebrow: "Related outcomes",
    relatedTitle: "The next closest paths",
    relatedCta: "Explore this outcome",
    serviceCta: "See the supporting service",
    ctaEyebrow: "Discuss this outcome",
    ctaTitle: "Bring the situation—not a finished solution brief",
    ctaDescription: "ROALLA will confirm the desired outcome, the facts that matter, and the smallest practical next step before recommending a scope.",
    ctaPrimary: "Talk through this outcome",
    ctaSecondary: "Compare all outcome paths",
    formTitle: "Tell us what is getting in the way",
    formDescription: "Three fields. No finished brief required. We’ll reply with a practical next step.",
    formPrefill: "I would like help with this outcome:",
    formAlternative: "Prefer the full consultation form?",
    formAlternativeCta: "Add more project detail",
  },
  fr: {
    breadcrumb: "Résultats d’affaires",
    eyebrow: "Parcours par résultat d’affaires",
    plainAnswer: "La réponse courte",
    journeyEyebrow: "Problème → solution → bénéfice",
    journeyTitle: "Un parcours clair de la friction au progrès",
    fitTitle: "Ce qui peut freiner le progrès",
    includesTitle: "Ce que nous pouvons changer ensemble",
    resultTitle: "À quoi ressemble une meilleure situation",
    processEyebrow: "Un parcours pratique",
    processTitle: "Passer de la pression à une décision que l’équipe peut appliquer",
    processDescription: "La portée exacte varie selon la situation. La séquence demeure ancrée dans le résultat, les faits et les personnes responsables de la mise en œuvre.",
    steps: [
      { title: "Clarifier", description: "Confirmer l’état actuel, le résultat important, les contraintes et la façon de mesurer le succès." },
      { title: "Évaluer", description: "Comparer les approches viables selon les mêmes critères d’affaires, techniques, de risque, de coût et d’adoption." },
      { title: "Activer", description: "Transformer la décision en prochaines étapes assumées, jalons de mise en œuvre et rythme de revue utile." },
    ],
    proofEyebrow: "Preuves de réalisation publiées",
    proofTitle: "Des exemples pertinents à examiner",
    proofDescription: "Il s’agit d’exemples de produits ROALLA publiés. Ils démontrent une capacité de réalisation et ne sont pas présentés comme des résultats de clients.",
    proofCta: "Lire l’étude de cas",
    supplierEyebrow: "Contexte fournisseurs",
    supplierTitle: "Les recommandations partent des exigences, pas d’un produit préféré",
    supplierDescription: "ROALLA peut utiliser des relations partenaires et fournisseurs divulguées pour élargir l’ensemble d’options qualifiées. Une relation ne signifie pas que chaque fournisseur est recommandé, et toute relation commerciale importante est divulguée avant un engagement.",
    supplierCta: "Voir l’accès aux fournisseurs et les divulgations",
    faqEyebrow: "Réponses rapides",
    faqTitle: "Ce que les dirigeants veulent généralement savoir d’abord",
    faqOutcomeQuestion: "Quel résultat ce parcours devrait-il produire?",
    faqFitQuestion: "Quand ce parcours constitue-t-il un bon point de départ?",
    faqScopeQuestion: "Que peut comprendre le travail?",
    relatedEyebrow: "Résultats connexes",
    relatedTitle: "Les parcours les plus proches",
    relatedCta: "Explorer ce résultat",
    serviceCta: "Voir le service associé",
    ctaEyebrow: "Discuter de ce résultat",
    ctaTitle: "Apportez la situation, pas un cahier des charges finalisé",
    ctaDescription: "ROALLA confirmera le résultat visé, les faits importants et la plus petite prochaine étape pratique avant de recommander une portée.",
    ctaPrimary: "Discuter de ce résultat",
    ctaSecondary: "Comparer tous les parcours",
    formTitle: "Dites-nous ce qui freine le progrès",
    formDescription: "Trois champs. Aucun cahier des charges finalisé requis. Nous répondrons avec une prochaine étape pratique.",
    formPrefill: "J’aimerais obtenir de l’aide pour ce résultat :",
    formAlternative: "Vous préférez le formulaire de consultation complet?",
    formAlternativeCta: "Ajouter plus de détails au projet",
  },
} as const;

export type OutcomePageCopy =
  | (typeof outcomePageCopy)["en"]
  | (typeof outcomePageCopy)["fr"];

export const relatedOutcomeIds: Record<SolutionPathId, readonly SolutionPathId[]> = {
  strategy: ["automation-ai", "cloud-infrastructure"],
  "cloud-infrastructure": ["network", "security"],
  communications: ["network", "automation-ai"],
  security: ["cloud-infrastructure", "network"],
  iot: ["network", "automation-ai"],
  network: ["cloud-infrastructure", "communications"],
  "digital-experience": ["visibility", "automation-ai"],
  "automation-ai": ["digital-experience", "strategy"],
  visibility: ["digital-experience", "strategy"],
};

export type OutcomeEvidence = {
  slug: "grcstatus" | "pitch-hotshots" | "boothlio" | "unjargonit";
  title: Record<"en" | "fr", string>;
  description: Record<"en" | "fr", string>;
};

export const outcomeEvidence: Partial<Record<SolutionPathId, readonly OutcomeEvidence[]>> = {
  security: [
    {
      slug: "grcstatus",
      title: { en: "GRC Status", fr: "GRC Status" },
      description: {
        en: "A published compliance-readiness product for turning control questions into a structured starting point.",
        fr: "Un produit publié de préparation à la conformité qui transforme les questions de contrôle en point de départ structuré.",
      },
    },
  ],
  "digital-experience": [
    {
      slug: "boothlio",
      title: { en: "Boothlio", fr: "Boothlio" },
      description: {
        en: "A published event experience platform connecting on-site engagement, capture, and follow-up.",
        fr: "Une plateforme publiée d’expérience événementielle qui relie l’engagement sur place, la collecte et le suivi.",
      },
    },
    {
      slug: "unjargonit",
      title: { en: "UnJargon It", fr: "UnJargon It" },
      description: {
        en: "A published learning platform with guided tracks, progress views, and hands-on experiences.",
        fr: "Une plateforme d’apprentissage publiée avec parcours guidés, vues de progression et expériences pratiques.",
      },
    },
  ],
  "automation-ai": [
    {
      slug: "pitch-hotshots",
      title: { en: "Pitch Hotshots", fr: "Pitch Hotshots" },
      description: {
        en: "A published AI-assisted practice product with scoring, delivery metrics, and structured feedback.",
        fr: "Un produit publié de pratique assistée par l’IA avec notation, mesures de prestation et rétroaction structurée.",
      },
    },
  ],
};

export const supplierContextOutcomeIds = new Set<SolutionPathId>([
  "cloud-infrastructure",
  "communications",
  "security",
  "iot",
  "network",
]);

export function isSolutionPathId(value: string): value is SolutionPathId {
  return (SOLUTION_PATH_IDS as readonly string[]).includes(value);
}
