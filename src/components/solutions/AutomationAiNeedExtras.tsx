'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { AgentWorkflowMotion } from '@/components/motion/OperationalMotion'
import { outcomeEvidence } from '@/lib/solution-outcome-pages'

type Props = {
  locale: 'en' | 'fr'
}

const related = {
  en: {
    proofEyebrow: 'Published proof',
    proofTitle: 'Inspectable products—not slideware',
    proofLead:
      'These are live ROALLA products with scoring, practice, or capture flows that already put automation and AI under human control.',
    proofCta: 'View case',
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
    proofEyebrow: 'Preuves publiées',
    proofTitle: 'Des produits inspectables—pas des diapositives',
    proofLead:
      'Ce sont des produits ROALLA en ligne avec notation, pratique ou capture qui placent déjà l’automatisation et l’IA sous contrôle humain.',
    proofCta: 'Voir le cas',
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
  const evidence = outcomeEvidence['automation-ai'] ?? []
  const campaign = {
    campaign: 'solutions-automation-ai',
    conversion_source: 'solutions_need_automation_extras',
    entry_page: '/solutions/need/automation-ai',
  }

  return (
    <div className="mt-14 space-y-14">
      {evidence.length > 0 ? (
        <section aria-labelledby="automation-proof-heading">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{copy.proofEyebrow}</p>
          <h2 id="automation-proof-heading" className="mt-2 font-serif text-3xl font-bold text-slate-950">
            {copy.proofTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{copy.proofLead}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {evidence.map((item) => (
              <li key={item.slug}>
                <Link
                  href={{ pathname: '/services/portfolio/[slug]', params: { slug: item.slug } }}
                  onClick={() =>
                    trackAnalyticsEvent('solutions_tool_click', {
                      location: 'automation_ai_proof_tile',
                      tool: item.slug,
                      group: 'automation-ai',
                    })
                  }
                  className="group block h-full overflow-hidden border border-slate-200 bg-white transition hover:border-primary/40"
                >
                  {item.image ? (
                    <span className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
                      <Image
                        src={item.image}
                        alt={item.title[locale]}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </span>
                  ) : null}
                  <span className="block p-5">
                    <span className="block font-serif text-xl font-bold text-slate-950">{item.title[locale]}</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600">{item.description[locale]}</span>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark">
                      {copy.proofCta}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
