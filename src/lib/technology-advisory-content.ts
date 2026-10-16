export type AdvisorNeedId = "replace" | "compare" | "risk" | "unsure";
export type AdvisorPriorityId = "requirements" | "options" | "delivery";

type AdvisorNeed = {
  id: AdvisorNeedId;
  label: string;
  priorities: Array<{ id: AdvisorPriorityId; label: string }>;
  recommendation: Record<AdvisorPriorityId, { title: string; body: string }>;
};

type TechnologyCategory = {
  id: string;
  label: string;
  description: string;
  compare: string[];
};

export type TechnologyAdvisoryCopy = {
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    proof: string;
  };
  journeys: {
    eyebrow: string;
    title: string;
    body: string;
    advisorTitle: string;
    advisorBody: string;
    advisorPrompt: string;
    priorityPrompt: string;
    back: string;
    restart: string;
    reviewCta: string;
    briefCta: string;
    readyTitle: string;
    readyBody: string;
    categoryPrompt: string;
    compareLabel: string;
    compareCta: string;
    inquiryCta: string;
    advisorNeeds: AdvisorNeed[];
    categories: TechnologyCategory[];
  };
  credibility: {
    eyebrow: string;
    title: string;
    body: string;
    principles: Array<{ title: string; body: string }>;
  };
  process: {
    eyebrow: string;
    title: string;
    body: string;
    steps: Array<{ title: string; body: string }>;
  };
  details: {
    eyebrow: string;
    title: string;
    body: string;
    deliverables: string;
    capabilities: string;
    evaluation: string;
    implementation: string;
    disclosure: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
  };
};

const en: TechnologyAdvisoryCopy = {
  hero: {
    eyebrow: "Technology advisory & solution sourcing",
    title: "Choose or replace technology with a clear path forward.",
    body: "Start with the help you need: clarify the decision with an independent advisor, or go directly to the technology category you already have in mind.",
    proof: "Requirements first · Non-exclusive sourcing · Support through implementation",
  },
  journeys: {
    eyebrow: "Choose your starting point",
    title: "Two ways to move forward",
    body: "You do not need a product shortlist before you begin.",
    advisorTitle: "Help me decide",
    advisorBody: "Answer two quick questions. We will point you to the smallest useful next step.",
    advisorPrompt: "What best describes the decision?",
    priorityPrompt: "Where would an advisor add the most value?",
    back: "Back",
    restart: "Start again",
    reviewCta: "Request this review",
    briefCta: "Build a free decision brief",
    readyTitle: "I know what I need",
    readyBody: "Choose a category to see what ROALLA can help you compare before you commit.",
    categoryPrompt: "Select a technology category",
    compareLabel: "Compare on",
    compareCta: "Build a comparison brief",
    inquiryCta: "Ask about",
    advisorNeeds: [
      {
        id: "replace",
        label: "Replace, renew, or consolidate",
        priorities: [
          { id: "requirements", label: "Clarify what the replacement must do" },
          { id: "options", label: "Compare providers and commercial terms" },
          { id: "delivery", label: "Plan a safe migration and adoption" },
        ],
        recommendation: {
          requirements: { title: "Start with a requirements review", body: "Document the work, constraints, dependencies, and decision criteria before providers shape the shortlist." },
          options: { title: "Start with a provider comparison", body: "Normalize scope, total cost, terms, support, risk, and exit considerations across qualified options." },
          delivery: { title: "Start with a transition review", body: "Map migration, integrations, ownership, training, continuity, and adoption before selecting the path." },
        },
      },
      {
        id: "compare",
        label: "Add a new capability",
        priorities: [
          { id: "requirements", label: "Turn the business need into requirements" },
          { id: "options", label: "Find and compare suitable solutions" },
          { id: "delivery", label: "Understand implementation effort" },
        ],
        recommendation: {
          requirements: { title: "Start with a decision brief", body: "Translate the outcome you need into practical business, technical, security, and operating requirements." },
          options: { title: "Start with a solution sourcing review", body: "Create a qualified shortlist and compare fit, cost, terms, support, implementation, and risk on the same facts." },
          delivery: { title: "Start with an implementation-readiness review", body: "Confirm integrations, migration, internal ownership, user change, and supplier responsibilities before you commit." },
        },
      },
      {
        id: "risk",
        label: "Reduce risk or improve resilience",
        priorities: [
          { id: "requirements", label: "Identify the gaps that matter most" },
          { id: "options", label: "Compare security or continuity options" },
          { id: "delivery", label: "Prioritize a practical roadmap" },
        ],
        recommendation: {
          requirements: { title: "Start with a risk-focused requirements review", body: "Identify critical systems, information, access, recovery needs, and the controls your team can realistically operate." },
          options: { title: "Start with a security and continuity comparison", body: "Compare qualified options on coverage, operations, response, recovery, support, cost, and implementation fit." },
          delivery: { title: "Start with a prioritized resilience roadmap", body: "Sequence the highest-consequence gaps first, with clear ownership, dependencies, and measures of readiness." },
        },
      },
      {
        id: "unsure",
        label: "I am not sure where to start",
        priorities: [
          { id: "requirements", label: "Make the problem and priorities clear" },
          { id: "options", label: "Understand the available paths" },
          { id: "delivery", label: "Choose a realistic first move" },
        ],
        recommendation: {
          requirements: { title: "Start with a technology decision review", body: "Clarify the current situation, desired outcome, constraints, stakeholders, and evidence needed for a sound decision." },
          options: { title: "Start with a path comparison", body: "Compare whether to buy, build, connect, improve, or defer before investing time in specific products." },
          delivery: { title: "Start with the smallest practical next step", body: "Turn uncertainty into a bounded action that reduces risk and creates useful evidence for the larger decision." },
        },
      },
    ],
    categories: [
      { id: "cloud-infrastructure", label: "Cloud & infrastructure", description: "Hosting, compute, storage, backup, identity, and the operating foundation behind your systems.", compare: ["workload fit", "resilience", "security", "support", "total cost", "exit options"] },
      { id: "cybersecurity-continuity", label: "Cybersecurity & continuity", description: "Protection, monitoring, response, backup, recovery, and practical readiness for disruption.", compare: ["risk coverage", "operating ownership", "response", "recovery", "compliance fit", "cost"] },
      { id: "communications-contact-centre", label: "Communications & contact centre", description: "Business calling, unified communications, customer routing, contact centre, and conversation workflows.", compare: ["call flows", "user experience", "integrations", "analytics", "reliability", "commercial terms"] },
      { id: "workplace-collaboration", label: "Workplace & collaboration", description: "Email, productivity, file sharing, meetings, collaboration, and the systems people use every day.", compare: ["user needs", "administration", "security", "interoperability", "adoption", "licensing"] },
      { id: "network-connectivity", label: "Networking & connectivity", description: "Internet, SD-WAN, Wi-Fi, branch connectivity, performance, failover, and supplier support.", compare: ["coverage", "performance", "resilience", "service levels", "support", "total cost"] },
      { id: "mobility-iot", label: "Mobility & IoT", description: "Mobile services, connected devices, field operations, fleet visibility, and managed connectivity.", compare: ["coverage", "device fit", "management", "security", "data use", "scalability"] },
    ],
  },
  credibility: {
    eyebrow: "Independent advice · Broader supplier access",
    title: "Your requirements lead. Supplier relationships stay visible.",
    body: "ROALLA is a Telarus Technology Advisor through a non-exclusive relationship, expanding access to a network of more than 400 suppliers, sales engineers, and domain specialists. That access supports the search; it does not replace a needs-led evaluation.",
    principles: [
      { title: "Needs-led", body: "The work, constraints, risks, and desired outcome define the shortlist." },
      { title: "Comparable", body: "Qualified options are assessed on the same fit, cost, terms, support, and implementation criteria." },
      { title: "Disclosed", body: "Any material commercial relationship affecting a recommendation is disclosed before you commit." },
    ],
  },
  process: {
    eyebrow: "A simple, accountable process",
    title: "From decision to everyday use in three steps",
    body: "The depth changes with the decision. The structure stays clear.",
    steps: [
      { title: "Clarify", body: "Define the outcome, requirements, constraints, risks, stakeholders, and decision criteria." },
      { title: "Compare", body: "Qualify options and make tradeoffs visible across fit, cost, terms, support, and implementation." },
      { title: "Carry through", body: "Support selection, migration, integration, adoption, measurement, and ongoing improvement." },
    ],
  },
  details: {
    eyebrow: "Explore the detail when you need it",
    title: "The evidence behind the recommendation",
    body: "These sections keep the practical detail available without making it your starting point.",
    deliverables: "What you leave with",
    capabilities: "Technology we can source and support",
    evaluation: "How solutions are evaluated",
    implementation: "What happens after selection",
    disclosure: "Supplier access and compensation disclosure",
  },
  finalCta: {
    eyebrow: "Technology advisory",
    title: "Bring us the decision—not a product shortlist.",
    body: "Tell us what you need to replace, add, compare, connect, or improve. We will recommend the smallest practical next step.",
    primary: "Request a Technology Review",
    secondary: "Build a free decision brief",
  },
};

const fr: TechnologyAdvisoryCopy = {
  ...en,
  hero: {
    eyebrow: "Conseil technologique et recherche de solutions",
    title: "Choisissez ou remplacez une technologie avec un chemin clair.",
    body: "Commencez par l’aide qu’il vous faut : clarifiez la décision avec un conseiller indépendant ou allez directement à la catégorie technologique que vous avez déjà en tête.",
    proof: "Exigences d’abord · Recherche non exclusive · Soutien jusqu’à la mise en œuvre",
  },
  journeys: {
    ...en.journeys,
    eyebrow: "Choisissez votre point de départ",
    title: "Deux façons d’avancer",
    body: "Vous n’avez pas besoin d’une liste de produits avant de commencer.",
    advisorTitle: "Aidez-moi à décider",
    advisorBody: "Répondez à deux questions rapides. Nous vous orienterons vers la plus petite prochaine étape utile.",
    advisorPrompt: "Qu’est-ce qui décrit le mieux la décision?",
    priorityPrompt: "Où un conseiller ajouterait-il le plus de valeur?",
    back: "Retour",
    restart: "Recommencer",
    reviewCta: "Demander cette revue",
    briefCta: "Créer une fiche de décision gratuite",
    readyTitle: "Je sais ce qu’il me faut",
    readyBody: "Choisissez une catégorie pour voir ce que ROALLA peut vous aider à comparer avant de vous engager.",
    categoryPrompt: "Sélectionnez une catégorie technologique",
    compareLabel: "Comparer selon",
    compareCta: "Créer une fiche de comparaison",
    inquiryCta: "Poser une question sur",
    advisorNeeds: [
      {
        id: "replace",
        label: "Remplacer, renouveler ou regrouper",
        priorities: [
          { id: "requirements", label: "Clarifier ce que la solution doit accomplir" },
          { id: "options", label: "Comparer les fournisseurs et les conditions" },
          { id: "delivery", label: "Planifier une migration et une adoption sûres" },
        ],
        recommendation: {
          requirements: { title: "Commencez par une revue des exigences", body: "Documentez le travail, les contraintes, les dépendances et les critères avant que les fournisseurs orientent la liste." },
          options: { title: "Commencez par une comparaison de fournisseurs", body: "Normalisez la portée, le coût total, les conditions, le soutien, les risques et les options de sortie." },
          delivery: { title: "Commencez par une revue de transition", body: "Cartographiez la migration, les intégrations, la responsabilité, la formation, la continuité et l’adoption." },
        },
      },
      {
        id: "compare",
        label: "Ajouter une nouvelle capacité",
        priorities: [
          { id: "requirements", label: "Transformer le besoin d’affaires en exigences" },
          { id: "options", label: "Trouver et comparer les solutions appropriées" },
          { id: "delivery", label: "Comprendre l’effort de mise en œuvre" },
        ],
        recommendation: {
          requirements: { title: "Commencez par une fiche de décision", body: "Traduisez le résultat recherché en exigences d’affaires, techniques, de sécurité et d’exploitation." },
          options: { title: "Commencez par une revue de recherche de solutions", body: "Créez une liste qualifiée et comparez l’adéquation, le coût, les conditions, le soutien, la mise en œuvre et le risque." },
          delivery: { title: "Commencez par une revue de préparation", body: "Confirmez les intégrations, la migration, la responsabilité interne, le changement utilisateur et les rôles des fournisseurs." },
        },
      },
      {
        id: "risk",
        label: "Réduire le risque ou améliorer la résilience",
        priorities: [
          { id: "requirements", label: "Repérer les écarts les plus importants" },
          { id: "options", label: "Comparer les options de sécurité ou de continuité" },
          { id: "delivery", label: "Prioriser une feuille de route pratique" },
        ],
        recommendation: {
          requirements: { title: "Commencez par une revue des exigences axée sur le risque", body: "Repérez les systèmes, l’information, les accès, la reprise et les contrôles que votre équipe peut réellement exploiter." },
          options: { title: "Commencez par une comparaison sécurité et continuité", body: "Comparez la couverture, l’exploitation, l’intervention, la reprise, le soutien, le coût et l’adéquation." },
          delivery: { title: "Commencez par une feuille de route de résilience", body: "Traitez d’abord les écarts aux conséquences les plus fortes, avec responsabilités, dépendances et mesures claires." },
        },
      },
      {
        id: "unsure",
        label: "Je ne sais pas par où commencer",
        priorities: [
          { id: "requirements", label: "Clarifier le problème et les priorités" },
          { id: "options", label: "Comprendre les chemins possibles" },
          { id: "delivery", label: "Choisir un premier geste réaliste" },
        ],
        recommendation: {
          requirements: { title: "Commencez par une revue de décision technologique", body: "Clarifiez la situation actuelle, le résultat, les contraintes, les parties prenantes et les preuves nécessaires." },
          options: { title: "Commencez par une comparaison des chemins", body: "Comparez acheter, bâtir, connecter, améliorer ou reporter avant d’investir dans des produits précis." },
          delivery: { title: "Commencez par la plus petite prochaine étape pratique", body: "Transformez l’incertitude en une action limitée qui réduit le risque et crée des preuves utiles." },
        },
      },
    ],
    categories: [
      { id: "cloud-infrastructure", label: "Infonuagique et infrastructure", description: "Hébergement, calcul, stockage, sauvegarde, identité et fondation d’exploitation de vos systèmes.", compare: ["adéquation des charges", "résilience", "sécurité", "soutien", "coût total", "options de sortie"] },
      { id: "cybersecurity-continuity", label: "Cybersécurité et continuité", description: "Protection, surveillance, intervention, sauvegarde, reprise et préparation pratique aux perturbations.", compare: ["couverture du risque", "responsabilité", "intervention", "reprise", "conformité", "coût"] },
      { id: "communications-contact-centre", label: "Communications et centre de contact", description: "Téléphonie, communications unifiées, routage client, centre de contact et flux de conversations.", compare: ["flux d’appels", "expérience utilisateur", "intégrations", "analytique", "fiabilité", "conditions"] },
      { id: "workplace-collaboration", label: "Milieu de travail et collaboration", description: "Courriel, productivité, partage de fichiers, réunions, collaboration et outils du quotidien.", compare: ["besoins utilisateurs", "administration", "sécurité", "interopérabilité", "adoption", "licences"] },
      { id: "network-connectivity", label: "Réseau et connectivité", description: "Internet, SD-WAN, Wi-Fi, succursales, performance, relève et soutien fournisseur.", compare: ["couverture", "performance", "résilience", "niveaux de service", "soutien", "coût total"] },
      { id: "mobility-iot", label: "Mobilité et IdO", description: "Services mobiles, appareils connectés, opérations terrain, visibilité de flotte et connectivité gérée.", compare: ["couverture", "adéquation des appareils", "gestion", "sécurité", "données", "évolutivité"] },
    ],
  },
  credibility: {
    eyebrow: "Conseil indépendant · Accès élargi aux fournisseurs",
    title: "Vos exigences guident le choix. Les relations fournisseurs restent visibles.",
    body: "ROALLA est conseiller technologique Telarus dans le cadre d’une relation non exclusive, donnant accès à un réseau de plus de 400 fournisseurs, ingénieurs des ventes et spécialistes. Cet accès soutient la recherche; il ne remplace pas une évaluation fondée sur les besoins.",
    principles: [
      { title: "Besoins d’abord", body: "Le travail, les contraintes, les risques et le résultat recherché définissent la liste." },
      { title: "Comparable", body: "Les options qualifiées sont évaluées selon les mêmes critères d’adéquation, de coût, de conditions, de soutien et de mise en œuvre." },
      { title: "Divulgué", body: "Toute relation commerciale importante influant sur une recommandation est divulguée avant votre engagement." },
    ],
  },
  process: {
    eyebrow: "Un processus simple et responsable",
    title: "De la décision à l’usage quotidien en trois étapes",
    body: "La profondeur change selon la décision. La structure reste claire.",
    steps: [
      { title: "Clarifier", body: "Définir le résultat, les exigences, les contraintes, les risques, les parties prenantes et les critères." },
      { title: "Comparer", body: "Qualifier les options et rendre visibles les compromis d’adéquation, de coût, de conditions, de soutien et de mise en œuvre." },
      { title: "Mener à terme", body: "Soutenir la sélection, la migration, l’intégration, l’adoption, la mesure et l’amélioration continue." },
    ],
  },
  details: {
    eyebrow: "Explorez les détails au besoin",
    title: "Les preuves derrière la recommandation",
    body: "Ces sections gardent les détails pratiques accessibles sans en faire votre point de départ.",
    deliverables: "Ce avec quoi vous repartez",
    capabilities: "Technologies que nous pouvons rechercher et soutenir",
    evaluation: "Comment les solutions sont évaluées",
    implementation: "Ce qui se passe après la sélection",
    disclosure: "Accès aux fournisseurs et divulgation de la rémunération",
  },
  finalCta: {
    eyebrow: "Conseil technologique",
    title: "Apportez-nous la décision—pas une liste de produits.",
    body: "Dites-nous ce que vous devez remplacer, ajouter, comparer, connecter ou améliorer. Nous recommanderons la plus petite prochaine étape pratique.",
    primary: "Demander une revue technologique",
    secondary: "Créer une fiche de décision gratuite",
  },
};

export function getTechnologyAdvisoryCopy(locale: string): TechnologyAdvisoryCopy {
  return locale === "fr" ? fr : en;
}
