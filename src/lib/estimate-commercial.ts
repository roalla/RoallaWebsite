/**
 * Shared commercial framing for package estimators.
 * Launch baseline on a new site is included (platform-style), not an upsell.
 * Visibility foundation is a separate retrofit program for existing footprints.
 */

export const ESTIMATE_PRICING_VERSION = '2026.11'

/** Discussion window for preliminary estimates (days from “as of” date). */
export const ESTIMATE_VALIDITY_DAYS = 30

export function getEstimateAsOfDate(now = new Date()): string {
  return now.toISOString().slice(0, 10)
}

export function getEstimateValidUntilDate(now = new Date()): string {
  const end = new Date(now)
  end.setUTCDate(end.getUTCDate() + ESTIMATE_VALIDITY_DAYS)
  return end.toISOString().slice(0, 10)
}

export function formatEstimateValidityCopy(locale: string, now = new Date()): string {
  const asOf = getEstimateAsOfDate(now)
  const until = getEstimateValidUntilDate(now)
  if (locale === 'fr') {
    return `Prix en vigueur au ${asOf} (version ${ESTIMATE_PRICING_VERSION}). Estimation préliminaire, valable pour discussion jusqu’au ${until}. Confirmation écrite avant travaux.`
  }
  return `Prices as of ${asOf} (version ${ESTIMATE_PRICING_VERSION}). Preliminary estimate, valid for discussion until ${until}. Written confirmation before work begins.`
}

export function formatEstimateWhatHappensNext(locale: string): string {
  if (locale === 'fr') {
    return 'Ensuite: nous revoyons vos choix, confirmons la portée par écrit, puis planifions le démarrage.'
  }
  return 'What happens next: we review your selections, confirm scope in writing, then schedule kickoff.'
}
