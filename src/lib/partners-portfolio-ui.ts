import type { EcosystemPortfolioTag } from '@/lib/ecosystem-governance'

/** Subtle slate-led accents by primary portfolio (not rainbow cards). */
export const portfolioAccentClass: Record<EcosystemPortfolioTag, string> = {
  security: 'border-l-rose-800/70',
  unified_communications: 'border-l-sky-800/70',
  conversational_ai: 'border-l-teal-800/70',
  cloud: 'border-l-indigo-800/70',
  managed_services: 'border-l-slate-700',
  infrastructure: 'border-l-amber-800/70',
  connectivity: 'border-l-emerald-800/70',
  applications: 'border-l-violet-800/70',
  solution_sourcing: 'border-l-primary-dark',
}

export const portfolioTileClass: Record<EcosystemPortfolioTag, string> = {
  security: 'bg-rose-50/50 ring-rose-200/80',
  unified_communications: 'bg-sky-50/50 ring-sky-200/80',
  conversational_ai: 'bg-teal-50/50 ring-teal-200/80',
  cloud: 'bg-indigo-50/50 ring-indigo-200/80',
  managed_services: 'bg-slate-50 ring-slate-200',
  infrastructure: 'bg-amber-50/50 ring-amber-200/80',
  connectivity: 'bg-emerald-50/50 ring-emerald-200/80',
  applications: 'bg-violet-50/50 ring-violet-200/80',
  solution_sourcing: 'bg-primary/5 ring-primary/25',
}

export function primaryPortfolio(
  portfolio: readonly EcosystemPortfolioTag[],
): EcosystemPortfolioTag | null {
  return portfolio[0] ?? null
}

export function partnersBriefHref(params: {
  portfolio?: EcosystemPortfolioTag | null
  need?: string | null
  audience?: string | null
}) {
  const query: Record<string, string> = { from: 'partners-directory' }
  if (params.portfolio) query.portfolio = params.portfolio
  if (params.need) query.need = params.need.slice(0, 80)
  if (params.audience) query.audience = params.audience
  return {
    pathname: '/tools/technology-decision-brief' as const,
    query,
  }
}

export const PARTNERS_HASH_EVENT = 'partners:highlight-vendor'
