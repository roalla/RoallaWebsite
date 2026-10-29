export const SOLUTION_PATH_IDS = [
  "strategy",
  "cloud-infrastructure",
  "communications",
  "security",
  "iot",
  "network",
  "digital-experience",
  "automation-ai",
  "visibility",
] as const;

export type SolutionPathId = (typeof SOLUTION_PATH_IDS)[number];

export type SolutionPathHref =
  | "/services/business-advisory"
  | "/services/technology-advisory"
  | "/services/digital"
  | "/services/ai-agents"
  | "/services/search-ai-visibility"
  | "/programs/workshops"
  | "/services/digital-events"
  | "/services/managed-optimization"
  | "/services/security-risk-compliance";

export type SolutionPathway = {
  id: SolutionPathId;
  shortTitle: string;
  navDescription: string;
  title: string;
  description: string;
  signals: readonly string[];
  examples: readonly string[];
  result: string;
  relatedLinks?: readonly { label: string; href: SolutionPathHref }[];
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
  examplesLabel: string;
  resultLabel: string;
  serviceCta: string;
  visibilityToolLabel: string;
  visibilityToolTitle: string;
  visibilityToolBody: string;
  visibilityToolCta: string;
  assessmentPrompt: string;
  closingEyebrow: string;
  closingTitle: string;
  closingDescription: string;
  pathways: readonly SolutionPathway[];
};

export const solutionsByNeedContent: Record<"en" | "fr", SolutionsByNeedContent> = {
  en: {
    navLabel: "Solutions by Outcome",
    menuEyebrow: "Start with the outcome",
    menuDescription: "Choose what needs to change. We’ll connect it to the right service and next step.",
    viewAll: "View all business outcomes",
    assessmentLabel: "Not sure where to start?",
    assessmentDescription: "Take the 5-minute assessment for a practical starting point.",
    metadataTitle: "Solutions by Business Outcome | ROALLA",
    metadataDescription: "Explore outcome-focused paths for strategy, cloud, communications, cybersecurity, IoT, networks, digital experiences, automation, AI, and visibility.",
    eyebrow: "Solutions by outcome",
    title: "Start with the outcome you need—not a service name.",
    intro: "Whether the pressure is growth, operational risk, technology change, or customer friction, choose the result you are working toward. Each pathway connects the outcome to a practical ROALLA service.",
    heroPrimary: "Find your starting point",
    heroSecondary: "Explore the outcome pathways",
    pathwaysEyebrow: "Executive outcome pathways",
    pathwaysTitle: "What needs to change next?",
    pathwaysDescription: "Pick the closest match. You do not need to diagnose the solution before the conversation starts.",
    signsLabel: "This may fit when",
    examplesLabel: "What this can include",
    resultLabel: "Typical result",
    serviceCta: "Explore this outcome",
    visibilityToolLabel: "Start with evidence",
    visibilityToolTitle: "Check your website first.",
    visibilityToolBody: "Enter your domain in the free Digital Presence Snapshot—performance, search readability, and priority actions. No email required.",
    visibilityToolCta: "Check my website",
    assessmentPrompt: "Still deciding? The assessment turns your priorities into a recommended starting point.",
    closingEyebrow: "A simpler first step",
    closingTitle: "Bring the need. We’ll help shape the route.",
    closingDescription: "The short assessment gives you a useful direction before a service inquiry—without requiring a finished brief.",
    pathways: [
      {
        id: "strategy",
        shortTitle: "Set direction and priorities",
        navDescription: "Turn competing priorities into an executable plan",
        title: "Turn competing priorities into an executable plan",
        description: "Clarify the decisions, operating rhythm, ownership, and sequence needed to move from ideas to progress.",
        signals: ["Too many priorities are competing", "Plans stall between meetings", "Ownership or measures are unclear"],
        examples: ["Strategy and operating priorities", "Technology roadmap", "Decision rights and measures"],
        result: "A focused roadmap with sequenced priorities, accountable owners, and evidence for the next decision.",
        href: "/services/business-advisory",
        serviceLabel: "Business Advisory",
      },
      {
        id: "cloud-infrastructure",
        shortTitle: "Modernize infrastructure and cloud",
        navDescription: "Plan, migrate, and manage the right environment",
        title: "Build a technology environment that can scale with the business",
        description: "Plan, source, migrate, and manage workloads across private, hybrid, and public cloud environments while considering security, resilience, cost, integration, and operational ownership together.",
        signals: ["Infrastructure is limiting growth or reliability", "A cloud or data-centre migration is approaching", "Cost, ownership, or recovery responsibilities are unclear"],
        examples: ["Private, hybrid, and public cloud", "Migration and modernization", "Managed infrastructure and continuity"],
        result: "Clear requirements, qualified architecture and provider options, a commercial comparison, and a practical migration and management plan.",
        href: "/services/technology-advisory",
        serviceLabel: "Technology Advisory & Solution Sourcing",
      },
      {
        id: "communications",
        shortTitle: "Improve customer and team communications",
        navDescription: "Modernize calling, collaboration, and customer service",
        title: "Make every conversation easier to manage and act on",
        description: "Modernize calling, collaboration, customer service, and contact-centre operations with qualified options that fit your workflows, locations, integrations, and service expectations.",
        signals: ["An aging phone system is expensive or inflexible", "Customer interactions are fragmented across channels", "Remote teams cannot collaborate consistently"],
        examples: ["Unified Communications as a Service (UCaaS)", "Contact Centre as a Service (CCaaS)", "Calling, collaboration, routing, and CRM integration"],
        result: "Documented communication requirements, qualified UCaaS or CCaaS options, a commercial comparison, and a staged migration plan.",
        href: "/services/technology-advisory",
        serviceLabel: "Technology Advisory & Solution Sourcing",
      },
      {
        id: "security",
        shortTitle: "Reduce security and compliance risk",
        navDescription: "Find gaps, prioritize remediation, and prepare with confidence",
        title: "Know where the risk is—and what to address first",
        description: "Assess security gaps, prioritize remediation, prepare for SOC 2, and compare managed security solutions according to your environment, obligations, and risk tolerance.",
        signals: ["Leaders lack a clear view of material security gaps", "Customers or partners are asking for stronger assurance", "Security responsibilities are divided across internal and external teams"],
        examples: ["Security reviews and remediation roadmaps", "SOC 2 readiness support", "Managed security solution sourcing"],
        result: "A prioritized risk and remediation roadmap, clearer control ownership, and qualified security or managed-service options. Independent SOC 2 examinations remain with a qualified CPA firm.",
        href: "/services/security-risk-compliance",
        serviceLabel: "Security, Risk & Compliance",
      },
      {
        id: "iot",
        shortTitle: "Connect operations with IoT",
        navDescription: "Turn connected assets and operational data into action",
        title: "Use connected assets and data to improve operational decisions",
        description: "Evaluate IoT solutions for monitoring, tracking, automation, safety, and operational visibility—including devices, connectivity, platforms, security, integration, and ongoing management.",
        signals: ["Physical assets or environments are difficult to monitor", "Manual readings and operational handoffs create delays", "A connected-device initiative lacks architecture or ownership"],
        examples: ["Asset and environmental monitoring", "Connected equipment and sensors", "Secure data collection, alerts, and integration"],
        result: "A defined IoT use case, architecture and connectivity requirements, qualified options, and a controlled pilot-to-scale roadmap.",
        href: "/services/technology-advisory",
        serviceLabel: "Technology Advisory & Solution Sourcing",
      },
      {
        id: "network",
        shortTitle: "Strengthen network performance and resilience",
        navDescription: "Connect locations, users, cloud systems, and devices reliably",
        title: "Give every location, system, and user reliable connectivity",
        description: "Assess and source network solutions for offices, branches, remote teams, cloud environments, and connected devices—with performance, security, redundancy, support, and total cost evaluated together.",
        signals: ["Connectivity problems interrupt customer or employee work", "Multiple locations or providers are difficult to manage", "Cloud, communications, or IoT plans require a stronger network foundation"],
        examples: ["Internet, WAN, SD-WAN, and branch connectivity", "Wireless and remote access", "Resilience, failover, performance, and support"],
        result: "A current-state network assessment, clear service requirements, comparable provider options, and a resilient transition plan.",
        href: "/services/technology-advisory",
        serviceLabel: "Technology Advisory & Solution Sourcing",
      },
      {
        id: "digital-experience",
        shortTitle: "Build a digital experience",
        navDescription: "Create a website, portal, app, or event experience",
        title: "Create a connected experience people can understand and act on",
        description: "Design and build websites, portals, applications, event experiences, and connected customer journeys that make the organization easier to discover, understand, engage with, and act on.",
        signals: ["Your site no longer reflects the business", "Customers or employees face avoidable digital friction", "A new service, workflow, or event needs a digital experience"],
        examples: ["Websites, portals, and applications", "Customer and employee journeys", "Event pages, booth tools, lead capture, and follow-up"],
        result: "A scoped, accessible digital experience with a clear user journey, measurable actions, and an accountable path through launch and adoption.",
        relatedLinks: [{ label: "See event digital experiences", href: "/services/digital-events" }],
        href: "/services/digital",
        serviceLabel: "Digital Enablement & Implementation",
      },
      {
        id: "automation-ai",
        shortTitle: "Automate work with control",
        navDescription: "Connect workflows and apply AI with human oversight",
        title: "Reduce manual effort with connected workflows and governed AI",
        description: "Identify repeatable work, connect approved systems, and introduce automation or AI agents with human oversight.",
        signals: ["Teams re-enter the same information", "Handoffs are slow or inconsistent", "You want practical AI without losing control"],
        examples: ["Workflow and system integration", "Task and decision automation", "Governed AI agents with escalation controls"],
        result: "A prioritized automation opportunity, defined controls and exceptions, and an implementation path tied to measurable operating value.",
        href: "/services/ai-agents",
        serviceLabel: "ROALLA Agentic",
      },
      {
        id: "visibility",
        shortTitle: "Improve visibility and conversion",
        navDescription: "Help buyers, search engines, and AI understand your value",
        title: "Help people, search engines, and AI systems understand your value",
        description: "Improve technical health, content clarity, accessibility, trust signals, performance, and conversion paths.",
        signals: ["Qualified buyers are not finding you", "Traffic does not become action", "Your site is unclear to search or AI systems"],
        examples: ["Search and AI readability", "Accessibility and technical performance", "Trust, measurement, and conversion paths"],
        result: "A prioritized improvement roadmap, a trustworthy measurement baseline, and focused changes tied to discovery and conversion outcomes.",
        href: "/services/search-ai-visibility",
        serviceLabel: "Digital Visibility Optimization",
      },
    ],
  },
  fr: {
    navLabel: "Solutions par résultat",
    menuEyebrow: "Partez du résultat",
    menuDescription: "Choisissez ce qui doit changer. Nous le relierons au bon service et à la prochaine étape.",
    viewAll: "Voir tous les résultats d’affaires",
    assessmentLabel: "Vous ne savez pas par où commencer?",
    assessmentDescription: "Faites l’évaluation de 5 minutes pour obtenir un point de départ pratique.",
    metadataTitle: "Solutions par résultat d’affaires | ROALLA",
    metadataDescription: "Explorez des parcours axés sur les résultats pour la stratégie, l’infonuagique, les communications, la cybersécurité, l’IdO, les réseaux, les expériences numériques, l’automatisation, l’IA et la visibilité.",
    eyebrow: "Solutions par résultat",
    title: "Partez du résultat recherché, pas du nom d’un service.",
    intro: "Qu’il s’agisse de croissance, de risque opérationnel, d’un changement technologique ou de friction client, choisissez le résultat visé. Chaque parcours relie ce résultat à un service ROALLA concret.",
    heroPrimary: "Trouver votre point de départ",
    heroSecondary: "Explorer les parcours de résultats",
    pathwaysEyebrow: "Parcours de résultats pour dirigeants",
    pathwaysTitle: "Qu’est-ce qui doit changer maintenant?",
    pathwaysDescription: "Choisissez le besoin le plus proche. Vous n’avez pas à diagnostiquer la solution avant la conversation.",
    signsLabel: "Ce parcours peut convenir si",
    examplesLabel: "Ce que cela peut comprendre",
    resultLabel: "Résultat type",
    serviceCta: "Explorer ce résultat",
    visibilityToolLabel: "Commencer par des preuves",
    visibilityToolTitle: "Vérifiez d’abord votre site Web.",
    visibilityToolBody: "Entrez votre domaine dans l’Aperçu gratuit de présence numérique—performance, lisibilité pour la recherche et actions prioritaires. Aucun courriel requis.",
    visibilityToolCta: "Vérifier mon site",
    assessmentPrompt: "Vous hésitez encore? L’évaluation transforme vos priorités en point de départ recommandé.",
    closingEyebrow: "Une première étape plus simple",
    closingTitle: "Apportez le besoin. Nous vous aiderons à tracer la route.",
    closingDescription: "La courte évaluation vous donne une direction utile avant une demande de service, sans exiger un cahier des charges finalisé.",
    pathways: [
      { id: "strategy", shortTitle: "Fixer la direction et les priorités", navDescription: "Transformer des priorités concurrentes en plan exécutable", title: "Transformer des priorités concurrentes en plan exécutable", description: "Clarifiez les décisions, le rythme opérationnel, les responsabilités et la séquence pour passer des idées aux progrès.", signals: ["Trop de priorités se font concurrence", "Les plans bloquent entre les réunions", "Les responsabilités ou mesures sont floues"], examples: ["Stratégie et priorités opérationnelles", "Feuille de route technologique", "Droits de décision et mesures"], result: "Une feuille de route ciblée avec des priorités séquencées, des responsables désignés et les éléments probants nécessaires à la prochaine décision.", href: "/services/business-advisory", serviceLabel: "Conseil d’affaires" },
      { id: "cloud-infrastructure", shortTitle: "Moderniser l’infrastructure et l’infonuagique", navDescription: "Planifier, migrer et gérer le bon environnement", title: "Bâtir un environnement technologique capable d’évoluer avec l’entreprise", description: "Planifiez, recherchez, migrez et gérez les charges de travail dans des environnements privés, hybrides et publics en considérant ensemble la sécurité, la résilience, les coûts, l’intégration et la responsabilité opérationnelle.", signals: ["L’infrastructure limite la croissance ou la fiabilité", "Une migration infonuagique ou de centre de données approche", "Les coûts, la responsabilité ou la reprise sont mal définis"], examples: ["Infonuagique privée, hybride et publique", "Migration et modernisation", "Infrastructure gérée et continuité"], result: "Des exigences claires, des options d’architecture et de fournisseurs qualifiées, une comparaison commerciale et un plan pratique de migration et de gestion.", href: "/services/technology-advisory", serviceLabel: "Conseil technologique et recherche de solutions" },
      { id: "communications", shortTitle: "Améliorer les communications clients et équipes", navDescription: "Moderniser les appels, la collaboration et le service client", title: "Rendre chaque conversation plus facile à gérer et à transformer en action", description: "Modernisez les appels, la collaboration, le service client et les opérations de centre de contact avec des options qualifiées adaptées à vos flux, emplacements, intégrations et attentes de service.", signals: ["Un système téléphonique vieillissant est coûteux ou rigide", "Les interactions clients sont fragmentées entre les canaux", "Les équipes à distance collaborent difficilement"], examples: ["Communications unifiées en tant que service (UCaaS)", "Centre de contact en tant que service (CCaaS)", "Appels, collaboration, routage et intégration CRM"], result: "Des exigences documentées, des options UCaaS ou CCaaS qualifiées, une comparaison commerciale et un plan de migration par étapes.", href: "/services/technology-advisory", serviceLabel: "Conseil technologique et recherche de solutions" },
      { id: "security", shortTitle: "Réduire les risques de sécurité et de conformité", navDescription: "Repérer les écarts, prioriser la remédiation et se préparer", title: "Savoir où se trouve le risque et quoi traiter en premier", description: "Évaluez les écarts de sécurité, priorisez la remédiation, préparez-vous à SOC 2 et comparez les solutions de sécurité gérée selon votre environnement, vos obligations et votre tolérance au risque.", signals: ["La direction n’a pas une vue claire des principaux écarts de sécurité", "Des clients ou partenaires demandent une assurance accrue", "Les responsabilités de sécurité sont réparties entre plusieurs équipes"], examples: ["Revues de sécurité et feuilles de route de remédiation", "Soutien à la préparation SOC 2", "Recherche de solutions de sécurité gérée"], result: "Une feuille de route priorisée des risques et de la remédiation, une responsabilité plus claire des contrôles et des options de sécurité qualifiées. L’examen SOC 2 indépendant demeure la responsabilité d’un cabinet de CPA qualifié.", href: "/services/security-risk-compliance", serviceLabel: "Sécurité, risque et conformité" },
      { id: "iot", shortTitle: "Connecter les opérations grâce à l’IdO", navDescription: "Transformer les actifs connectés et les données en actions", title: "Utiliser les actifs connectés et les données pour améliorer les décisions opérationnelles", description: "Évaluez des solutions IdO pour la surveillance, le suivi, l’automatisation, la sécurité et la visibilité opérationnelle, y compris les appareils, la connectivité, les plateformes, la cybersécurité, l’intégration et la gestion continue.", signals: ["Les actifs physiques ou les environnements sont difficiles à surveiller", "Les relevés manuels et transferts opérationnels causent des délais", "Une initiative d’appareils connectés manque d’architecture ou de responsable"], examples: ["Surveillance des actifs et des environnements", "Équipements et capteurs connectés", "Collecte sécurisée, alertes et intégration"], result: "Un cas d’usage IdO défini, des exigences d’architecture et de connectivité, des options qualifiées et une feuille de route contrôlée du projet pilote au déploiement.", href: "/services/technology-advisory", serviceLabel: "Conseil technologique et recherche de solutions" },
      { id: "network", shortTitle: "Renforcer la performance et la résilience du réseau", navDescription: "Relier fiablement les sites, utilisateurs, systèmes et appareils", title: "Fournir une connectivité fiable à chaque site, système et utilisateur", description: "Évaluez et recherchez des solutions réseau pour les bureaux, succursales, équipes à distance, environnements infonuagiques et appareils connectés en comparant ensemble la performance, la sécurité, la redondance, le soutien et le coût total.", signals: ["Les problèmes de connectivité interrompent le travail", "Plusieurs sites ou fournisseurs sont difficiles à gérer", "Les projets infonuagiques, de communications ou d’IdO exigent une meilleure fondation réseau"], examples: ["Internet, WAN, SD-WAN et connectivité des succursales", "Sans-fil et accès à distance", "Résilience, relève, performance et soutien"], result: "Une évaluation du réseau actuel, des exigences de service claires, des options de fournisseurs comparables et un plan de transition résilient.", href: "/services/technology-advisory", serviceLabel: "Conseil technologique et recherche de solutions" },
      { id: "digital-experience", shortTitle: "Créer une expérience numérique", navDescription: "Créer un site, un portail, une appli ou une expérience événementielle", title: "Créer une expérience connectée que les gens comprennent et utilisent", description: "Concevez et réalisez des sites, portails, applications, expériences événementielles et parcours clients connectés qui rendent l’organisation plus facile à découvrir, comprendre, choisir et contacter.", signals: ["Votre site ne reflète plus l’entreprise", "Les clients ou employés rencontrent des frictions numériques", "Un service, un flux ou un événement a besoin d’une expérience numérique"], examples: ["Sites Web, portails et applications", "Parcours clients et employés", "Pages événementielles, outils de kiosque, collecte et suivi des pistes"], result: "Une expérience numérique définie et accessible, avec un parcours clair, des actions mesurables et une responsabilité continue jusqu’au lancement et à l’adoption.", relatedLinks: [{ label: "Voir les expériences numériques événementielles", href: "/services/digital-events" }], href: "/services/digital", serviceLabel: "Accompagnement numérique et mise en œuvre" },
      { id: "automation-ai", shortTitle: "Automatiser avec contrôle", navDescription: "Connecter les flux et appliquer l’IA avec supervision humaine", title: "Réduire le travail manuel avec des flux connectés et une IA gouvernée", description: "Repérez le travail répétable, connectez les systèmes approuvés et introduisez l’automatisation ou des agents IA sous supervision humaine.", signals: ["Les équipes ressaisissent les mêmes données", "Les transferts sont lents ou incohérents", "Vous voulez une IA pratique sans perdre le contrôle"], examples: ["Intégration des systèmes et flux de travail", "Automatisation des tâches et décisions", "Agents IA gouvernés avec mécanismes d’escalade"], result: "Une occasion d’automatisation priorisée, des contrôles et exceptions définis, et un parcours de mise en œuvre lié à une valeur opérationnelle mesurable.", href: "/services/ai-agents", serviceLabel: "ROALLA Agentic" },
      { id: "visibility", shortTitle: "Améliorer visibilité et conversion", navDescription: "Aider les acheteurs, moteurs et IA à comprendre votre valeur", title: "Aider les personnes, moteurs et systèmes IA à comprendre votre valeur", description: "Améliorez la santé technique, la clarté du contenu, l’accessibilité, la confiance, la performance et les parcours de conversion.", signals: ["Les bons acheteurs ne vous trouvent pas", "Le trafic ne devient pas action", "Votre site demeure flou pour la recherche ou l’IA"], examples: ["Lisibilité pour la recherche et l’IA", "Accessibilité et performance technique", "Confiance, mesure et parcours de conversion"], result: "Une feuille de route d’amélioration priorisée, une base de mesure fiable et des changements ciblés liés aux résultats de découverte et de conversion.", href: "/services/search-ai-visibility", serviceLabel: "Optimisation de la visibilité numérique" },
    ],
  },
};
