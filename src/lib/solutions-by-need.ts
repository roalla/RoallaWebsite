export const SOLUTION_PATH_IDS = [
  "strategy",
  "technology",
  "digital-experience",
  "automation-ai",
  "visibility",
  "team-execution",
  "events",
  "optimization",
] as const;

export type SolutionPathId = (typeof SOLUTION_PATH_IDS)[number];

export type SolutionPathHref =
  | "/programs/business-enablement"
  | "/programs/technology-advisory"
  | "/services/digital"
  | "/services/agentic"
  | "/services/digital-visibility-optimization"
  | "/programs/workshops"
  | "/services/digital-events"
  | "/services/managed-optimization";

export type SolutionPathway = {
  id: SolutionPathId;
  shortTitle: string;
  title: string;
  description: string;
  signals: readonly string[];
  href: SolutionPathHref;
  serviceLabel: string;
};

export type SolutionsByNeedContent = {
  navLabel: string;
  menuEyebrow: string;
  menuDescription: string;
  viewAll: string;
  assessmentLabel: string;
  assessmentDescription: string;
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  heroPrimary: string;
  heroSecondary: string;
  pathwaysEyebrow: string;
  pathwaysTitle: string;
  pathwaysDescription: string;
  signsLabel: string;
  serviceCta: string;
  assessmentPrompt: string;
  closingEyebrow: string;
  closingTitle: string;
  closingDescription: string;
  pathways: readonly SolutionPathway[];
};

export const solutionsByNeedContent: Record<"en" | "fr", SolutionsByNeedContent> = {
  en: {
    navLabel: "Solutions by Need",
    menuEyebrow: "Start with the outcome",
    menuDescription: "Choose what needs to change. We’ll connect it to the right service and next step.",
    viewAll: "View all solutions by need",
    assessmentLabel: "Not sure where to start?",
    assessmentDescription: "Take the 5-minute assessment for a practical starting point.",
    metadataTitle: "Solutions by Business Need | ROALLA",
    metadataDescription: "Explore eight outcome-focused pathways for strategy, technology, digital experiences, automation, visibility, team execution, events, and ongoing optimization.",
    eyebrow: "Solutions by need",
    title: "Start with the outcome you need—not a service name.",
    intro: "Whether the pressure is growth, operational friction, a technology decision, or a team that needs focus, choose the result you are working toward. Each pathway connects the need to a practical ROALLA service.",
    heroPrimary: "Find your starting point",
    heroSecondary: "Explore the eight pathways",
    pathwaysEyebrow: "Eight outcome pathways",
    pathwaysTitle: "What needs to change next?",
    pathwaysDescription: "Pick the closest match. You do not need to diagnose the solution before the conversation starts.",
    signsLabel: "This may fit when",
    serviceCta: "Explore this service",
    assessmentPrompt: "Still deciding? The assessment turns your priorities into a recommended starting point.",
    closingEyebrow: "A simpler first step",
    closingTitle: "Bring the need. We’ll help shape the route.",
    closingDescription: "The short assessment gives you a useful direction before a service inquiry—without requiring a finished brief.",
    pathways: [
      {
        id: "strategy",
        shortTitle: "Set direction and priorities",
        title: "Turn competing priorities into an executable plan",
        description: "Clarify the decisions, operating rhythm, ownership, and sequence needed to move from ideas to progress.",
        signals: ["Too many priorities are competing", "Plans stall between meetings", "Ownership or measures are unclear"],
        href: "/programs/business-enablement",
        serviceLabel: "Business Advisory",
      },
      {
        id: "technology",
        shortTitle: "Choose the right technology",
        title: "Compare options and carry the decision through implementation",
        description: "Evaluate cloud, security, communications, connectivity, and platforms against your real requirements.",
        signals: ["A renewal or replacement is approaching", "Vendor choices are difficult to compare", "Implementation risk is slowing the decision"],
        href: "/programs/technology-advisory",
        serviceLabel: "Technology Advisory & Solution Sourcing",
      },
      {
        id: "digital-experience",
        shortTitle: "Build a digital experience",
        title: "Create a website, portal, app, or connected customer journey",
        description: "Design and build digital experiences that make the business easier to discover, understand, buy from, and work with.",
        signals: ["Your site no longer reflects the business", "Customers face avoidable friction", "A new product or workflow needs a digital home"],
        href: "/services/digital",
        serviceLabel: "Digital Enablement & Implementation",
      },
      {
        id: "automation-ai",
        shortTitle: "Automate work with control",
        title: "Reduce manual effort with connected workflows and governed AI",
        description: "Identify repeatable work, connect approved systems, and introduce automation or AI agents with human oversight.",
        signals: ["Teams re-enter the same information", "Handoffs are slow or inconsistent", "You want practical AI without losing control"],
        href: "/services/agentic",
        serviceLabel: "ROALLA Agentic",
      },
      {
        id: "visibility",
        shortTitle: "Improve visibility and conversion",
        title: "Help people, search engines, and AI systems understand your value",
        description: "Improve technical health, content clarity, accessibility, trust signals, performance, and conversion paths.",
        signals: ["Qualified buyers are not finding you", "Traffic does not become action", "Your site is unclear to search or AI systems"],
        href: "/services/digital-visibility-optimization",
        serviceLabel: "Digital Visibility Optimization",
      },
      {
        id: "team-execution",
        shortTitle: "Strengthen team execution",
        title: "Create focus, better decisions, and healthier commitments",
        description: "Use an applied workshop to address attention, workload, meetings, offer clarity, or idea selection with a concrete output.",
        signals: ["The team is overloaded or interrupted", "Meetings end without decisions", "An offer or idea needs sharper focus"],
        href: "/programs/workshops",
        serviceLabel: "Team Workshops",
      },
      {
        id: "events",
        shortTitle: "Make events work harder",
        title: "Connect the event experience to measurable follow-up",
        description: "Build event pages, booth tools, interactive experiences, and follow-up flows that support engagement before, during, and after the event.",
        signals: ["Booth engagement is hard to measure", "Lead capture and follow-up are disconnected", "The event needs a stronger digital layer"],
        href: "/services/digital-events",
        serviceLabel: "Digital Events",
      },
      {
        id: "optimization",
        shortTitle: "Keep improving what you have",
        title: "Maintain, measure, and evolve digital systems over time",
        description: "Create an ongoing rhythm for care, evidence-based improvements, backlog decisions, and advisory support.",
        signals: ["Important updates keep slipping", "Performance is not being reviewed", "You need continuity after launch"],
        href: "/services/managed-optimization",
        serviceLabel: "Managed Optimization",
      },
    ],
  },
  fr: {
    navLabel: "Solutions par besoin",
    menuEyebrow: "Partez du résultat",
    menuDescription: "Choisissez ce qui doit changer. Nous le relierons au bon service et à la prochaine étape.",
    viewAll: "Voir toutes les solutions par besoin",
    assessmentLabel: "Vous ne savez pas par où commencer?",
    assessmentDescription: "Faites l’évaluation de 5 minutes pour obtenir un point de départ pratique.",
    metadataTitle: "Solutions par besoin d’affaires | ROALLA",
    metadataDescription: "Explorez huit parcours axés sur les résultats : stratégie, technologie, expériences numériques, automatisation, visibilité, exécution d’équipe, événements et optimisation continue.",
    eyebrow: "Solutions par besoin",
    title: "Partez du résultat recherché, pas du nom d’un service.",
    intro: "Qu’il s’agisse de croissance, de friction opérationnelle, d’une décision technologique ou d’une équipe qui doit retrouver son focus, choisissez le résultat visé. Chaque parcours relie le besoin à un service ROALLA concret.",
    heroPrimary: "Trouver votre point de départ",
    heroSecondary: "Explorer les huit parcours",
    pathwaysEyebrow: "Huit parcours de résultats",
    pathwaysTitle: "Qu’est-ce qui doit changer maintenant?",
    pathwaysDescription: "Choisissez le besoin le plus proche. Vous n’avez pas à diagnostiquer la solution avant la conversation.",
    signsLabel: "Ce parcours peut convenir si",
    serviceCta: "Explorer ce service",
    assessmentPrompt: "Vous hésitez encore? L’évaluation transforme vos priorités en point de départ recommandé.",
    closingEyebrow: "Une première étape plus simple",
    closingTitle: "Apportez le besoin. Nous vous aiderons à tracer la route.",
    closingDescription: "La courte évaluation vous donne une direction utile avant une demande de service, sans exiger un cahier des charges finalisé.",
    pathways: [
      { id: "strategy", shortTitle: "Fixer la direction et les priorités", title: "Transformer des priorités concurrentes en plan exécutable", description: "Clarifiez les décisions, le rythme opérationnel, les responsabilités et la séquence pour passer des idées aux progrès.", signals: ["Trop de priorités se font concurrence", "Les plans bloquent entre les réunions", "Les responsabilités ou mesures sont floues"], href: "/programs/business-enablement", serviceLabel: "Conseil d’affaires" },
      { id: "technology", shortTitle: "Choisir la bonne technologie", title: "Comparer les options et mener la décision jusqu’à la mise en œuvre", description: "Évaluez l’infonuagique, la sécurité, les communications, la connectivité et les plateformes selon vos besoins réels.", signals: ["Un renouvellement ou remplacement approche", "Les offres fournisseurs sont difficiles à comparer", "Le risque de mise en œuvre ralentit la décision"], href: "/programs/technology-advisory", serviceLabel: "Conseil technologique et recherche de solutions" },
      { id: "digital-experience", shortTitle: "Créer une expérience numérique", title: "Créer un site, un portail, une appli ou un parcours client connecté", description: "Concevez des expériences numériques qui rendent l’entreprise plus facile à trouver, comprendre, choisir et contacter.", signals: ["Votre site ne reflète plus l’entreprise", "Les clients rencontrent des frictions évitables", "Un nouveau produit ou flux a besoin d’un espace numérique"], href: "/services/digital", serviceLabel: "Accompagnement numérique et mise en œuvre" },
      { id: "automation-ai", shortTitle: "Automatiser avec contrôle", title: "Réduire le travail manuel avec des flux connectés et une IA gouvernée", description: "Repérez le travail répétable, connectez les systèmes approuvés et introduisez l’automatisation ou des agents IA sous supervision humaine.", signals: ["Les équipes ressaisissent les mêmes données", "Les transferts sont lents ou incohérents", "Vous voulez une IA pratique sans perdre le contrôle"], href: "/services/agentic", serviceLabel: "ROALLA Agentic" },
      { id: "visibility", shortTitle: "Améliorer visibilité et conversion", title: "Aider les personnes, moteurs et systèmes IA à comprendre votre valeur", description: "Améliorez la santé technique, la clarté du contenu, l’accessibilité, la confiance, la performance et les parcours de conversion.", signals: ["Les bons acheteurs ne vous trouvent pas", "Le trafic ne devient pas action", "Votre site demeure flou pour la recherche ou l’IA"], href: "/services/digital-visibility-optimization", serviceLabel: "Optimisation de la visibilité numérique" },
      { id: "team-execution", shortTitle: "Renforcer l’exécution d’équipe", title: "Créer du focus, de meilleures décisions et des engagements réalistes", description: "Utilisez un atelier appliqué pour agir sur l’attention, la charge, les réunions, la clarté d’une offre ou le choix des idées.", signals: ["L’équipe est surchargée ou interrompue", "Les réunions finissent sans décision", "Une offre ou une idée doit être mieux ciblée"], href: "/programs/workshops", serviceLabel: "Ateliers d’équipe" },
      { id: "events", shortTitle: "Accroître l’impact des événements", title: "Relier l’expérience événementielle à un suivi mesurable", description: "Créez des pages, outils de kiosque, expériences interactives et flux de suivi qui soutiennent l’engagement avant, pendant et après l’événement.", signals: ["L’engagement au kiosque est difficile à mesurer", "La collecte et le suivi des pistes sont déconnectés", "L’événement a besoin d’une couche numérique plus forte"], href: "/services/digital-events", serviceLabel: "Événements numériques" },
      { id: "optimization", shortTitle: "Améliorer ce qui existe", title: "Maintenir, mesurer et faire évoluer vos systèmes numériques", description: "Créez un rythme continu d’entretien, d’améliorations fondées sur les preuves, de décisions de carnet et de soutien-conseil.", signals: ["Les mises à jour importantes glissent", "La performance n’est pas examinée", "Vous avez besoin de continuité après le lancement"], href: "/services/managed-optimization", serviceLabel: "Optimisation gérée" },
    ],
  },
};
