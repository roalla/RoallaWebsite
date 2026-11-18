'use client'

import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { AgentWorkflowMotion } from '@/components/motion/OperationalMotion'

type Props = {
  locale: 'en' | 'fr'
}

const related = {
  en: {
    controlEyebrow: 'How control looks',
    controlTitle: 'Automation with a human checkpoint',
    controlLead:
      'Agents and automations prepare the work. People approve exceptions. The audit trail stays with the outcome.',
    relatedEyebrow: 'Keep exploring',
    relatedTitle: 'Related destinations',
    relatedLead: 'Go deeper on frontline AI, governed agents, or the full automation pathway.',
    links: [
      {
        href: '/ai-employee' as const,
        label: 'AI Employee by industry',
        description: 'Frontline use cases across calls and messages—with people owning exceptions.',
        track: 'related_ai_employee',
      },
      {
        href: '/services/ai-agents' as const,
        label: 'AI agents service',
        description: 'Governed agents with escalation paths and measurable containment.',
        track: 'related_ai_agents',
      },
    ],
    pathwayLabel: 'Automation pathway details',
    pathwayDescription: 'See how ROALLA sequences evidence, controls, and enablement for this outcome.',
  },
  fr: {
    controlEyebrow: 'À quoi ressemble le contrôle',
    controlTitle: 'Automatisation avec point de contrôle humain',
    controlLead:
      'Agents et automatisations préparent le travail. Les personnes approuvent les exceptions. La piste d’audit reste avec le résultat.',
    relatedEyebrow: 'Continuer l’exploration',
    relatedTitle: 'Destinations connexes',
    relatedLead: 'Approfondissez l’IA de première ligne, les agents gouvernés ou le parcours d’automatisation complet.',
    links: [
      {
        href: '/ai-employee' as const,
        label: 'Employé IA par industrie',
        description: 'Cas d’usage de première ligne sur appels et messages—avec des personnes responsables des exceptions.',
        track: 'related_ai_employee',
      },
      {
        href: '/services/ai-agents' as const,
        label: 'Service agents IA',
        description: 'Agents gouvernés avec parcours d’escalade et confinement mesurable.',
        track: 'related_ai_agents',
      },
    ],
    pathwayLabel: 'Détails du parcours d’automatisation',
    pathwayDescription:
      'Voir comment ROALLA séquence preuves, contrôles et mise en service pour ce résultat.',
  },
} as const

export default function AutomationAiNeedExtras({ locale }: Props) {
  const copy = related[locale]
  const campaign = {
    campaign: 'solutions-automation-ai',
    conversion_source: 'solutions_need_automation_extras',
    entry_page: '/solutions/need/automation-ai',
  }

  return (
    <div className="mt-14 space-y-14">
      <section aria-labelledby="automation-control-heading">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.controlEyebrow}</p>
        <h2 id="automation-control-heading" className="mt-2 font-serif text-3xl font-bold text-slate-950">
          {copy.controlTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{copy.controlLead}</p>
        <div className="mt-8">
          <AgentWorkflowMotion locale={locale} />
        </div>
      </section>

      <section aria-labelledby="automation-related-heading">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.relatedEyebrow}</p>
        <h2 id="automation-related-heading" className="mt-2 font-serif text-3xl font-bold text-slate-950">
          {copy.relatedTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{copy.relatedLead}</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {copy.links.map((item) => (
            <li key={item.href}>
              <Link
                href={{ pathname: item.href, query: campaign }}
                onClick={() =>
                  trackAnalyticsEvent('solutions_tool_click', {
                    location: `automation_ai_${item.track}`,
                    tool: item.href,
                    group: 'automation-ai',
                  })
                }
                className="block h-full border border-slate-200 bg-white p-5 transition hover:border-primary/40"
              >
                <span className="inline-flex items-center font-semibold text-primary-dark">
                  {item.label}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </span>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={{
                pathname: '/solutions/[slug]',
                params: { slug: 'automation-ai' },
                query: campaign,
              }}
              onClick={() =>
                trackAnalyticsEvent('solutions_pathway_click', {
                  location: 'automation_ai_related_pathway',
                  pathway: 'automation-ai',
                  group: 'automation-ai',
                })
              }
              className="block h-full border border-slate-200 bg-white p-5 transition hover:border-primary/40"
            >
              <span className="inline-flex items-center font-semibold text-primary-dark">
                {copy.pathwayLabel}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </span>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy.pathwayDescription}</p>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
