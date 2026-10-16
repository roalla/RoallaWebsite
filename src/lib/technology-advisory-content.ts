export type AdvisorNeedId = "growth" | "cost" | "risk" | "experience";

type AdvisorNeed = {
  id: AdvisorNeedId;
  label: string;
  title: string;
  body: string;
  questions: string[];
  output: string;
};

type TechnologyCategory = {
  id: string;
  label: string;
  outcome: string;
  questions: string[];
  compare: string[];
  output: string;
};

export type TechnologyAdvisoryCopy = {
  hero: { eyebrow: string; title: string; body: string; proof: string; lensTitle: string; questions: string[]; primary: string };
  journeys: {
    eyebrow: string; title: string; body: string;
    advisorTitle: string; advisorBody: string; advisorPrompt: string;
    leadershipQuestions: string; decisionOutput: string; restart: string;
    reviewCta: string; briefCta: string;
    readyTitle: string; readyBody: string; categoryPrompt: string;
    compareLabel: string; compareCta: string; inquiryCta: string;
    advisorNeeds: AdvisorNeed[]; categories: TechnologyCategory[];
  };
  leadership: { eyebrow: string; title: string; body: string; items: Array<{ title: string; body: string }> };
  credibility: { eyebrow: string; title: string; body: string; principles: Array<{ title: string; body: string }> };
  process: { eyebrow: string; title: string; body: string; steps: Array<{ title: string; body: string }> };
  details: { eyebrow: string; title: string; body: string; scope: string; delivery: string; disclosure: string };
  finalCta: { eyebrow: string; title: string; body: string; primary: string; secondary: string };
};

const en: TechnologyAdvisoryCopy = {
  hero: {
    eyebrow: "Technology advisory & solution sourcing",
    title: "Turn a technology decision into a business advantage.",
    body: "ROALLA helps leaders cut through vendor noise, expose the real tradeoffs, and move from business case to implementation with confidence.",
    proof: "Needs-led advice · 400+ supplier network · Delivery support",
    lensTitle: "Before you buy, know",
    questions: ["What creates value", "What introduces risk", "What it takes to deliver"],
    primary: "Find my smartest next move",
  },
  journeys: {
    eyebrow: "Your fastest path to clarity",
    title: "One choice. A smarter next move.",
    body: "Start with the business pressure or jump directly to the technology domain.",
    advisorTitle: "I need direction",
    advisorBody: "Choose what is creating pressure. We will show you where to focus first.",
    advisorPrompt: "What is driving the decision?",
    leadershipQuestions: "Leadership questions to resolve",
    decisionOutput: "What ROALLA prepares",
    restart: "Choose a different priority",
    reviewCta: "Talk it through with ROALLA",
    briefCta: "Build a free decision brief",
    readyTitle: "I know the domain",
    readyBody: "See the technical, operational, and commercial factors we evaluate before you commit.",
    categoryPrompt: "Select a technology domain",
    compareLabel: "We compare",
    compareCta: "Build a comparison brief",
    inquiryCta: "Discuss",
    advisorNeeds: [
      {
        id: "growth",
        label: "Scale for growth",
        title: "Align the technology investment with the next stage of growth",
        body: "Start with the capability, capacity, and timing the organization needs—then determine whether to buy, build, connect, consolidate, or improve.",
        questions: ["Which constraint is limiting growth today?", "What must scale without adding equal cost or complexity?", "What measurable result would justify the investment?"],
        output: "An executive decision brief, target capabilities, investment criteria, and a practical path to shortlist or implementation.",
      },
      {
        id: "cost",
        label: "Reduce cost and sprawl",
        title: "Turn fragmented spend into a deliberate operating model",
        body: "Separate avoidable cost from necessary capability, expose contract and integration dependencies, and compare consolidation or replacement on total business value.",
        questions: ["Where are licences, suppliers, or capabilities duplicated?", "Which costs are contractual, operational, or hidden in manual work?", "What can change without creating unacceptable transition risk?"],
        output: "A current-state cost and dependency view, consolidation scenarios, normalized commercial comparison, and transition priorities.",
      },
      {
        id: "risk",
        label: "Strengthen risk and resilience",
        title: "Prioritize the exposures that matter to the business",
        body: "Connect technology controls to business consequence, recovery expectations, regulatory obligations, and the operating capacity your team can realistically sustain.",
        questions: ["Which services and data cannot tolerate disruption?", "Who owns detection, response, recovery, and evidence?", "Which gaps create the greatest business consequence now?"],
        output: "A risk-focused requirements brief, priority controls, qualified options, ownership model, and sequenced resilience roadmap.",
      },
      {
        id: "experience",
        label: "Improve customer or employee experience",
        title: "Fix the workflow, not just the interface",
        body: "Trace friction across people, process, data, integrations, and service ownership before adding another platform to the environment.",
        questions: ["Where do customers or employees lose time, context, or confidence?", "Which handoffs and systems create the friction?", "How will adoption and service performance be measured?"],
        output: "A journey and workflow view, target experience, capability gaps, integration requirements, and adoption measures.",
      },
    ],
    categories: [
      {
        id: "cloud-infrastructure", label: "Cloud & infrastructure",
        outcome: "Choose the right operating foundation for each workload—not simply more cloud. We assess placement, architecture, managed services, resilience, governance, and exit flexibility together.",
        questions: ["Which workloads benefit from cloud, colocation, on-premises, or a hybrid model?", "Who will operate, secure, optimize, and recover the environment after migration?"],
        compare: ["workload placement", "architecture", "resilience & DR", "security & identity", "FinOps / total cost", "support & exit"],
        output: "A workload and dependency view, target architecture, migration waves, provider comparison, operating model, and cost baseline.",
      },
      {
        id: "cybersecurity-continuity", label: "Cybersecurity & continuity",
        outcome: "Build a defensible security and continuity program around material risk, not a disconnected tool list. We connect prevention, detection, response, recovery, and evidence.",
        questions: ["Which threats and business services drive the control priorities?", "What must be owned internally, co-managed, or delivered as a managed service?"],
        compare: ["control coverage", "SOC / MDR operations", "identity & access", "incident response", "backup & recovery", "compliance evidence"],
        output: "A risk and control brief, coverage gaps, service model, qualified solution comparison, response ownership, and recovery roadmap.",
      },
      {
        id: "communications-contact-centre", label: "Communications & contact centre",
        outcome: "Connect voice, messaging, routing, workforce, and customer context into a reliable service experience. We evaluate the operating workflow as closely as the platform.",
        questions: ["How should conversations move across channels, queues, teams, and systems?", "Which integrations, reporting, recording, and resilience requirements are non-negotiable?"],
        compare: ["UCaaS / CCaaS fit", "call & channel flows", "CRM integrations", "AI & automation", "quality & analytics", "carrier terms"],
        output: "A channel and call-flow design, integration requirements, platform shortlist, carrier and licensing comparison, and migration plan.",
      },
      {
        id: "workplace-collaboration", label: "Workplace & collaboration",
        outcome: "Create a secure, governable workplace that people can actually adopt. We align productivity, information access, endpoint experience, identity, administration, and change.",
        questions: ["Which work patterns and information flows need to improve?", "How will access, retention, device management, support, and adoption be governed?"],
        compare: ["Microsoft 365 / Google fit", "identity & endpoints", "information governance", "interoperability", "licensing", "adoption & support"],
        output: "A workplace requirements brief, licence and platform assessment, governance model, migration approach, and adoption roadmap.",
      },
      {
        id: "network-connectivity", label: "Networking & connectivity",
        outcome: "Design connectivity around application performance, site criticality, security, and recovery—not bandwidth alone. We compare architecture and carriers on service accountability.",
        questions: ["Which sites, applications, and users require what level of performance and failover?", "How will internet, SD-WAN, LAN/Wi-Fi, SASE, and carrier support work together?"],
        compare: ["carrier coverage", "SD-WAN / SASE", "LAN & Wi-Fi", "performance", "failover", "SLAs & support"],
        output: "A site and application requirements map, target network design, carrier comparison, resilience model, and rollout plan.",
      },
      {
        id: "mobility-iot", label: "Mobility & IoT",
        outcome: "Connect people, vehicles, assets, and devices with the coverage, control, security, and economics required for field operations at scale.",
        questions: ["What must be visible, controlled, or automated in the field?", "How will devices, connectivity, data, security, and lifecycle support be managed?"],
        compare: ["coverage & carriers", "device lifecycle", "MDM / management", "IoT connectivity", "security", "usage economics"],
        output: "A use-case and coverage brief, device and connectivity requirements, supplier comparison, security model, and deployment plan.",
      },
    ],
  },
  leadership: {
    eyebrow: "An executive-ready decision package",
    title: "Enough detail to decide. Enough structure to deliver.",
    body: "The work is designed to move from leadership intent to accountable implementation without losing the reasoning in between.",
    items: [
      { title: "Decision brief", body: "Business outcome, current constraints, stakeholders, requirements, risks, decision criteria, and measures of value." },
      { title: "Comparable options", body: "A qualified shortlist with normalized scope, economics, commercial terms, support, tradeoffs, and implementation effort." },
      { title: "Implementation roadmap", body: "Ownership, sequence, dependencies, migration, integration, change, adoption, and measures of realized value." },
    ],
  },
  credibility: {
    eyebrow: "Independent advice · Broader supplier access",
    title: "A decision partner—not another product pitch.",
    body: "ROALLA is a Telarus Technology Advisor through a non-exclusive relationship, expanding access to more than 400 suppliers, sales engineers, and domain specialists. That network strengthens market coverage; it does not replace a needs-led evaluation.",
    principles: [
      { title: "Needs-led", body: "The business outcome, constraints, risks, and operating reality define the shortlist." },
      { title: "Evidence-based", body: "Options are assessed on the same fit, cost, terms, support, risk, and delivery criteria." },
      { title: "Disclosed", body: "Any material commercial relationship affecting a recommendation is disclosed before you commit." },
    ],
  },
  process: {
    eyebrow: "How ROALLA moves the decision forward",
    title: "Clarity, market reach, and follow-through.",
    body: "One accountable path from the first question to realized value.",
    steps: [
      { title: "Frame", body: "Turn the business pressure into outcomes, requirements, risks, economics, and decision criteria." },
      { title: "Source", body: "Reach the market, qualify providers, and make technical and commercial tradeoffs comparable." },
      { title: "Deliver", body: "Carry the choice through negotiation, migration, integration, adoption, and measurable value." },
    ],
  },
  details: {
    eyebrow: "Go deeper without starting in the weeds",
    title: "The practical evidence behind the recommendation",
    body: "Detailed scope, capabilities, evaluation methods, delivery support, and supplier disclosures remain available when your team needs them.",
    scope: "Scope, technology capabilities, and decision deliverables",
    delivery: "Evaluation, implementation, and adoption",
    disclosure: "Supplier access, independence, and compensation",
  },
  finalCta: {
    eyebrow: "Technology advisory",
    title: "Make the next technology move with confidence.",
    body: "Bring the pressure, the opportunity, or the shortlist. In one focused conversation, we will identify the smartest next step.",
    primary: "Book an executive technology review",
    secondary: "Build a free decision brief",
  },
};

const fr: TechnologyAdvisoryCopy = {
  ...en,
  hero: {
    eyebrow: "Conseil technologique et recherche de solutions",
    title: "Transformez une décision technologique en avantage d’affaires.",
    body: "ROALLA aide les dirigeants à dépasser le bruit des fournisseurs, voir les vrais compromis et passer de l’analyse de rentabilité à la mise en œuvre avec confiance.",
    proof: "Conseil fondé sur les besoins · Réseau de 400+ fournisseurs · Soutien à la livraison",
    lensTitle: "Avant d’acheter, sachez",
    questions: ["Ce qui crée la valeur", "Ce qui introduit le risque", "Ce qu’exige la livraison"],
    primary: "Trouver ma meilleure prochaine étape",
  },
  journeys: {
    ...en.journeys,
    eyebrow: "Votre chemin le plus rapide vers la clarté",
    title: "Un choix. Une prochaine étape plus intelligente.",
    body: "Partez de la pression d’affaires ou allez directement au domaine technologique.",
    advisorTitle: "J’ai besoin d’orientation",
    advisorBody: "Choisissez ce qui crée la pression. Nous vous montrerons où concentrer l’effort d’abord.",
    advisorPrompt: "Qu’est-ce qui motive la décision?",
    leadershipQuestions: "Questions de direction à résoudre",
    decisionOutput: "Ce que ROALLA prépare",
    restart: "Choisir une autre priorité",
    reviewCta: "En parler avec ROALLA",
    briefCta: "Créer une fiche de décision gratuite",
    readyTitle: "Je connais le domaine",
    readyBody: "Voyez les facteurs techniques, opérationnels et commerciaux que nous évaluons avant l’engagement.",
    categoryPrompt: "Sélectionnez un domaine technologique",
    compareLabel: "Nous comparons",
    compareCta: "Créer une fiche de comparaison",
    inquiryCta: "Discuter de",
    advisorNeeds: [
      { id: "growth", label: "Évoluer pour la croissance", title: "Aligner l’investissement technologique sur la prochaine étape de croissance", body: "Commencez par la capacité et le calendrier requis, puis déterminez s’il faut acheter, bâtir, connecter, regrouper ou améliorer.", questions: ["Quelle contrainte limite la croissance aujourd’hui?", "Qu’est-ce qui doit évoluer sans ajouter autant de coûts ou de complexité?", "Quel résultat mesurable justifierait l’investissement?"], output: "Une fiche de décision, les capacités cibles, les critères d’investissement et un chemin pratique vers la sélection ou la mise en œuvre." },
      { id: "cost", label: "Réduire les coûts et la dispersion", title: "Transformer des dépenses fragmentées en modèle d’exploitation délibéré", body: "Distinguez le coût évitable de la capacité nécessaire, exposez les dépendances et comparez le regroupement ou le remplacement selon la valeur totale.", questions: ["Où les licences, fournisseurs ou capacités se chevauchent-ils?", "Quels coûts sont contractuels, opérationnels ou cachés dans le travail manuel?", "Que peut-on changer sans risque de transition inacceptable?"], output: "Une vue des coûts et dépendances, des scénarios de regroupement, une comparaison commerciale normalisée et les priorités de transition." },
      { id: "risk", label: "Renforcer le risque et la résilience", title: "Prioriser les expositions importantes pour l’entreprise", body: "Reliez les contrôles aux conséquences d’affaires, aux attentes de reprise, aux obligations et à la capacité réelle de l’équipe.", questions: ["Quels services et quelles données ne peuvent tolérer une interruption?", "Qui possède la détection, l’intervention, la reprise et les preuves?", "Quels écarts créent les plus grandes conséquences maintenant?"], output: "Une fiche d’exigences axée sur le risque, des contrôles prioritaires, des options qualifiées, un modèle de responsabilité et une feuille de route." },
      { id: "experience", label: "Améliorer l’expérience client ou employé", title: "Corriger le flux de travail, pas seulement l’interface", body: "Suivez la friction entre personnes, processus, données, intégrations et responsabilité du service avant d’ajouter une autre plateforme.", questions: ["Où les clients ou employés perdent-ils temps, contexte ou confiance?", "Quels transferts et systèmes créent la friction?", "Comment mesurerons-nous l’adoption et la performance?"], output: "Une vue du parcours, l’expérience cible, les écarts de capacité, les exigences d’intégration et les mesures d’adoption." },
    ],
    categories: [
      { id: "cloud-infrastructure", label: "Infonuagique et infrastructure", outcome: "Choisissez la bonne fondation pour chaque charge—pas simplement plus de nuage. Nous évaluons placement, architecture, services gérés, résilience, gouvernance et sortie ensemble.", questions: ["Quelles charges conviennent au nuage, à la colocation, au site ou à un modèle hybride?", "Qui exploitera, sécurisera, optimisera et rétablira l’environnement après la migration?"], compare: ["placement des charges", "architecture", "résilience et relève", "sécurité et identité", "FinOps / coût total", "soutien et sortie"], output: "Une vue des charges et dépendances, l’architecture cible, les vagues de migration, la comparaison des fournisseurs et le coût de référence." },
      { id: "cybersecurity-continuity", label: "Cybersécurité et continuité", outcome: "Bâtissez un programme défendable autour du risque matériel, et non une liste d’outils. Nous relions prévention, détection, intervention, reprise et preuves.", questions: ["Quelles menaces et quels services guident les priorités de contrôle?", "Qu’est-ce qui doit être interne, cogéré ou livré comme service géré?"], compare: ["couverture des contrôles", "SOC / MDR", "identité et accès", "intervention", "sauvegarde et reprise", "preuves de conformité"], output: "Une fiche risques-contrôles, les écarts, le modèle de service, la comparaison des solutions, la responsabilité et la feuille de route." },
      { id: "communications-contact-centre", label: "Communications et centre de contact", outcome: "Reliez voix, messagerie, routage, effectifs et contexte client dans une expérience fiable. Nous évaluons le flux d’exploitation autant que la plateforme.", questions: ["Comment les conversations doivent-elles circuler entre canaux, files, équipes et systèmes?", "Quelles intégrations, analyses, fonctions d’enregistrement et de résilience sont non négociables?"], compare: ["UCaaS / CCaaS", "flux d’appels et canaux", "intégrations CRM", "IA et automatisation", "qualité et analytique", "conditions opérateur"], output: "Une conception des canaux et flux, les exigences d’intégration, une liste de plateformes, une comparaison des licences et un plan de migration." },
      { id: "workplace-collaboration", label: "Milieu de travail et collaboration", outcome: "Créez un milieu sécurisé, gouvernable et réellement adopté. Nous alignons productivité, accès à l’information, appareils, identité, administration et changement.", questions: ["Quels modes de travail et flux d’information doivent s’améliorer?", "Comment gouverner l’accès, la conservation, les appareils, le soutien et l’adoption?"], compare: ["Microsoft 365 / Google", "identité et appareils", "gouvernance de l’information", "interopérabilité", "licences", "adoption et soutien"], output: "Une fiche d’exigences, une évaluation des licences et plateformes, un modèle de gouvernance, une approche de migration et une feuille d’adoption." },
      { id: "network-connectivity", label: "Réseau et connectivité", outcome: "Concevez la connectivité selon les applications, la criticité des sites, la sécurité et la reprise—pas seulement la bande passante.", questions: ["Quels sites, applications et utilisateurs exigent quel rendement et quelle relève?", "Comment Internet, SD-WAN, LAN/Wi-Fi, SASE et soutien opérateur fonctionneront-ils ensemble?"], compare: ["couverture opérateur", "SD-WAN / SASE", "LAN et Wi-Fi", "performance", "relève", "SLA et soutien"], output: "Une carte des exigences sites-applications, la conception cible, une comparaison des opérateurs, le modèle de résilience et le déploiement." },
      { id: "mobility-iot", label: "Mobilité et IdO", outcome: "Connectez personnes, véhicules, actifs et appareils avec la couverture, le contrôle, la sécurité et l’économie nécessaires aux opérations terrain.", questions: ["Qu’est-ce qui doit être visible, contrôlé ou automatisé sur le terrain?", "Comment gérer appareils, connectivité, données, sécurité et cycle de vie?"], compare: ["couverture et opérateurs", "cycle de vie des appareils", "MDM / gestion", "connectivité IdO", "sécurité", "économie d’usage"], output: "Une fiche de cas d’usage et couverture, les exigences, une comparaison des fournisseurs, le modèle de sécurité et le plan de déploiement." },
    ],
  },
  leadership: {
    eyebrow: "Un dossier de décision prêt pour la direction", title: "Assez de détails pour décider. Assez de structure pour livrer.",
    body: "Le travail passe de l’intention de la direction à une mise en œuvre responsable sans perdre le raisonnement en chemin.",
    items: [
      { title: "Fiche de décision", body: "Résultat d’affaires, contraintes, parties prenantes, exigences, risques, critères et mesures de valeur." },
      { title: "Options comparables", body: "Une liste qualifiée avec portée, économie, conditions, soutien, compromis et effort de mise en œuvre normalisés." },
      { title: "Feuille de route", body: "Responsabilité, séquence, dépendances, migration, intégration, changement, adoption et valeur réalisée." },
    ],
  },
  credibility: {
    eyebrow: "Conseil indépendant · Accès élargi aux fournisseurs", title: "Vos exigences guident le choix. Les relations fournisseurs restent visibles.",
    body: "ROALLA est conseiller technologique Telarus dans le cadre d’une relation non exclusive, donnant accès à plus de 400 fournisseurs, ingénieurs des ventes et spécialistes. Ce réseau renforce la couverture du marché; il ne remplace pas une évaluation fondée sur les besoins.",
    principles: [
      { title: "Besoins d’abord", body: "Le résultat, les contraintes, les risques et la réalité d’exploitation définissent la liste." },
      { title: "Fondé sur les faits", body: "Les options suivent les mêmes critères d’adéquation, coût, conditions, soutien, risque et livraison." },
      { title: "Divulgué", body: "Toute relation commerciale importante influant sur une recommandation est divulguée avant l’engagement." },
    ],
  },
  process: {
    eyebrow: "Comment ROALLA fait avancer la décision", title: "Clarté, portée du marché et suivi.", body: "Un chemin responsable de la première question à la valeur réalisée.",
    steps: [
      { title: "Cadrer", body: "Transformer la pression d’affaires en résultats, exigences, risques, économie et critères de décision." },
      { title: "Rechercher", body: "Atteindre le marché, qualifier les fournisseurs et comparer les compromis techniques et commerciaux." },
      { title: "Livrer", body: "Mener le choix à travers négociation, migration, intégration, adoption et valeur mesurable." },
    ],
  },
  details: {
    eyebrow: "Approfondissez sans commencer dans les détails", title: "Les preuves pratiques derrière la recommandation", body: "La portée, les capacités, l’évaluation, le soutien à la livraison et les divulgations restent accessibles au besoin.",
    scope: "Portée, capacités technologiques et livrables de décision", delivery: "Évaluation, mise en œuvre et adoption", disclosure: "Accès aux fournisseurs, indépendance et rémunération",
  },
  finalCta: {
    eyebrow: "Conseil technologique", title: "Faites le prochain choix technologique avec confiance.",
    body: "Apportez la pression, l’occasion ou la liste. En une conversation ciblée, nous trouverons la prochaine étape la plus intelligente.",
    primary: "Réserver une revue technologique de direction", secondary: "Créer une fiche de décision gratuite",
  },
};

export function getTechnologyAdvisoryCopy(locale: string): TechnologyAdvisoryCopy {
  return locale === "fr" ? fr : en;
}
