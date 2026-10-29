import type { ServiceLandingCopy } from "@/lib/service-landing-types";

export const securityServiceContent: Record<"en" | "fr", ServiceLandingCopy> = {
  en: {
    eyebrow: "Secure",
    title: "Reduce risk, strengthen security, and support compliance.",
    description:
      "ROALLA helps leaders understand material security gaps, prioritize remediation, clarify control ownership, and evaluate qualified security and managed-service options around the organization’s real obligations and risk tolerance.",
    outcome:
      "The result is a practical risk-reduction path with accountable owners—not another unprioritized list of tools or controls.",
    capabilities: [
      [
        "Security Posture and Gap Review",
        "Review the current environment, material risks, responsibilities, evidence, and the controls that need attention first.",
      ],
      [
        "Compliance Readiness Support",
        "Structure policies, control ownership, evidence, and remediation planning for customer requirements or frameworks such as SOC 2.",
      ],
      [
        "Managed Security Solution Sourcing",
        "Define requirements and compare qualified MDR, managed security, identity, cloud, network, backup, and recovery options.",
      ],
      [
        "Continuity and Incident Readiness",
        "Clarify essential services, recovery expectations, response responsibilities, dependencies, and practical exercises.",
      ],
    ],
    process: [
      ["Clarify", "Confirm the business obligations, sensitive assets, current controls, accountable owners, and risk tolerance."],
      ["Assess", "Identify material gaps and distinguish urgent remediation from longer-term maturity work."],
      ["Prioritize", "Sequence controls, owners, evidence, service options, costs, and dependencies into a practical roadmap."],
      ["Activate", "Support remediation, sourcing, implementation, adoption, and a repeatable review rhythm."],
    ],
    deliverablesTitle: "What you receive",
    deliverables: [
      "A plain-language view of material risks, current controls, evidence, and ownership gaps",
      "A prioritized remediation roadmap tied to business impact, urgency, effort, and dependencies",
      "Requirements and comparison criteria for qualified security or managed-service options when sourcing is needed",
      "An implementation and review plan with owners, milestones, measures, and escalation points",
    ],
    starter: {
      eyebrow: "Low-risk starting point",
      name: "Security and Compliance Readiness Review",
      description:
        "Establish the current state, most important obligations, material gaps, and the smallest useful remediation step before committing to a broad program or security stack.",
      timeline: "Typical timeline: 1–2 weeks",
      investment: "Fixed scope and price confirmed after a free fit review",
      includes: [
        "Business, data, system, and obligation context",
        "Control, ownership, evidence, and dependency review",
        "Prioritized risk and remediation findings",
        "Recommended next step, service path, and success measures",
      ],
      fit: "Best for organizations facing customer questionnaires, SOC 2 preparation, unclear security ownership, recurring risk concerns, or a managed-security decision.",
      exclusion:
        "This is not legal advice, a penetration test, a formal audit, certification, or an independent SOC 2 examination. Specialist or licensed work is scoped separately with qualified providers.",
      cta: "Review our security readiness",
    },
    packagesTitle: "Ways to continue",
    packages: [
      { name: "Readiness Review", description: "Clarify obligations, material gaps, owners, evidence, and the first remediation priorities.", cadence: "1–2 weeks" },
      { name: "Remediation and Sourcing", description: "Support control improvements and compare qualified security or managed-service options against the same requirements.", cadence: "Phased engagement" },
      { name: "Security Improvement Rhythm", description: "Maintain the roadmap, evidence, ownership, supplier accountability, and periodic review cadence.", cadence: "Monthly or quarterly" },
    ],
    proof: {
      eyebrow: "Relevant published proof",
      title: "See a structured compliance-readiness product",
      description:
        "GRC Status demonstrates how control questions, evidence, ownership, and readiness can be organized into a practical starting point.",
      label: "View the GRC Status case study",
      href: "/services/portfolio/grcstatus",
      typeLabel: "GRC Status is a published ROALLA product example. It is not an audit, certification, or client performance claim.",
    },
    measuresTitle: "How progress can be measured",
    measures: [
      "Material gaps with assigned owners and target dates",
      "Control evidence completeness and review cadence",
      "Remediation progress and accepted residual risk",
      "Response, recovery, supplier, and continuity readiness",
    ],
    faqTitle: "Security, risk, and compliance questions",
    faqs: [
      ["Can ROALLA certify us as compliant?", "No. ROALLA can support readiness, evidence, control ownership, remediation, and solution sourcing. Formal audits, attestations, legal opinions, and certifications remain with appropriately qualified independent professionals."],
      ["Do we need to replace our current security tools?", "Not necessarily. The review begins with risks, obligations, ownership, evidence, and current capabilities. Replacement is recommended only when the business case and requirements support it."],
      ["Can ROALLA help source managed security?", "Yes. ROALLA can define requirements, compare qualified providers and commercial options, disclose relevant relationships, and support implementation and accountability."],
    ],
    finalTitle: "Turn security pressure into a prioritized, accountable plan.",
    finalBody:
      "Bring the customer requirement, risk concern, compliance pressure, or unclear responsibility. ROALLA will help define the evidence, remediation, service, and implementation path that fits.",
    cta: "Discuss security and compliance",
    resources: [
      { label: "Explore the security outcome", href: "/solutions/security" },
      { label: "Review security providers and disclosures", href: "/partners" },
    ],
    metadataTitle: "Security, Risk and Compliance Services | ROALLA",
    metadataDescription:
      "Security gap reviews, prioritized remediation, SOC 2 readiness support, managed security sourcing, continuity planning, and accountable implementation.",
  },
  fr: {
    eyebrow: "Sécuriser",
    title: "Réduire le risque, renforcer la sécurité et soutenir la conformité.",
    description:
      "ROALLA aide les dirigeants à comprendre les écarts de sécurité importants, prioriser la remédiation, clarifier la responsabilité des contrôles et évaluer des options qualifiées de sécurité et de services gérés selon les obligations et la tolérance au risque de l’organisation.",
    outcome:
      "Le résultat est un parcours pratique de réduction du risque avec des responsables désignés—pas une autre liste non priorisée d’outils ou de contrôles.",
    capabilities: [
      ["Revue de posture et des écarts de sécurité", "Examiner l’environnement actuel, les risques importants, les responsabilités, les preuves et les contrôles à traiter en premier."],
      ["Soutien à la préparation à la conformité", "Structurer les politiques, la responsabilité des contrôles, les preuves et la remédiation pour les exigences clients ou des cadres comme SOC 2."],
      ["Recherche de solutions de sécurité gérée", "Définir les exigences et comparer des options qualifiées de MDR, sécurité gérée, identité, infonuagique, réseau, sauvegarde et reprise."],
      ["Continuité et préparation aux incidents", "Clarifier les services essentiels, les attentes de reprise, les responsabilités d’intervention, les dépendances et les exercices pratiques."],
    ],
    process: [
      ["Clarifier", "Confirmer les obligations, les actifs sensibles, les contrôles actuels, les responsables et la tolérance au risque."],
      ["Évaluer", "Repérer les écarts importants et distinguer la remédiation urgente du travail de maturité à plus long terme."],
      ["Prioriser", "Séquencer les contrôles, responsables, preuves, options de service, coûts et dépendances dans une feuille de route pratique."],
      ["Activer", "Soutenir la remédiation, la recherche de solutions, la mise en œuvre, l’adoption et un rythme de revue reproductible."],
    ],
    deliverablesTitle: "Ce que vous recevez",
    deliverables: [
      "Une vue en langage clair des risques importants, contrôles actuels, preuves et écarts de responsabilité",
      "Une feuille de route de remédiation priorisée selon l’impact, l’urgence, l’effort et les dépendances",
      "Des exigences et critères de comparaison pour des options qualifiées de sécurité ou de services gérés",
      "Un plan de mise en œuvre et de revue avec responsables, jalons, mesures et points d’escalade",
    ],
    starter: {
      eyebrow: "Point de départ à faible risque",
      name: "Revue de préparation sécurité et conformité",
      description: "Établir l’état actuel, les obligations importantes, les écarts matériels et la plus petite étape utile avant un vaste programme ou un nouvel ensemble d’outils.",
      timeline: "Délai habituel : 1 à 2 semaines",
      investment: "Portée et prix fixes confirmés après une revue gratuite",
      includes: [
        "Contexte d’affaires, données, systèmes et obligations",
        "Revue des contrôles, responsabilités, preuves et dépendances",
        "Constats priorisés de risque et de remédiation",
        "Prochaine étape, parcours de service et mesures de réussite recommandés",
      ],
      fit: "Idéal pour les organisations confrontées à des questionnaires clients, à la préparation SOC 2, à une responsabilité de sécurité floue, à des risques récurrents ou à une décision de sécurité gérée.",
      exclusion: "Il ne s’agit pas de conseil juridique, d’un test d’intrusion, d’un audit formel, d’une certification ou d’un examen SOC 2 indépendant. Le travail spécialisé ou réglementé est cadré séparément avec des fournisseurs qualifiés.",
      cta: "Examiner notre préparation sécurité",
    },
    packagesTitle: "Façons de poursuivre",
    packages: [
      { name: "Revue de préparation", description: "Clarifier les obligations, les écarts importants, les responsables, les preuves et les premières priorités.", cadence: "1 à 2 semaines" },
      { name: "Remédiation et recherche de solutions", description: "Soutenir l’amélioration des contrôles et comparer des options qualifiées selon les mêmes exigences.", cadence: "Mandat par phases" },
      { name: "Rythme d’amélioration de la sécurité", description: "Maintenir la feuille de route, les preuves, les responsabilités, les fournisseurs et les revues périodiques.", cadence: "Mensuel ou trimestriel" },
    ],
    proof: {
      eyebrow: "Preuve publiée pertinente",
      title: "Voir un produit structuré de préparation à la conformité",
      description: "GRC Status montre comment organiser les questions de contrôle, les preuves, les responsabilités et la préparation en un point de départ pratique.",
      label: "Voir l’étude de cas GRC Status",
      href: "/services/portfolio/grcstatus",
      typeLabel: "GRC Status est un exemple de produit ROALLA publié. Il ne s’agit pas d’un audit, d’une certification ni d’un résultat client.",
    },
    measuresTitle: "Comment mesurer les progrès",
    measures: [
      "Écarts importants avec responsables et dates cibles",
      "Complétude des preuves et cadence de revue",
      "Progrès de remédiation et risque résiduel accepté",
      "Préparation à l’intervention, à la reprise, aux fournisseurs et à la continuité",
    ],
    faqTitle: "Questions sur la sécurité, le risque et la conformité",
    faqs: [
      ["ROALLA peut-elle nous certifier conformes?", "Non. ROALLA peut soutenir la préparation, les preuves, la responsabilité des contrôles, la remédiation et la recherche de solutions. Les audits, attestations, opinions juridiques et certifications demeurent la responsabilité de professionnels indépendants qualifiés."],
      ["Devons-nous remplacer nos outils de sécurité actuels?", "Pas nécessairement. La revue commence par les risques, obligations, responsabilités, preuves et capacités actuelles. Un remplacement n’est recommandé que lorsque les exigences et l’analyse de rentabilité le justifient."],
      ["ROALLA peut-elle aider à rechercher une sécurité gérée?", "Oui. ROALLA peut définir les exigences, comparer des fournisseurs et options commerciales qualifiés, divulguer les relations pertinentes et soutenir la mise en œuvre et la responsabilité."],
    ],
    finalTitle: "Transformer la pression de sécurité en plan priorisé et responsable.",
    finalBody: "Apportez l’exigence client, la préoccupation de risque, la pression de conformité ou la responsabilité floue. ROALLA aidera à définir le parcours de preuves, remédiation, service et mise en œuvre approprié.",
    cta: "Discuter sécurité et conformité",
    resources: [
      { label: "Explorer le résultat sécurité", href: "/solutions/security" },
      { label: "Voir les fournisseurs et divulgations", href: "/partners" },
    ],
    metadataTitle: "Services de sécurité, risque et conformité | ROALLA",
    metadataDescription: "Revues des écarts, remédiation priorisée, préparation SOC 2, recherche de sécurité gérée, continuité et mise en œuvre responsable.",
  },
};
