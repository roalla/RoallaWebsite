import {
  SOLUTION_PATH_IDS,
  type SolutionPathId,
} from "@/lib/solutions-by-need";

export type OutcomeGroupId =
  | "growth-visibility"
  | "experience-products"
  | "automation-ai"
  | "security-compliance"
  | "execution";

export type OutcomeVisual = {
  src: string;
  alt: Record<"en" | "fr", string>;
  focus: Record<"en" | "fr", string>;
};

export type OutcomeDeliveryModel = {
  title: string;
  description: string;
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

const advisoryDeliveryModel: Record<"en" | "fr", OutcomeDeliveryModel> = {
  en: {
    title: "Business advisory with implementation support",
    description: "ROALLA leads the advisory work directly and stays involved as priorities become owned actions, operating rhythms, and measurable follow-through.",
  },
  fr: {
    title: "Conseil d’affaires avec soutien à la mise en œuvre",
    description: "ROALLA dirige directement le travail de conseil et demeure impliquée pendant que les priorités deviennent des actions assumées, des rythmes opérationnels et un suivi mesurable.",
  },
};

const supplierSourcingDeliveryModel: Record<"en" | "fr", OutcomeDeliveryModel> = {
  en: {
    title: "Advisory and qualified supplier sourcing",
    description: "ROALLA defines requirements, compares viable options, and supports the decision and transition. Selected platforms or managed services may be licensed, delivered, and supported by third-party providers; material commercial relationships are disclosed before commitment.",
  },
  fr: {
    title: "Conseil et recherche de fournisseurs qualifiés",
    description: "ROALLA définit les exigences, compare les options viables et soutient la décision et la transition. Les plateformes ou services gérés retenus peuvent être fournis, exploités et soutenus par des tiers; toute relation commerciale importante est divulguée avant l’engagement.",
  },
};

export const outcomeDeliveryModels: Record<
  SolutionPathId,
  Record<"en" | "fr", OutcomeDeliveryModel>
> = {
  strategy: advisoryDeliveryModel,
  "cloud-infrastructure": supplierSourcingDeliveryModel,
  communications: supplierSourcingDeliveryModel,
  security: supplierSourcingDeliveryModel,
  iot: supplierSourcingDeliveryModel,
  network: supplierSourcingDeliveryModel,
  "digital-experience": {
    en: {
      title: "Custom design, build, and implementation",
      description: "ROALLA designs and builds the experience around the required journey and outcome. The implementation may integrate established third-party platforms, hosting, or services when they are the practical fit, with those dependencies made clear in scope.",
    },
    fr: {
      title: "Conception, réalisation et mise en œuvre sur mesure",
      description: "ROALLA conçoit et réalise l’expérience autour du parcours et du résultat recherchés. La mise en œuvre peut intégrer des plateformes, de l’hébergement ou des services tiers établis lorsqu’ils constituent le choix pratique; ces dépendances sont précisées dans la portée.",
    },
  },
  "automation-ai": {
    en: {
      title: "Custom integration and governed enablement",
      description: "ROALLA designs and implements the workflow, controls, and integrations. Approved third-party platforms, models, and APIs may provide underlying capabilities, while ownership, escalation, and operating responsibilities remain explicit.",
    },
    fr: {
      title: "Intégration sur mesure et mise en service gouvernée",
      description: "ROALLA conçoit et met en œuvre le flux, les contrôles et les intégrations. Des plateformes, modèles et API tiers approuvés peuvent fournir les capacités sous-jacentes, tandis que la responsabilité, l’escalade et l’exploitation demeurent explicites.",
    },
  },
  visibility: {
    en: {
      title: "Advisory and managed optimization",
      description: "ROALLA assesses the current experience, prioritizes the work, and can implement and manage improvements. Specialist or third-party services are introduced only when they fit the need and are identified in the recommended scope.",
    },
    fr: {
      title: "Conseil et optimisation gérée",
      description: "ROALLA évalue l’expérience actuelle, priorise le travail et peut mettre en œuvre et gérer les améliorations. Des spécialistes ou services tiers sont intégrés seulement lorsqu’ils répondent au besoin et sont identifiés dans la portée recommandée.",
    },
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
      id: "growth-visibility",
      title: "Be easier to find—and win more customers",
      description: "Strengthen visibility, trust, accessibility, and conversion across search, AI, and customer journeys.",
      pathwayIds: ["visibility"],
    },
    {
      id: "experience-products",
      title: "Improve an experience—or launch a new product or service",
      description: "Create clearer customer and team experiences through websites, applications, communications, and digital services.",
      pathwayIds: ["digital-experience", "communications"],
    },
    {
      id: "automation-ai",
      title: "Automate valuable work—and apply AI with human control",
      description: "Reduce repetitive work, connect approved systems, and use automation, IoT, or governed AI where the value is measurable.",
      pathwayIds: ["automation-ai", "iot"],
    },
    {
      id: "security-compliance",
      title: "Reduce risk, strengthen security, and support compliance",
      description: "Address security gaps, resilience, cloud and network foundations, continuity, and control ownership in the right sequence.",
      pathwayIds: ["security", "cloud-infrastructure", "network"],
    },
    {
      id: "execution",
      title: "Turn priorities into focused, measurable execution",
      description: "Clarify direction, sequence decisions, assign owners, and carry the practical plan through implementation.",
      pathwayIds: ["strategy"],
    },
  ],
  fr: [
    {
      id: "growth-visibility",
      title: "Être plus facile à trouver—et gagner plus de clients",
      description: "Renforcer la visibilité, la confiance, l’accessibilité et la conversion dans la recherche, l’IA et les parcours clients.",
      pathwayIds: ["visibility"],
    },
    {
      id: "experience-products",
      title: "Améliorer une expérience—ou lancer un nouveau produit ou service",
      description: "Créer de meilleurs parcours clients et employés grâce aux sites, applications, communications et services numériques.",
      pathwayIds: ["digital-experience", "communications"],
    },
    {
      id: "automation-ai",
      title: "Automatiser le travail utile—et appliquer l’IA avec contrôle humain",
      description: "Réduire le travail répétitif, connecter les systèmes approuvés et utiliser l’automatisation, l’IdO ou l’IA gouvernée lorsque la valeur est mesurable.",
      pathwayIds: ["automation-ai", "iot"],
    },
    {
      id: "security-compliance",
      title: "Réduire le risque, renforcer la sécurité et soutenir la conformité",
      description: "Traiter les écarts de sécurité, la résilience, les fondations infonuagiques et réseau, la continuité et la responsabilité des contrôles dans le bon ordre.",
      pathwayIds: ["security", "cloud-infrastructure", "network"],
    },
    {
      id: "execution",
      title: "Transformer les priorités en exécution ciblée et mesurable",
      description: "Clarifier la direction, séquencer les décisions, désigner les responsables et mener le plan pratique jusqu’à la mise en œuvre.",
      pathwayIds: ["strategy"],
    },
  ],
};

export const outcomePageCopy = {
  en: {
    breadcrumb: "Business outcomes",
    eyebrow: "Business outcome pathway",
    plainAnswer: "The short answer",
    credibilityLabel: "Why leaders can start here",
    credibilityPoints: [
      "30+ years of business and technology experience",
      "500+ engagements delivered",
      "Needs-led recommendations with accountable implementation",
    ],
    journeyEyebrow: "Problem → solution → benefit",
    journeyTitle: "A clear route from friction to progress",
    fitTitle: "What may be getting in the way",
    includesTitle: "What we can change together",
    resultTitle: "What better looks like",
    processEyebrow: "A practical path",
    processTitle: "Move from pressure to a decision your team can use",
    processDescription: "The exact scope changes with the situation. The sequence stays grounded in the outcome, the evidence, and the people responsible for implementation.",
    deliveryModelLabel: "How this work is delivered",
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
    visibilityToolEyebrow: "Start with evidence",
    visibilityToolTitle: "Check your website before the conversation.",
    visibilityToolBody: "Run a free Digital Presence Snapshot on your public landing page—performance, search readability, social setup, and priority actions. No email required.",
    visibilityToolCta: "Check my website",
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
    credibilityLabel: "Pourquoi les dirigeants peuvent commencer ici",
    credibilityPoints: [
      "Plus de 30 ans d’expérience en affaires et en technologie",
      "Plus de 500 mandats réalisés",
      "Recommandations axées sur les besoins et mise en œuvre responsable",
    ],
    journeyEyebrow: "Problème → solution → bénéfice",
    journeyTitle: "Un parcours clair de la friction au progrès",
    fitTitle: "Ce qui peut freiner le progrès",
    includesTitle: "Ce que nous pouvons changer ensemble",
    resultTitle: "À quoi ressemble une meilleure situation",
    processEyebrow: "Un parcours pratique",
    processTitle: "Passer de la pression à une décision que l’équipe peut appliquer",
    processDescription: "La portée exacte varie selon la situation. La séquence demeure ancrée dans le résultat, les faits et les personnes responsables de la mise en œuvre.",
    deliveryModelLabel: "Comment ce travail est réalisé",
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
    visibilityToolEyebrow: "Commencer par des preuves",
    visibilityToolTitle: "Vérifiez votre site avant la conversation.",
    visibilityToolBody: "Lancez un Aperçu gratuit de présence numérique sur votre page d’arrivée publique—performance, lisibilité pour la recherche, partage social et actions prioritaires. Aucun courriel requis.",
    visibilityToolCta: "Vérifier mon site",
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
