export type AgenticServiceCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  description: string;
  outcome: string;
  cta: string;
  secondaryCta: string;
  journeyLabel: string;
  journey: readonly { label: string; description: string; href: string }[];
  capabilitiesEyebrow: string;
  capabilitiesTitle: string;
  capabilitiesDescription: string;
  capabilities: readonly { title: string; description: string; points: readonly string[] }[];
  useCasesEyebrow: string;
  useCasesTitle: string;
  useCases: readonly { title: string; description: string }[];
  methodEyebrow: string;
  methodTitle: string;
  method: readonly { title: string; description: string }[];
  governanceEyebrow: string;
  governanceTitle: string;
  governanceDescription: string;
  governance: readonly string[];
  platformEyebrow: string;
  platformTitle: string;
  platformDescription: string;
  platformLayers: readonly { title: string; description: string }[];
  starterEyebrow: string;
  starterTitle: string;
  starterDescription: string;
  starterIncludes: readonly string[];
  starterFit: string;
  starterCta: string;
  faqTitle: string;
  faqs: readonly { question: string; answer: string }[];
  finalTitle: string;
  finalDescription: string;
  metadataTitle: string;
  metadataDescription: string;
};

export const agenticServiceContent: Record<"en" | "fr", AgenticServiceCopy> = {
  en: {
    eyebrow: "ROALLA Agentic",
    title: "AI that doesn’t just answer. It acts.",
    lead: "Agentic AI consulting and AI agent development for Canadian businesses ready to turn useful intelligence into controlled, measurable work.",
    description: "ROALLA designs business AI agents that understand context, coordinate approved tools and data, complete multi-step workflows, and bring people in when judgment or approval matters.",
    outcome: "Start with one valuable workflow. Prove the controls, integration, and business result before expanding.",
    cta: "Explore an agent opportunity",
    secondaryCta: "See workflow automation",
    journeyLabel: "ROALLA technology journey",
    journey: [
      { label: "Advise", description: "Clarify the business outcome and requirements.", href: "/programs/technology-advisory" },
      { label: "Source", description: "Compare platforms, providers, and practical constraints.", href: "/programs/technology-advisory" },
      { label: "Agentic", description: "Design how AI can reason, act, and escalate safely.", href: "/services/agentic" },
      { label: "Build / Connect", description: "Implement agents, integrations, and operating workflows.", href: "/services/digital" },
      { label: "Improve", description: "Measure performance, govern change, and expand what works.", href: "/services/managed-optimization" },
    ],
    capabilitiesEyebrow: "From assistance to accountable action",
    capabilitiesTitle: "A practical agentic capability for your business",
    capabilitiesDescription: "An AI agent is useful when it can pursue a defined objective across approved systems—not when it is simply another chat window.",
    capabilities: [
      { title: "Business AI agents", description: "Purpose-built agents for recurring work, customer service, operations, research, and internal coordination.", points: ["Clear objective and boundaries", "Context from approved business sources", "Traceable actions and outcomes"] },
      { title: "AI workflow automation", description: "Multi-step workflows that combine language models, business rules, conventional automation, and human decisions.", points: ["Triggers, tools, and handoffs", "Exception and fallback paths", "Monitoring and recovery"] },
      { title: "AI orchestration and integration", description: "Connect agents to the systems where work already happens, using the least complex architecture that meets the need.", points: ["CRM, email, documents, and databases", "APIs and approved tool access", "Single-agent or coordinated-agent patterns"] },
      { title: "Human-in-the-loop control", description: "Keep people accountable for sensitive, ambiguous, financial, legal, or customer-impacting decisions.", points: ["Approval checkpoints", "Role-based permissions", "Escalation with useful context"] },
    ],
    useCasesEyebrow: "Practical business use cases",
    useCasesTitle: "Where AI agents can create value",
    useCases: [
      { title: "Lead and inquiry coordination", description: "Qualify requests, enrich context, draft responses, update the CRM, and route exceptions for review." },
      { title: "Customer and employee service", description: "Answer from governed knowledge, gather missing information, initiate approved tasks, and escalate cleanly." },
      { title: "Operations and case work", description: "Read documents, check requirements, prepare records, coordinate handoffs, and surface cases that need judgment." },
      { title: "Reporting and management insight", description: "Collect approved data, identify changes, prepare explanations, and distribute scheduled decision briefs." },
      { title: "Sales and proposal support", description: "Research accounts, organize discovery notes, assemble compliant drafts, and preserve a human approval step." },
      { title: "Knowledge and research workflows", description: "Search trusted sources, synthesize evidence, cite the basis for an answer, and maintain reusable organizational knowledge." },
    ],
    methodEyebrow: "Agentic AI consulting",
    methodTitle: "Move from opportunity to a governed pilot",
    method: [
      { title: "Frame the outcome", description: "Choose a frequent, valuable workflow with a clear owner, measurable baseline, and acceptable risk." },
      { title: "Design the operating model", description: "Map data, tools, permissions, decisions, exceptions, approvals, and the human role." },
      { title: "Build and evaluate", description: "Prototype the agent, test representative and adversarial cases, and validate integrations before release." },
      { title: "Operate and improve", description: "Monitor quality, cost, latency, failures, adoption, and business results; then expand deliberately." },
    ],
    governanceEyebrow: "Governance and security",
    governanceTitle: "Agency needs guardrails",
    governanceDescription: "The more an AI system can do, the more deliberately its authority should be designed. ROALLA applies proportionate controls from discovery through operation.",
    governance: ["Least-privilege access and role-based permissions", "Human approval for consequential actions", "Data classification, retention, and provider review", "Action logs, source traceability, and auditability", "Evaluation for accuracy, unsafe behaviour, and prompt attacks", "Cost limits, failure handling, rollback, and incident ownership"],
    platformEyebrow: "Designed to grow without starting over",
    platformTitle: "A reusable foundation for agentic work",
    platformDescription: "Where scale justifies it, ROALLA can organize reusable agent execution, design, and approved capabilities over secure AI and identity services. Clients see a maintainable operating model—not unnecessary internal complexity.",
    platformLayers: [
      { title: "Agent runtime", description: "Executes approved tasks with policy, observability, and recovery controls." },
      { title: "Agent studio", description: "Defines objectives, instructions, tools, tests, approvals, and deployment settings." },
      { title: "Agent library", description: "Reuses validated skills, connectors, patterns, and domain knowledge across workflows." },
    ],
    starterEyebrow: "Low-risk starting point",
    starterTitle: "Agentic Opportunity & Readiness Sprint",
    starterDescription: "Identify the best first agent, document the workflow and risks, and leave with a decision-ready pilot plan rather than a generic AI roadmap.",
    starterIncludes: ["Prioritized use-case and value hypothesis", "Workflow, data, integration, and approval map", "Governance and security risk review", "Pilot architecture, evaluation plan, and success measures"],
    starterFit: "Best for Ontario and Canadian organizations that have a real workflow in mind, or need help separating durable opportunities from AI noise.",
    starterCta: "Plan an agentic sprint",
    faqTitle: "ROALLA Agentic questions",
    faqs: [
      { question: "What is agentic AI?", answer: "Agentic AI can work toward an objective by interpreting context, selecting approved tools, taking a sequence of actions, checking results, and involving a person when required. Its scope and authority should be explicitly designed." },
      { question: "How is an AI agent different from workflow automation?", answer: "Traditional automation follows predetermined rules. An AI agent can interpret unstructured information and choose among approved next steps. Strong solutions often combine both: deterministic automation for known rules and an agent where context or language matters." },
      { question: "Do we need a multi-agent system?", answer: "Usually not at first. One well-bounded agent with reliable tools, tests, and approvals is easier to govern. Multiple agents are justified only when distinct roles or parallel work create clear value." },
      { question: "Can ROALLA integrate agents with our current systems?", answer: "Often, yes. We validate API availability, identity and permission models, data quality, vendor terms, and operational ownership before recommending an integration." },
      { question: "How do you keep humans in control?", answer: "We define what the agent may read, propose, change, and send; require approval for consequential actions; log activity; provide escalation paths; and test failure modes before broader release." },
      { question: "Does this require replacing our current software?", answer: "No. The preferred starting point is usually to add a controlled agentic layer around systems that already work, replacing tools only where the business case supports it." },
    ],
    finalTitle: "Choose one workflow worth trusting to an agent.",
    finalDescription: "ROALLA will help you assess the opportunity, design the controls, and build the smallest useful pilot—with a practical path into automation, integration, and ongoing improvement.",
    metadataTitle: "AI Agents for Business & Agentic AI Consulting | ROALLA",
    metadataDescription: "Agentic AI consulting, AI agent development, workflow automation, orchestration, integrations and human approvals for businesses in Ontario and across Canada.",
  },
  fr: {
    eyebrow: "ROALLA Agentic",
    title: "Une IA qui ne se contente pas de répondre. Elle agit.",
    lead: "Conseil en IA agentique et développement d’agents IA pour les entreprises canadiennes prêtes à transformer l’intelligence utile en travail contrôlé et mesurable.",
    description: "ROALLA conçoit des agents IA d’entreprise qui comprennent le contexte, coordonnent des outils et données autorisés, réalisent des flux en plusieurs étapes et sollicitent une personne lorsque le jugement ou l’approbation compte.",
    outcome: "Commencez par un flux à forte valeur. Prouvez les contrôles, l’intégration et le résultat d’affaires avant d’élargir.",
    cta: "Explorer une possibilité d’agent",
    secondaryCta: "Voir l’automatisation des flux",
    journeyLabel: "Parcours technologique ROALLA",
    journey: [
      { label: "Conseiller", description: "Clarifier le résultat d’affaires et les exigences.", href: "/programs/technology-advisory" },
      { label: "Rechercher", description: "Comparer plateformes, fournisseurs et contraintes pratiques.", href: "/programs/technology-advisory" },
      { label: "Agentique", description: "Concevoir comment l’IA peut raisonner, agir et escalader de façon sûre.", href: "/services/agentic" },
      { label: "Construire / Relier", description: "Mettre en œuvre agents, intégrations et flux opérationnels.", href: "/services/digital" },
      { label: "Améliorer", description: "Mesurer la performance, gouverner le changement et étendre ce qui fonctionne.", href: "/services/managed-optimization" },
    ],
    capabilitiesEyebrow: "De l’assistance à l’action responsable",
    capabilitiesTitle: "Une capacité agentique pratique pour votre entreprise",
    capabilitiesDescription: "Un agent IA devient utile lorsqu’il peut poursuivre un objectif défini dans des systèmes autorisés—pas lorsqu’il n’est qu’une autre fenêtre de clavardage.",
    capabilities: [
      { title: "Agents IA d’entreprise", description: "Des agents conçus pour le travail récurrent, le service, les opérations, la recherche et la coordination interne.", points: ["Objectif et limites clairs", "Contexte provenant de sources approuvées", "Actions et résultats traçables"] },
      { title: "Automatisation des flux par IA", description: "Des flux en plusieurs étapes combinant modèles de langage, règles d’affaires, automatisation classique et décisions humaines.", points: ["Déclencheurs, outils et transferts", "Exceptions et solutions de repli", "Surveillance et reprise"] },
      { title: "Orchestration et intégration IA", description: "Relier les agents aux systèmes où le travail se fait déjà, avec l’architecture la moins complexe qui répond au besoin.", points: ["CRM, courriel, documents et bases de données", "API et accès autorisés aux outils", "Agent unique ou coordination de plusieurs agents"] },
      { title: "Contrôle humain intégré", description: "Garder les personnes responsables des décisions sensibles, ambiguës, financières, juridiques ou touchant la clientèle.", points: ["Points d’approbation", "Permissions selon les rôles", "Escalade avec un contexte utile"] },
    ],
    useCasesEyebrow: "Cas d’usage concrets",
    useCasesTitle: "Où les agents IA peuvent créer de la valeur",
    useCases: [
      { title: "Coordination des pistes et demandes", description: "Qualifier les demandes, enrichir le contexte, rédiger une réponse, mettre à jour le CRM et acheminer les exceptions." },
      { title: "Service à la clientèle et aux employés", description: "Répondre à partir de connaissances gouvernées, recueillir l’information manquante, lancer des tâches autorisées et escalader proprement." },
      { title: "Opérations et traitement de dossiers", description: "Lire des documents, vérifier les exigences, préparer des dossiers, coordonner les transferts et signaler les cas qui exigent du jugement." },
      { title: "Rapports et information de gestion", description: "Recueillir des données autorisées, repérer les changements, préparer des explications et diffuser des synthèses décisionnelles." },
      { title: "Soutien aux ventes et propositions", description: "Rechercher des comptes, organiser les notes de découverte, préparer des ébauches conformes et préserver l’approbation humaine." },
      { title: "Connaissances et recherche", description: "Chercher dans des sources fiables, synthétiser les preuves, citer la base d’une réponse et maintenir les connaissances réutilisables." },
    ],
    methodEyebrow: "Conseil en IA agentique",
    methodTitle: "Passer de l’occasion à un pilote gouverné",
    method: [
      { title: "Cadrer le résultat", description: "Choisir un flux fréquent et utile avec un responsable, une référence mesurable et un risque acceptable." },
      { title: "Concevoir le modèle opérationnel", description: "Cartographier données, outils, permissions, décisions, exceptions, approbations et rôle humain." },
      { title: "Construire et évaluer", description: "Prototyper l’agent, tester des cas représentatifs et adverses, puis valider les intégrations avant le lancement." },
      { title: "Exploiter et améliorer", description: "Suivre qualité, coût, délai, échecs, adoption et résultats d’affaires, puis élargir avec soin." },
    ],
    governanceEyebrow: "Gouvernance et sécurité",
    governanceTitle: "L’autonomie exige des garde-fous",
    governanceDescription: "Plus un système d’IA peut agir, plus son autorité doit être conçue avec rigueur. ROALLA applique des contrôles proportionnés de la découverte à l’exploitation.",
    governance: ["Accès minimal et permissions selon les rôles", "Approbation humaine pour les actions importantes", "Classification, conservation des données et revue des fournisseurs", "Journaux d’action, traçabilité des sources et auditabilité", "Évaluation de l’exactitude, des comportements risqués et des attaques par invite", "Limites de coût, gestion des échecs, retour arrière et responsabilité des incidents"],
    platformEyebrow: "Conçu pour grandir sans tout recommencer",
    platformTitle: "Une fondation réutilisable pour le travail agentique",
    platformDescription: "Lorsque l’échelle le justifie, ROALLA peut organiser l’exécution, la conception et les capacités approuvées sur des services d’IA et d’identité sécurisés. Le client obtient un modèle maintenable, sans complexité interne inutile.",
    platformLayers: [
      { title: "Moteur d’exécution des agents", description: "Exécute les tâches autorisées avec politiques, observabilité et contrôles de reprise." },
      { title: "Studio d’agents", description: "Définit objectifs, consignes, outils, tests, approbations et paramètres de déploiement." },
      { title: "Bibliothèque d’agents", description: "Réutilise compétences, connecteurs, modèles et connaissances validés dans plusieurs flux." },
    ],
    starterEyebrow: "Point de départ à faible risque",
    starterTitle: "Sprint d’occasion et de préparation agentique",
    starterDescription: "Trouvez le meilleur premier agent, documentez le flux et les risques, puis repartez avec un plan de pilote prêt à décider plutôt qu’une feuille de route IA générique.",
    starterIncludes: ["Cas d’usage priorisé et hypothèse de valeur", "Carte du flux, des données, des intégrations et approbations", "Revue des risques de gouvernance et de sécurité", "Architecture du pilote, plan d’évaluation et mesures de succès"],
    starterFit: "Pour les organisations de l’Ontario et du Canada qui ont un vrai flux en tête ou qui veulent distinguer les occasions durables du bruit autour de l’IA.",
    starterCta: "Planifier un sprint agentique",
    faqTitle: "Questions sur ROALLA Agentic",
    faqs: [
      { question: "Qu’est-ce que l’IA agentique?", answer: "L’IA agentique peut poursuivre un objectif en interprétant le contexte, en choisissant des outils autorisés, en réalisant une suite d’actions, en vérifiant les résultats et en sollicitant une personne au besoin. Sa portée et son autorité doivent être conçues explicitement." },
      { question: "Quelle est la différence entre un agent IA et l’automatisation des flux?", answer: "L’automatisation classique suit des règles prédéterminées. Un agent IA peut interpréter de l’information non structurée et choisir parmi des prochaines étapes autorisées. Les bonnes solutions combinent souvent les deux." },
      { question: "Avons-nous besoin d’un système multi-agent?", answer: "Habituellement pas au départ. Un agent bien délimité avec des outils fiables, des tests et des approbations est plus simple à gouverner. Plusieurs agents se justifient seulement si des rôles distincts ou le travail parallèle créent une valeur claire." },
      { question: "ROALLA peut-elle intégrer des agents à nos systèmes actuels?", answer: "Souvent oui. Nous validons les API, l’identité et les permissions, la qualité des données, les conditions fournisseurs et la responsabilité opérationnelle avant de recommander une intégration." },
      { question: "Comment gardez-vous les humains en contrôle?", answer: "Nous définissons ce que l’agent peut lire, proposer, modifier et envoyer; exigeons une approbation pour les actions importantes; journalisons l’activité; prévoyons l’escalade; et testons les modes d’échec." },
      { question: "Devons-nous remplacer nos logiciels actuels?", answer: "Non. Le meilleur point de départ consiste souvent à ajouter une couche agentique contrôlée autour des systèmes qui fonctionnent déjà, et à remplacer un outil seulement si la valeur d’affaires le justifie." },
    ],
    finalTitle: "Choisissez un flux qui mérite d’être confié à un agent.",
    finalDescription: "ROALLA vous aide à évaluer l’occasion, concevoir les contrôles et bâtir le plus petit pilote utile—avec un chemin pratique vers l’automatisation, l’intégration et l’amélioration continue.",
    metadataTitle: "Agents IA d’entreprise et conseil en IA agentique | ROALLA",
    metadataDescription: "Conseil en IA agentique, développement d’agents IA, automatisation, orchestration, intégrations et approbations humaines en Ontario et au Canada.",
  },
};
