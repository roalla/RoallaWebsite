import type { ServiceLandingCopy } from "@/lib/service-landing-types";

export type ServiceLandingKey =
  | "digital-products"
  | "automation"
  | "managed-optimization";

export const serviceLandingContent: Record<
  "en" | "fr",
  Record<ServiceLandingKey, ServiceLandingCopy>
> = {
  en: {
    "digital-products": {
      eyebrow: "Build",
      title:
        "Digital products built around the value your business needs to create.",
      description:
        "We design and build customer portals, operational platforms, workflow systems, and digital services that help organizations generate revenue, serve customers, and operate more effectively.",
      outcome:
        "The result is a maintainable business capability—not a collection of features.",
      capabilities: [
        [
          "Create Revenue",
          "Paid services, subscriptions, transaction platforms, booking, purchasing, and productized expertise.",
        ],
        [
          "Improve Customer Value",
          "Customer portals, self-service, reporting, onboarding, account information, and support tools.",
        ],
        [
          "Improve Operations",
          "Dashboards, field tools, approvals, compliance workflows, data consolidation, and automation.",
        ],
        [
          "Enable New Services",
          "Digital assessments, guided workflows, remote delivery, customer analytics, and training platforms.",
        ],
      ],
      process: [
        [
          "Discover value",
          "Clarify the customer, operational, or revenue outcome before choosing features.",
        ],
        [
          "Prototype the journey",
          "Validate roles, workflows, information, and the smallest useful release.",
        ],
        [
          "Build and integrate",
          "Deliver in reviewable increments with security, accessibility, and maintainability considered.",
        ],
        [
          "Launch and evolve",
          "Measure real usage and improve the product after launch.",
        ],
      ],
      deliverablesTitle: "What you receive",
      deliverables: [
        "A value brief connecting the product to revenue, customer, or operating outcomes",
        "A validated user journey, roles, information needs, and release priorities",
        "Reviewable prototypes and production milestones",
        "Launch documentation, measurement plan, and an improvement backlog",
      ],
      starter: {
        eyebrow: "Low-risk starting point",
        name: "Digital Product Validation Sprint",
        description: "Validate the problem, user journey, business value, and smallest useful release before committing to a full build.",
        timeline: "Typical timeline: 1–2 weeks",
        investment: "Fixed scope and price confirmed after a free fit review",
        includes: [
          "Business outcome and user definition",
          "Journey and workflow prototype",
          "Risk, dependency, and integration review",
          "Decision-ready build recommendation",
        ],
        fit: "Best for teams with a product or portal idea that still needs evidence and scope.",
        exclusion: "It does not include full production development or unsupported revenue forecasts.",
        cta: "Validate a product idea",
      },
      packagesTitle: "Ways to continue",
      packages: [
        { name: "Validation Sprint", description: "Resolve the riskiest assumptions and define the smallest useful release.", cadence: "1–2 weeks" },
        { name: "MVP Build", description: "Design, build, integrate, and launch a focused production release.", cadence: "Usually 8–16 weeks" },
        { name: "Product Evolution", description: "Improve adoption, journeys, and features using real usage evidence.", cadence: "Monthly or quarterly" },
      ],
      proof: {
        eyebrow: "Relevant live proof",
        title: "See production digital products",
        description: "Explore clearly labelled ROALLA products and client work, including guided platforms, operational tools, and customer experiences.",
        label: "View digital product examples",
        href: "/services/portfolio/digital-products",
        typeLabel: "Client work and ROALLA-owned products are identified on every project.",
      },
      measuresTitle: "How value can be measured",
      measures: ["Adoption and repeat use", "Task completion and customer effort", "Revenue or service uptake", "Time saved and error reduction"],
      faqTitle: "Digital product questions",
      faqs: [
        ["Do we need a full application?", "Not always. We first determine whether a website, configured platform, integration, or smaller workflow can achieve the outcome."],
        ["Can you start with a prototype?", "Yes. The Validation Sprint is designed to test the journey and scope before full development."],
        ["Who owns the product?", "Ownership, hosting, support, licences, and handoff expectations are documented in the proposal before work begins."],
      ],
      finalTitle: "Turn the idea into a decision-ready product plan.",
      finalBody: "Begin with a free fit review. We will recommend validation, a focused build, or a simpler option when that creates better value.",
      cta: "Discuss a digital product",
      metadataTitle: "Applications and Digital Products | ROALLA",
      metadataDescription:
        "Customer portals, operational platforms, workflow systems, and digital services designed to create revenue, customer value, and operational capability.",
    },
    automation: {
      eyebrow: "Automate",
      title: "Make information move without manual handoffs.",
      description:
        "ROALLA connects CRM, email, forms, documents, reporting, and internal systems to reduce duplicate entry, delays, and fragile workarounds.",
      outcome:
        "Automation is designed around ownership, exceptions, maintainability, and the operating result—not just the happy path.",
      capabilities: [
        [
          "Workflow Automation",
          "Triggers, approvals, routing, notifications, and handoffs.",
        ],
        [
          "System Integration",
          "Reliable movement of data between CRM, email, forms, databases, and internal tools.",
        ],
        [
          "Document and Reporting Automation",
          "Repeatable document generation, scheduled reporting, and structured exports.",
        ],
        [
          "AI-assisted Workflows",
          "Human-reviewed scoring, extraction, drafting, and guided decisions where AI adds practical value.",
        ],
      ],
      process: [
        [
          "Map",
          "Document the current workflow, delays, ownership, and exceptions.",
        ],
        [
          "Design",
          "Define the target flow, controls, fallback paths, and measurement.",
        ],
        ["Connect", "Build, test, document, and validate each integration."],
        [
          "Improve",
          "Monitor failures, adoption, time saved, and the next valuable automation.",
        ],
      ],
      deliverablesTitle: "What you receive",
      deliverables: [
        "A current-state workflow showing delays, ownership, systems, and exceptions",
        "A conservative time and cost baseline",
        "A target workflow with controls, failure paths, and human responsibilities",
        "Test evidence, documentation, and an improvement plan",
      ],
      starter: {
        eyebrow: "Low-risk starting point",
        name: "Automation Opportunity Sprint",
        description: "Map one recurring workflow, estimate its cost, and design the smallest practical automation pilot.",
        timeline: "Typical timeline: 1–2 weeks",
        investment: "Fixed scope and price confirmed after a free fit review",
        includes: [
          "Workflow and exception map",
          "Time, volume, and cost estimate",
          "Integration and data-risk review",
          "Pilot recommendation with success measures",
        ],
        fit: "Best for repetitive work, duplicate entry, slow handoffs, or reporting that consumes dependable staff time.",
        exclusion: "It does not assume every step should be automated or remove necessary human judgment.",
        cta: "Review one workflow",
      },
      packagesTitle: "Ways to continue",
      packages: [
        { name: "Opportunity Sprint", description: "Quantify one workflow and design a controlled pilot.", cadence: "1–2 weeks" },
        { name: "Automation Pilot", description: "Build and validate one complete automation with monitoring and recovery paths.", cadence: "Usually 2–6 weeks" },
        { name: "Managed Automation", description: "Monitor failures, maintain integrations, and improve the next valuable workflow.", cadence: "Monthly" },
      ],
      proof: {
        eyebrow: "Relevant live proof",
        title: "See connected workflows in production",
        description: "Explore platforms and event tools where guided workflows, integrations, and operational handoffs support real use.",
        label: "View workflow and platform examples",
        href: "/services/portfolio/digital-products",
        typeLabel: "Examples identify client work and ROALLA-owned products.",
      },
      measuresTitle: "How value can be measured",
      measures: ["Hours returned to the team", "Fewer errors and duplicate entries", "Faster cycle and response times", "Exception rate and recovery time"],
      faqTitle: "Automation questions",
      faqs: [
        ["What should we automate first?", "Start with frequent, stable work that has clear rules, measurable effort, and an owner for exceptions."],
        ["Will automation replace our team?", "The goal is to remove avoidable administration while keeping people responsible for judgment, relationships, and unusual cases."],
        ["Can you connect the tools we already use?", "Often, yes. We confirm API access, permissions, data quality, costs, and vendor limitations before promising an integration."],
      ],
      finalTitle: "Find the first workflow worth improving.",
      finalBody: "Use the free calculator for a planning estimate, then let ROALLA validate the process, risks, and practical next step.",
      cta: "Review an automation opportunity",
      metadataTitle: "Workflow Automation and Integration | ROALLA",
      metadataDescription:
        "Connect systems, automate workflows, reduce manual handoffs, and improve operational flow with maintainable integrations.",
    },
    "managed-optimization": {
      eyebrow: "Evolve",
      title: "Keep digital assets useful after launch.",
      description:
        "ROALLA supports websites and digital products through monitoring, analytics review, performance and visibility improvements, conversion work, product enhancement, and practical advisory.",
      outcome:
        "A launch becomes the beginning of measured improvement instead of the end of the engagement.",
      capabilities: [
        [
          "Website and Application Care",
          "Updates, issue resolution, technical review, and release support.",
        ],
        [
          "Performance and Visibility Monitoring",
          "Technical health, accessibility, discovery signals, analytics, and agreed baselines.",
        ],
        [
          "Conversion and Product Improvement",
          "Improve journeys, content, workflows, and features based on evidence.",
        ],
        [
          "Advisory and Training",
          "Fractional technology leadership, prioritization, governance, and team enablement.",
        ],
      ],
      process: [
        [
          "Baseline",
          "Agree on current performance, risks, and business priorities.",
        ],
        [
          "Prioritize",
          "Maintain a transparent improvement backlog tied to value.",
        ],
        ["Deliver", "Release focused improvements in a predictable cadence."],
        [
          "Review",
          "Measure outcomes, document learning, and reset priorities.",
        ],
      ],
      deliverablesTitle: "What you receive",
      deliverables: [
        "An agreed baseline and plain-language monthly scorecard",
        "A prioritized improvement backlog tied to business value",
        "A record of releases, findings, and decisions",
        "A regular review of results, risks, and next priorities",
      ],
      starter: {
        eyebrow: "Low-risk starting point",
        name: "Digital Baseline and Improvement Plan",
        description: "Establish what should be monitored, what requires attention now, and how future improvement will be measured.",
        timeline: "Typical timeline: 1–2 weeks",
        investment: "Fixed scope and price confirmed after a free fit review",
        includes: [
          "Website or product health baseline",
          "Measurement and monitoring plan",
          "Prioritized improvement backlog",
          "Recommended service level and review cadence",
        ],
        fit: "Best for organizations that already have a live website or product but lack dependable ownership and improvement rhythm.",
        exclusion: "Monitoring does not guarantee uninterrupted service, search rankings, traffic, or business results.",
        cta: "Establish my baseline",
      },
      packagesTitle: "Managed service levels",
      packages: [
        { name: "Monitor", description: "Health checks, agreed alerts, and a plain-language monthly summary.", cadence: "Monthly" },
        { name: "Improve", description: "Monitoring plus a defined amount of prioritized implementation work.", cadence: "Monthly" },
        { name: "Evolve", description: "Roadmap ownership, improvement delivery, advisory, and quarterly planning.", cadence: "Monthly with quarterly reviews" },
      ],
      proof: {
        eyebrow: "Transparent client value",
        title: "See what ongoing care produces",
        description: "The service records the baseline, completed work, current risks, and next recommended improvement so clients can see where their investment goes.",
        label: "Preview the monitoring workspace",
        href: "/tools/digital-monitoring-dashboard",
        typeLabel: "The public preview uses browser-only sample data. Client workspaces require an approved engagement and access model.",
      },
      measuresTitle: "How value can be measured",
      measures: ["Availability and unresolved issues", "Performance, accessibility, and visibility trends", "Conversion and journey changes", "Backlog progress and release outcomes"],
      faqTitle: "Managed optimization questions",
      faqs: [
        ["Is this hosting or maintenance?", "It can include care and technical support, but the service is broader: measurement, prioritization, conversion, visibility, product improvement, and advisory."],
        ["What is included each month?", "The proposal defines monitored assets, review cadence, response expectations, included delivery capacity, exclusions, and approval rules."],
        ["Can we cancel or change levels?", "Commercial terms, notice periods, rollover rules, and transition support are confirmed in writing before the service begins."],
      ],
      finalTitle: "Give your digital assets an accountable improvement rhythm.",
      finalBody: "Start with a baseline. ROALLA will recommend the monitoring and delivery level that fits the asset, risk, and pace of change.",
      cta: "Discuss managed optimization",
      metadataTitle: "Managed Digital Optimization | ROALLA",
      metadataDescription:
        "Ongoing website and application support, performance and visibility monitoring, conversion improvement, product enhancement, and advisory.",
    },
  },
  fr: {
    "digital-products": {
      eyebrow: "Construire",
      title:
        "Des produits numériques construits autour de la valeur que votre entreprise doit créer.",
      description:
        "Nous concevons des portails clients, plateformes opérationnelles, systèmes de flux et services numériques qui aident les organisations à générer des revenus, servir leurs clients et mieux fonctionner.",
      outcome:
        "Le résultat est une capacité d’affaires maintenable—pas une collection de fonctionnalités.",
      capabilities: [
        [
          "Créer des revenus",
          "Services payants, abonnements, transactions, réservation, achat et expertise productisée.",
        ],
        [
          "Améliorer la valeur client",
          "Portails, libre-service, rapports, intégration, information de compte et soutien.",
        ],
        [
          "Améliorer les opérations",
          "Tableaux de bord, outils terrain, approbations, conformité, consolidation et automatisation.",
        ],
        [
          "Permettre de nouveaux services",
          "Évaluations numériques, parcours guidés, livraison à distance, analytique client et formation.",
        ],
      ],
      process: [
        [
          "Découvrir la valeur",
          "Clarifier le résultat client, opérationnel ou financier avant de choisir les fonctionnalités.",
        ],
        [
          "Prototyper le parcours",
          "Valider rôles, flux, information et plus petite version utile.",
        ],
        [
          "Construire et intégrer",
          "Livrer par incréments avec sécurité, accessibilité et maintenabilité.",
        ],
        [
          "Lancer et évoluer",
          "Mesurer l’usage réel et améliorer le produit après le lancement.",
        ],
      ],
      deliverablesTitle: "Ce que vous recevez",
      deliverables: [
        "Un sommaire de valeur reliant le produit aux revenus, aux clients ou aux opérations",
        "Un parcours utilisateur validé avec rôles, information et priorités de lancement",
        "Des prototypes révisables et des jalons de production",
        "Une documentation de lancement, un plan de mesure et un carnet d’améliorations",
      ],
      starter: {
        eyebrow: "Point de départ à faible risque",
        name: "Sprint de validation de produit numérique",
        description: "Validez le problème, le parcours, la valeur et la plus petite version utile avant un développement complet.",
        timeline: "Délai habituel : 1 à 2 semaines",
        investment: "Portée et prix fixes confirmés après une revue gratuite",
        includes: ["Définition du résultat et des utilisateurs", "Prototype du parcours et du flux", "Revue des risques, dépendances et intégrations", "Recommandation prête à décider"],
        fit: "Pour les équipes ayant une idée de produit ou de portail qui exige encore des preuves et une portée claire.",
        exclusion: "N’inclut pas le développement complet ni des prévisions de revenus non vérifiées.",
        cta: "Valider une idée de produit",
      },
      packagesTitle: "Façons de poursuivre",
      packages: [
        { name: "Sprint de validation", description: "Résoudre les hypothèses les plus risquées et définir la plus petite version utile.", cadence: "1 à 2 semaines" },
        { name: "Développement MVP", description: "Concevoir, intégrer et lancer une version de production ciblée.", cadence: "Habituellement 8 à 16 semaines" },
        { name: "Évolution du produit", description: "Améliorer l’adoption, les parcours et les fonctions selon l’usage réel.", cadence: "Mensuel ou trimestriel" },
      ],
      proof: {
        eyebrow: "Preuves pertinentes en ligne",
        title: "Voir des produits numériques en production",
        description: "Explorez des produits ROALLA et des mandats clients clairement identifiés, y compris des plateformes guidées et des outils opérationnels.",
        label: "Voir les exemples de produits numériques",
        href: "/services/portfolio/digital-products",
        typeLabel: "Chaque projet identifie clairement le travail client et les produits appartenant à ROALLA.",
      },
      measuresTitle: "Comment mesurer la valeur",
      measures: ["Adoption et réutilisation", "Réalisation des tâches et effort client", "Revenus ou utilisation du service", "Temps économisé et erreurs réduites"],
      faqTitle: "Questions sur les produits numériques",
      faqs: [
        ["Avons-nous besoin d’une application complète?", "Pas toujours. Nous vérifions d’abord si un site, une plateforme configurée, une intégration ou un flux plus simple peut atteindre le résultat."],
        ["Pouvez-vous commencer par un prototype?", "Oui. Le sprint de validation sert à tester le parcours et la portée avant le développement complet."],
        ["À qui appartient le produit?", "La propriété, l’hébergement, le soutien, les licences et le transfert sont précisés dans la proposition."],
      ],
      finalTitle: "Transformez l’idée en plan de produit prêt à décider.",
      finalBody: "Commencez par une revue gratuite. Nous recommanderons une validation, un développement ciblé ou une solution plus simple si elle crée plus de valeur.",
      cta: "Discuter d’un produit numérique",
      metadataTitle: "Applications et produits numériques | ROALLA",
      metadataDescription:
        "Portails clients, plateformes opérationnelles, systèmes de flux et services numériques conçus pour créer revenus, valeur client et capacité opérationnelle.",
    },
    automation: {
      eyebrow: "Automatiser",
      title: "Faites circuler l’information sans transferts manuels.",
      description:
        "ROALLA relie CRM, courriel, formulaires, documents, rapports et systèmes internes pour réduire la double saisie, les délais et les contournements fragiles.",
      outcome:
        "L’automatisation est conçue autour des responsabilités, exceptions, maintenance et résultats opérationnels—pas seulement du scénario idéal.",
      capabilities: [
        [
          "Automatisation des flux",
          "Déclencheurs, approbations, routage, notifications et transferts.",
        ],
        [
          "Intégration de systèmes",
          "Circulation fiable des données entre CRM, courriel, formulaires, bases et outils internes.",
        ],
        [
          "Automatisation documentaire et rapports",
          "Génération répétable, rapports planifiés et exports structurés.",
        ],
        [
          "Flux assistés par IA",
          "Notation, extraction, rédaction et décisions guidées avec révision humaine.",
        ],
      ],
      process: [
        [
          "Cartographier",
          "Documenter le flux actuel, les délais, responsabilités et exceptions.",
        ],
        [
          "Concevoir",
          "Définir le flux cible, les contrôles, solutions de repli et mesures.",
        ],
        [
          "Connecter",
          "Construire, tester, documenter et valider chaque intégration.",
        ],
        [
          "Améliorer",
          "Suivre les erreurs, l’adoption, le temps gagné et la prochaine automatisation utile.",
        ],
      ],
      deliverablesTitle: "Ce que vous recevez",
      deliverables: [
        "Un flux actuel montrant délais, responsabilités, systèmes et exceptions",
        "Une référence prudente du temps et des coûts",
        "Un flux cible avec contrôles, échecs et responsabilités humaines",
        "Des preuves de test, une documentation et un plan d’amélioration",
      ],
      starter: {
        eyebrow: "Point de départ à faible risque",
        name: "Sprint d’occasion d’automatisation",
        description: "Cartographiez un flux récurrent, estimez son coût et concevez le plus petit pilote pratique.",
        timeline: "Délai habituel : 1 à 2 semaines",
        investment: "Portée et prix fixes confirmés après une revue gratuite",
        includes: ["Carte du flux et des exceptions", "Estimation du temps, du volume et du coût", "Revue des intégrations et des risques de données", "Recommandation de pilote et mesures de succès"],
        fit: "Pour le travail répétitif, la double saisie, les transferts lents ou les rapports qui consomment du temps prévisible.",
        exclusion: "Ne suppose pas que toutes les étapes doivent être automatisées ni que le jugement humain doit disparaître.",
        cta: "Examiner un flux",
      },
      packagesTitle: "Façons de poursuivre",
      packages: [
        { name: "Sprint d’occasion", description: "Quantifier un flux et concevoir un pilote contrôlé.", cadence: "1 à 2 semaines" },
        { name: "Pilote d’automatisation", description: "Construire et valider une automatisation complète avec suivi et reprise.", cadence: "Habituellement 2 à 6 semaines" },
        { name: "Automatisation gérée", description: "Surveiller les échecs, maintenir les intégrations et améliorer le prochain flux utile.", cadence: "Mensuel" },
      ],
      proof: {
        eyebrow: "Preuves pertinentes en ligne",
        title: "Voir des flux connectés en production",
        description: "Explorez des plateformes et outils où des flux guidés et des intégrations soutiennent un usage réel.",
        label: "Voir les exemples de flux et plateformes",
        href: "/services/portfolio/digital-products",
        typeLabel: "Les exemples distinguent les mandats clients des produits ROALLA.",
      },
      measuresTitle: "Comment mesurer la valeur",
      measures: ["Heures rendues à l’équipe", "Erreurs et double saisie réduites", "Cycles et réponses plus rapides", "Taux d’exception et temps de reprise"],
      faqTitle: "Questions sur l’automatisation",
      faqs: [
        ["Que devrions-nous automatiser en premier?", "Commencez par un travail fréquent et stable avec des règles claires, un effort mesurable et une personne responsable des exceptions."],
        ["L’automatisation remplacera-t-elle notre équipe?", "Le but est de retirer l’administration évitable tout en gardant les personnes responsables du jugement, des relations et des cas inhabituels."],
        ["Pouvez-vous relier nos outils actuels?", "Souvent oui. Nous confirmons les API, permissions, données, coûts et limites avant de promettre une intégration."],
      ],
      finalTitle: "Trouvez le premier flux qui mérite une amélioration.",
      finalBody: "Utilisez le calculateur gratuit, puis laissez ROALLA valider le processus, les risques et la prochaine étape pratique.",
      cta: "Examiner une possibilité d’automatisation",
      metadataTitle: "Automatisation des flux et intégration | ROALLA",
      metadataDescription:
        "Reliez vos systèmes, automatisez les flux, réduisez les transferts manuels et améliorez les opérations avec des intégrations maintenables.",
    },
    "managed-optimization": {
      eyebrow: "Évoluer",
      title: "Gardez vos actifs numériques utiles après le lancement.",
      description:
        "ROALLA soutient sites Web et produits numériques par le suivi, l’analyse, la performance, la visibilité, la conversion, l’évolution produit et le conseil pratique.",
      outcome:
        "Le lancement devient le début d’une amélioration mesurée plutôt que la fin du mandat.",
      capabilities: [
        [
          "Entretien des sites et applications",
          "Mises à jour, résolution de problèmes, revue technique et soutien aux versions.",
        ],
        [
          "Suivi de performance et visibilité",
          "Santé technique, accessibilité, découverte, analytique et références convenues.",
        ],
        [
          "Amélioration de conversion et produit",
          "Améliorer parcours, contenu, flux et fonctionnalités selon les preuves.",
        ],
        [
          "Conseil et formation",
          "Leadership technologique fractionnel, priorisation, gouvernance et développement d’équipe.",
        ],
      ],
      process: [
        [
          "Établir une référence",
          "Convenir de la performance actuelle, des risques et priorités.",
        ],
        [
          "Prioriser",
          "Maintenir un carnet transparent d’améliorations liées à la valeur.",
        ],
        [
          "Livrer",
          "Publier des améliorations ciblées selon une cadence prévisible.",
        ],
        [
          "Réviser",
          "Mesurer les résultats, documenter les apprentissages et réviser les priorités.",
        ],
      ],
      deliverablesTitle: "Ce que vous recevez",
      deliverables: [
        "Une référence convenue et un tableau mensuel en langage simple",
        "Un carnet d’améliorations priorisé selon la valeur",
        "Un registre des versions, constats et décisions",
        "Une revue régulière des résultats, risques et prochaines priorités",
      ],
      starter: {
        eyebrow: "Point de départ à faible risque",
        name: "Référence numérique et plan d’amélioration",
        description: "Établissez ce qui doit être surveillé, ce qui exige une action immédiate et comment mesurer l’amélioration.",
        timeline: "Délai habituel : 1 à 2 semaines",
        investment: "Portée et prix fixes confirmés après une revue gratuite",
        includes: ["Référence de santé du site ou produit", "Plan de mesure et de suivi", "Carnet d’améliorations priorisé", "Niveau de service et cadence recommandés"],
        fit: "Pour les organisations ayant déjà un site ou produit actif, sans responsabilité ni rythme d’amélioration fiable.",
        exclusion: "Le suivi ne garantit pas un service ininterrompu, un classement, du trafic ni des résultats commerciaux.",
        cta: "Établir ma référence",
      },
      packagesTitle: "Niveaux de service géré",
      packages: [
        { name: "Surveiller", description: "Contrôles de santé, alertes convenues et sommaire mensuel clair.", cadence: "Mensuel" },
        { name: "Améliorer", description: "Suivi avec une capacité définie de mise en œuvre prioritaire.", cadence: "Mensuel" },
        { name: "Évoluer", description: "Responsabilité de la feuille de route, livraison, conseil et planification trimestrielle.", cadence: "Mensuel avec revues trimestrielles" },
      ],
      proof: {
        eyebrow: "Valeur client transparente",
        title: "Voyez ce que produit le soutien continu",
        description: "Le service consigne la référence, le travail terminé, les risques actuels et la prochaine amélioration recommandée.",
        label: "Prévisualiser l’espace de suivi",
        href: "/tools/digital-monitoring-dashboard",
        typeLabel: "La prévisualisation publique utilise des données d’exemple dans le navigateur. Les espaces clients exigent un mandat et un modèle d’accès approuvés.",
      },
      measuresTitle: "Comment mesurer la valeur",
      measures: ["Disponibilité et problèmes ouverts", "Tendances de performance, accessibilité et visibilité", "Changements de conversion et de parcours", "Progression du carnet et résultats des versions"],
      faqTitle: "Questions sur l’optimisation gérée",
      faqs: [
        ["Est-ce de l’hébergement ou de la maintenance?", "Cela peut inclure les soins techniques, mais couvre aussi la mesure, les priorités, la conversion, la visibilité, l’évolution produit et le conseil."],
        ["Qu’est-ce qui est inclus chaque mois?", "La proposition précise les actifs suivis, la cadence, les délais, la capacité incluse, les exclusions et les règles d’approbation."],
        ["Pouvons-nous changer de niveau?", "Les modalités, avis, reports et soutien de transition sont confirmés par écrit avant le début."],
      ],
      finalTitle: "Donnez à vos actifs numériques un rythme d’amélioration responsable.",
      finalBody: "Commencez par une référence. ROALLA recommandera le niveau de suivi et de livraison adapté à l’actif, au risque et au rythme de changement.",
      cta: "Discuter d’optimisation gérée",
      metadataTitle: "Optimisation numérique gérée | ROALLA",
      metadataDescription:
        "Soutien continu des sites et applications, suivi de performance et visibilité, conversion, évolution produit et conseil.",
    },
  },
};
