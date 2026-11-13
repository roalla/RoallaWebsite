export type EstimateWizardMode = 'form' | 'wizard'

export type EstimateWizardTool = 'website' | 'visibility' | 'email' | 'workshop'

export function estimateWizardStorageKey(tool: EstimateWizardTool): string {
  return `roalla-estimate-wizard-${tool}`
}

/** Resolve mode from URL (?wizard=1|0) then sessionStorage; default form. */
export function resolveEstimateWizardMode(
  search: string | URLSearchParams | null | undefined,
  stored: string | null | undefined,
): EstimateWizardMode {
  const params =
    typeof search === 'string'
      ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
      : search instanceof URLSearchParams
        ? search
        : new URLSearchParams()
  const query = params.get('wizard')?.trim()
  if (query === '1' || query === 'true') return 'wizard'
  if (query === '0' || query === 'false') return 'form'
  if (stored === 'wizard' || stored === 'form') return stored
  return 'form'
}

export function readStoredWizardMode(tool: EstimateWizardTool): EstimateWizardMode | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.sessionStorage.getItem(estimateWizardStorageKey(tool))
    if (value === 'wizard' || value === 'form') return value
  } catch {
    /* ignore */
  }
  return null
}

export function writeStoredWizardMode(tool: EstimateWizardTool, mode: EstimateWizardMode) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(estimateWizardStorageKey(tool), mode)
  } catch {
    /* ignore quota */
  }
}

export const ESTIMATE_WIZARD_LABELS = {
  en: {
    guidedSteps: 'Guided steps',
    showAllOptions: 'Show all options',
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    back: 'Back',
    continue: 'Continue',
    done: 'Done',
  },
  fr: {
    guidedSteps: 'Étapes guidées',
    showAllOptions: 'Voir toutes les options',
    stepOf: (n: number, total: number) => `Étape ${n} sur ${total}`,
    back: 'Retour',
    continue: 'Continuer',
    done: 'Terminé',
  },
} as const
