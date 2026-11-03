import type { ServiceActionServiceId } from '@/lib/service-action-tiles'

export type ServiceTrend = {
  id: string
  title: { en: string; fr: string }
  body: { en: string; fr: string }
  href?: string
  hrefLabel?: { en: string; fr: string }
}

export type ServiceTrendsBand = {
  eyebrow: { en: string; fr: string }
  title: { en: string; fr: string }
  description: { en: string; fr: string }
  trends: readonly ServiceTrend[]
}

const chrome = {
  eyebrow: { en: 'Looking to 2027', fr: 'Vers 2027' },
  title: {
    en: 'What leaders should prepare for next',
    fr: 'Ce que les dirigeants devraient préparer ensuite',
  },
  description: {
    en: 'Short signals—not a second brochure. Use them to pressure-test priorities before the next budget cycle.',
    fr: 'Des signaux courts—pas une deuxième brochure. Utilisez-les pour tester vos priorités avant le prochain cycle budgétaire.',
  },
} as const

export const serviceTrends2027: Record<ServiceActionServiceId, ServiceTrendsBand> = {
  'search-ai-visibility': {
    ...chrome,
    trends: [
      {
        id: 'answer-engines',
        title: {
          en: 'Answer engines reward clear entities',
          fr: 'Les moteurs de réponses récompensent des entités claires',
        },
        body: {
          en: 'AI summaries prefer businesses that state who they serve, what they offer, and where they operate—in language machines can quote.',
          fr: 'Les résumés IA préfèrent les entreprises qui disent clairement qui elles servent, ce qu’elles offrent et où elles opèrent—dans un langage citables.',
        },
        href: '/insights/how-ai-systems-understand-websites',
        hrefLabel: { en: 'How AI systems understand websites', fr: 'Comment les systèmes IA comprennent les sites' },
      },
      {
        id: 'structured-trust',
        title: {
          en: 'Structured data becomes table stakes',
          fr: 'Les données structurées deviennent indispensables',
        },
        body: {
          en: 'Schema, consistent NAP, and service pages that match real offers reduce misrepresentation in search and AI overlays.',
          fr: 'Le balisage, un NAP cohérent et des pages de services fidèles réduisent les mauvaises représentations dans la recherche et l’IA.',
        },
        href: '/insights/structured-data-for-small-business',
        hrefLabel: { en: 'Structured data for small business', fr: 'Données structurées pour PME' },
      },
      {
        id: 'geo-aeo',
        title: {
          en: 'GEO, SEO, and AEO converge',
          fr: 'GEO, SEO et AEO convergent',
        },
        body: {
          en: 'Visibility work is no longer “rankings only.” Teams need one plan for search, maps, and AI citation risk.',
          fr: 'La visibilité n’est plus « seulement le classement ». Les équipes ont besoin d’un plan pour recherche, cartes et citations IA.',
        },
        href: '/insights/geo-seo-aeo-and-bots',
        hrefLabel: { en: 'GEO, SEO, AEO, and bots', fr: 'GEO, SEO, AEO et bots' },
      },
    ],
  },
  'ai-agents': {
    ...chrome,
    trends: [
      {
        id: 'cost-governance',
        title: {
          en: 'Agent cost needs an operating model',
          fr: 'Le coût des agents exige un modèle d’exploitation',
        },
        body: {
          en: 'Token spend, tool calls, and human escalation become budget lines—not surprises after a pilot looks “cheap.”',
          fr: 'Dépenses de jetons, appels d’outils et escalades humaines deviennent des postes budgétaires—pas des surprises après un pilote « peu cher ».',
        },
        href: '/executive-insights',
        hrefLabel: { en: 'AI agent cost & governance 2027', fr: 'Coût et gouvernance des agents IA 2027' },
      },
      {
        id: 'human-in-loop',
        title: {
          en: 'Approve–act–audit becomes default',
          fr: 'Approuver–agir–auditer devient la norme',
        },
        body: {
          en: 'Frontline agents that change records without clear approvals create operational and compliance debt faster than they save time.',
          fr: 'Les agents qui modifient des dossiers sans approbations claires créent de la dette opérationnelle et de conformité plus vite qu’ils n’économisent du temps.',
        },
      },
      {
        id: 'workflow-first',
        title: {
          en: 'Workflow fitness beats model novelty',
          fr: 'L’adéquation du flux bat la nouveauté du modèle',
        },
        body: {
          en: 'The winning 2027 pattern is a narrow, measurable process with exceptions owned—not a general chatbot bolted onto chaos.',
          fr: 'Le modèle gagnant en 2027 est un processus étroit et mesurable avec exceptions assumées—pas un clavardage général sur le chaos.',
        },
        href: '/insights/practical-ai-use-cases',
        hrefLabel: { en: 'Practical AI use cases', fr: 'Cas d’usage IA pratiques' },
      },
    ],
  },
  security: {
    ...chrome,
    trends: [
      {
        id: 'coverage-ownership',
        title: {
          en: 'Coverage without ownership fails audits',
          fr: 'Une couverture sans responsabilités échoue aux audits',
        },
        body: {
          en: 'Boards ask who owns each control—not which logo sits on a slide. Ambiguous ownership is the new critical finding.',
          fr: 'Les conseils demandent qui possède chaque contrôle—pas quel logo figure sur une diapositive. L’ambiguïté est le nouveau constat critique.',
        },
        href: '/insights/it-provider-who-owns-risk',
        hrefLabel: { en: 'Who owns the risk with your IT provider', fr: 'Qui porte le risque avec votre fournisseur TI' },
      },
      {
        id: 'continuity-default',
        title: {
          en: 'Continuity joins security conversations',
          fr: 'La continuité rejoint les discussions de sécurité',
        },
        body: {
          en: 'Backup, recovery, and ransomware readiness move from annual IT topics into quarterly risk reviews.',
          fr: 'Sauvegarde, reprise et préparation aux rançongiciels passent de sujets TI annuels à des revues de risque trimestrielles.',
        },
        href: '/insights/cloud-backup-sync-recovery-differences',
        hrefLabel: { en: 'Backup, sync, and recovery differences', fr: 'Différences sauvegarde, sync et reprise' },
      },
      {
        id: 'saas-evidence',
        title: {
          en: 'Evidence packs beat policy binders',
          fr: 'Les dossiers de preuves battent les classeurs de politiques',
        },
        body: {
          en: 'Buyers and partners increasingly ask for living evidence of controls—not static PDFs written once.',
          fr: 'Acheteurs et partenaires demandent de plus en plus des preuves vivantes des contrôles—pas des PDF statiques.',
        },
        href: '/insights/what-to-expect-soc-2-examination-saas',
        hrefLabel: { en: 'What to expect in a SOC 2 examination', fr: 'À quoi s’attendre à un examen SOC 2' },
      },
    ],
  },
  'managed-optimization': {
    ...chrome,
    trends: [
      {
        id: 'experience-ops',
        title: {
          en: 'Experience ops becomes a standing function',
          fr: 'L’exploitation de l’expérience devient une fonction permanente',
        },
        body: {
          en: 'Launch is not the finish line. 2027 budgets protect measurement, accessibility, and conversion hygiene after go-live.',
          fr: 'Le lancement n’est pas la ligne d’arrivée. Les budgets 2027 protègent mesure, accessibilité et hygiène de conversion après mise en ligne.',
        },
        href: '/insights/web-development-digital-experience-outlook-2027',
        hrefLabel: { en: 'Web & digital experience outlook 2027', fr: 'Perspectives Web et expérience numérique 2027' },
      },
      {
        id: 'field-performance',
        title: {
          en: 'Field performance outranks lab scores',
          fr: 'La performance terrain surpasse les scores de laboratoire',
        },
        body: {
          en: 'Leaders track real-user experience and failed journeys—not only lighthouse snapshots from a quiet Monday.',
          fr: 'Les dirigeants suivent l’expérience réelle et les parcours échoués—pas seulement des instantanés Lighthouse un lundi calme.',
        },
        href: '/insights/website-after-launch',
        hrefLabel: { en: 'What to do after website launch', fr: 'Que faire après le lancement du site' },
      },
      {
        id: 'owned-backlog',
        title: {
          en: 'Owned improvement backlogs win',
          fr: 'Les backlogs d’amélioration avec propriétaires gagnent',
        },
        body: {
          en: 'Managed optimization succeeds when one owner sequences fixes against business outcomes—not endless ticket piles.',
          fr: 'L’optimisation gérée réussit quand un responsable séquence les correctifs selon les résultats d’affaires—pas une pile de billets sans fin.',
        },
      },
    ],
  },
  'digital-products': {
    ...chrome,
    trends: [
      {
        id: 'smallest-useful',
        title: {
          en: 'Smallest useful product beats big bets',
          fr: 'Le plus petit produit utile bat les gros paris',
        },
        body: {
          en: 'Teams ship one governed journey with evidence before funding multi-year platform fantasies.',
          fr: 'Les équipes livrent un parcours gouverné avec preuves avant de financer des fantasmes de plateforme pluriannuels.',
        },
        href: '/insights/web-development-digital-experience-outlook-2027',
        hrefLabel: { en: 'Web & digital experience outlook 2027', fr: 'Perspectives Web et expérience numérique 2027' },
      },
      {
        id: 'build-buy',
        title: {
          en: 'Build vs buy stays an executive decision',
          fr: 'Construire ou acheter reste une décision de direction',
        },
        body: {
          en: 'Product choices fail when teams skip requirements, ownership, and exit options before selecting a stack.',
          fr: 'Les choix de produit échouent quand les équipes sautent exigences, responsabilités et options de sortie avant de choisir une pile.',
        },
        href: '/insights/build-buy-or-integrate-technology',
        hrefLabel: { en: 'Build, buy, or integrate', fr: 'Construire, acheter ou intégrer' },
      },
      {
        id: 'adoption-design',
        title: {
          en: 'Adoption is designed, not hoped for',
          fr: 'L’adoption se conçoit—elle ne s’espère pas',
        },
        body: {
          en: '2027 products that stick include training paths, exception owners, and success measures from day one.',
          fr: 'Les produits 2027 qui durent incluent parcours de formation, responsables d’exceptions et mesures de succès dès le jour un.',
        },
        href: '/insights/website-portal-or-custom-app',
        hrefLabel: { en: 'Website, portal, or custom app', fr: 'Site, portail ou appli sur mesure' },
      },
    ],
  },
}

export function getServiceTrends2027(serviceId: ServiceActionServiceId): ServiceTrendsBand {
  return serviceTrends2027[serviceId]
}
