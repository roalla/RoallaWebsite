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
      cta: "Discuter d’optimisation gérée",
      metadataTitle: "Optimisation numérique gérée | ROALLA",
      metadataDescription:
        "Soutien continu des sites et applications, suivi de performance et visibilité, conversion, évolution produit et conseil.",
    },
  },
};
