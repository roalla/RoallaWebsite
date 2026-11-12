export type EstimateRegionId =
  | 'CA-AB'
  | 'CA-BC'
  | 'CA-MB'
  | 'CA-NB'
  | 'CA-NL'
  | 'CA-NS'
  | 'CA-NT'
  | 'CA-NU'
  | 'CA-ON'
  | 'CA-PE'
  | 'CA-QC'
  | 'CA-SK'
  | 'CA-YT'
  | 'US-AL'
  | 'US-AK'
  | 'US-AZ'
  | 'US-AR'
  | 'US-CA'
  | 'US-CO'
  | 'US-CT'
  | 'US-DE'
  | 'US-DC'
  | 'US-FL'
  | 'US-GA'
  | 'US-HI'
  | 'US-ID'
  | 'US-IL'
  | 'US-IN'
  | 'US-IA'
  | 'US-KS'
  | 'US-KY'
  | 'US-LA'
  | 'US-ME'
  | 'US-MD'
  | 'US-MA'
  | 'US-MI'
  | 'US-MN'
  | 'US-MS'
  | 'US-MO'
  | 'US-MT'
  | 'US-NE'
  | 'US-NV'
  | 'US-NH'
  | 'US-NJ'
  | 'US-NM'
  | 'US-NY'
  | 'US-NC'
  | 'US-ND'
  | 'US-OH'
  | 'US-OK'
  | 'US-OR'
  | 'US-PA'
  | 'US-RI'
  | 'US-SC'
  | 'US-SD'
  | 'US-TN'
  | 'US-TX'
  | 'US-UT'
  | 'US-VT'
  | 'US-VA'
  | 'US-WA'
  | 'US-WV'
  | 'US-WI'
  | 'US-WY'
  | 'other'

export type EstimateTaxLineDef = {
  id: string
  rate: number
  label: { en: string; fr: string }
}

export type EstimateTaxLine = EstimateTaxLineDef & { amount: number }

export type EstimateTaxSchedule = {
  /** False until the customer selects a region (no invented tax). */
  ready: boolean
  lines: EstimateTaxLineDef[]
  /** BC / SK / MB — GST quoted; PST/RST may apply on confirmation. */
  provincialSalesTaxMaybeApplies: boolean
  note: { en: string; fr: string } | null
}

type RegionOption = { id: EstimateRegionId; label: { en: string; fr: string }; group: 'ca' | 'us' | 'other' }

const CA_REGIONS: RegionOption[] = [
  { id: 'CA-AB', label: { en: 'Alberta', fr: 'Alberta' }, group: 'ca' },
  { id: 'CA-BC', label: { en: 'British Columbia', fr: 'Colombie-Britannique' }, group: 'ca' },
  { id: 'CA-MB', label: { en: 'Manitoba', fr: 'Manitoba' }, group: 'ca' },
  { id: 'CA-NB', label: { en: 'New Brunswick', fr: 'Nouveau-Brunswick' }, group: 'ca' },
  { id: 'CA-NL', label: { en: 'Newfoundland and Labrador', fr: 'Terre-Neuve-et-Labrador' }, group: 'ca' },
  { id: 'CA-NS', label: { en: 'Nova Scotia', fr: 'Nouvelle-Écosse' }, group: 'ca' },
  { id: 'CA-NT', label: { en: 'Northwest Territories', fr: 'Territoires du Nord-Ouest' }, group: 'ca' },
  { id: 'CA-NU', label: { en: 'Nunavut', fr: 'Nunavut' }, group: 'ca' },
  { id: 'CA-ON', label: { en: 'Ontario', fr: 'Ontario' }, group: 'ca' },
  { id: 'CA-PE', label: { en: 'Prince Edward Island', fr: 'Île-du-Prince-Édouard' }, group: 'ca' },
  { id: 'CA-QC', label: { en: 'Quebec', fr: 'Québec' }, group: 'ca' },
  { id: 'CA-SK', label: { en: 'Saskatchewan', fr: 'Saskatchewan' }, group: 'ca' },
  { id: 'CA-YT', label: { en: 'Yukon', fr: 'Yukon' }, group: 'ca' },
]

const US_STATE_NAMES: { id: EstimateRegionId; en: string }[] = [
  { id: 'US-AL', en: 'Alabama' },
  { id: 'US-AK', en: 'Alaska' },
  { id: 'US-AZ', en: 'Arizona' },
  { id: 'US-AR', en: 'Arkansas' },
  { id: 'US-CA', en: 'California' },
  { id: 'US-CO', en: 'Colorado' },
  { id: 'US-CT', en: 'Connecticut' },
  { id: 'US-DE', en: 'Delaware' },
  { id: 'US-DC', en: 'District of Columbia' },
  { id: 'US-FL', en: 'Florida' },
  { id: 'US-GA', en: 'Georgia' },
  { id: 'US-HI', en: 'Hawaii' },
  { id: 'US-ID', en: 'Idaho' },
  { id: 'US-IL', en: 'Illinois' },
  { id: 'US-IN', en: 'Indiana' },
  { id: 'US-IA', en: 'Iowa' },
  { id: 'US-KS', en: 'Kansas' },
  { id: 'US-KY', en: 'Kentucky' },
  { id: 'US-LA', en: 'Louisiana' },
  { id: 'US-ME', en: 'Maine' },
  { id: 'US-MD', en: 'Maryland' },
  { id: 'US-MA', en: 'Massachusetts' },
  { id: 'US-MI', en: 'Michigan' },
  { id: 'US-MN', en: 'Minnesota' },
  { id: 'US-MS', en: 'Mississippi' },
  { id: 'US-MO', en: 'Missouri' },
  { id: 'US-MT', en: 'Montana' },
  { id: 'US-NE', en: 'Nebraska' },
  { id: 'US-NV', en: 'Nevada' },
  { id: 'US-NH', en: 'New Hampshire' },
  { id: 'US-NJ', en: 'New Jersey' },
  { id: 'US-NM', en: 'New Mexico' },
  { id: 'US-NY', en: 'New York' },
  { id: 'US-NC', en: 'North Carolina' },
  { id: 'US-ND', en: 'North Dakota' },
  { id: 'US-OH', en: 'Ohio' },
  { id: 'US-OK', en: 'Oklahoma' },
  { id: 'US-OR', en: 'Oregon' },
  { id: 'US-PA', en: 'Pennsylvania' },
  { id: 'US-RI', en: 'Rhode Island' },
  { id: 'US-SC', en: 'South Carolina' },
  { id: 'US-SD', en: 'South Dakota' },
  { id: 'US-TN', en: 'Tennessee' },
  { id: 'US-TX', en: 'Texas' },
  { id: 'US-UT', en: 'Utah' },
  { id: 'US-VT', en: 'Vermont' },
  { id: 'US-VA', en: 'Virginia' },
  { id: 'US-WA', en: 'Washington' },
  { id: 'US-WV', en: 'West Virginia' },
  { id: 'US-WI', en: 'Wisconsin' },
  { id: 'US-WY', en: 'Wyoming' },
]

const US_REGIONS: RegionOption[] = US_STATE_NAMES.map((state) => ({
  id: state.id,
  label: { en: state.en, fr: state.en },
  group: 'us' as const,
}))

export const ESTIMATE_REGION_OPTIONS: RegionOption[] = [
  ...CA_REGIONS,
  ...US_REGIONS,
  {
    id: 'other',
    label: { en: 'Other / outside Canada–US', fr: 'Autre / hors Canada–É.-U.' },
    group: 'other',
  },
]

const REGION_IDS = new Set(ESTIMATE_REGION_OPTIONS.map((item) => item.id))

export function isEstimateRegionId(value: string): value is EstimateRegionId {
  return REGION_IDS.has(value as EstimateRegionId)
}

export function getEstimateRegionLabel(regionId: string, locale: string): string {
  const option = ESTIMATE_REGION_OPTIONS.find((item) => item.id === regionId)
  if (!option) return regionId
  return locale === 'fr' ? option.label.fr : option.label.en
}

function gstLine(rate = 0.05): EstimateTaxLineDef {
  return {
    id: 'gst',
    rate,
    label: { en: `GST (${Math.round(rate * 100)}%)`, fr: `TPS (${Math.round(rate * 100)} %)` },
  }
}

function hstLine(rate: number): EstimateTaxLineDef {
  const pct = Number.isInteger(rate * 100) ? String(Math.round(rate * 100)) : (rate * 100).toFixed(3)
  return {
    id: 'hst',
    rate,
    label: { en: `HST (${pct}%)`, fr: `TVH (${pct.replace('.', ',')} %)` },
  }
}

export function getEstimateTaxSchedule(regionId: string | null | undefined): EstimateTaxSchedule {
  if (!regionId || !isEstimateRegionId(regionId)) {
    return {
      ready: false,
      lines: [],
      provincialSalesTaxMaybeApplies: false,
      note: {
        en: 'Select your province or state to estimate applicable tax.',
        fr: 'Sélectionnez votre province ou État pour estimer la taxe applicable.',
      },
    }
  }

  if (regionId === 'other' || regionId.startsWith('US-')) {
    return {
      ready: true,
      lines: [],
      provincialSalesTaxMaybeApplies: false,
      note: {
        en: 'CAD quote. Sales tax scoped on confirmation.',
        fr: 'Estimation en $ CA. Taxes de vente confirmées au cadrage.',
      },
    }
  }

  switch (regionId) {
    case 'CA-ON':
      return { ready: true, lines: [hstLine(0.13)], provincialSalesTaxMaybeApplies: false, note: null }
    case 'CA-NB':
    case 'CA-NL':
    case 'CA-NS':
    case 'CA-PE':
      return { ready: true, lines: [hstLine(0.15)], provincialSalesTaxMaybeApplies: false, note: null }
    case 'CA-QC':
      return {
        ready: true,
        lines: [
          gstLine(0.05),
          {
            id: 'qst',
            rate: 0.09975,
            label: { en: 'QST (9.975%)', fr: 'TVQ (9,975 %)' },
          },
        ],
        provincialSalesTaxMaybeApplies: false,
        note: null,
      }
    case 'CA-BC':
    case 'CA-SK':
    case 'CA-MB':
      return {
        ready: true,
        lines: [gstLine(0.05)],
        provincialSalesTaxMaybeApplies: true,
        note: {
          en: 'GST estimated. Provincial sales tax may apply depending on the supply—confirmed on scoping.',
          fr: 'TPS estimée. Une taxe de vente provinciale peut s’appliquer selon la fourniture—confirmée au cadrage.',
        },
      }
    case 'CA-AB':
    case 'CA-YT':
    case 'CA-NT':
    case 'CA-NU':
      return { ready: true, lines: [gstLine(0.05)], provincialSalesTaxMaybeApplies: false, note: null }
    default:
      return {
        ready: false,
        lines: [],
        provincialSalesTaxMaybeApplies: false,
        note: {
          en: 'Select your province or state to estimate applicable tax.',
          fr: 'Sélectionnez votre province ou État pour estimer la taxe applicable.',
        },
      }
  }
}

export function applyEstimateTax(subtotal: number, regionId: string | null | undefined) {
  const schedule = getEstimateTaxSchedule(regionId)
  const taxLines: EstimateTaxLine[] = schedule.lines.map((line) => ({
    ...line,
    amount: subtotal * line.rate,
  }))
  const taxTotal = taxLines.reduce((sum, line) => sum + line.amount, 0)
  return {
    taxReady: schedule.ready,
    taxLines,
    taxTotal,
    /** @deprecated Prefer taxTotal — kept so older call sites keep working during migration. */
    hst: taxTotal,
    firstYearTotal: schedule.ready ? subtotal + taxTotal : subtotal,
    provincialSalesTaxMaybeApplies: schedule.provincialSalesTaxMaybeApplies,
    taxNote: schedule.note,
  }
}

export function getRegionConsiderations(
  locale: string,
  regionId: string | null | undefined,
): string[] {
  if (!regionId || !isEstimateRegionId(regionId)) return []
  const fr = locale === 'fr'

  if (regionId === 'CA-QC') {
    return [
      fr
        ? 'Loi 25 et attentes de confidentialité au Québec : précisez où les données client sont traitées et conservées.'
        : 'Quebec Law 25 and privacy expectations: be clear where customer data is processed and stored.',
      fr
        ? 'La présence publique bilingue (ou en français) compte souvent pour la découverte locale et la confiance.'
        : 'Bilingual or French-facing public presence often matters for local discovery and trust.',
    ]
  }

  if (regionId.startsWith('CA-')) {
    const tips = [
      fr
        ? 'Les prix ROALLA sont en dollars canadiens à l’échelle nationale; la taxe suit le lieu du client.'
        : 'ROALLA package prices are CAD nationwide; tax follows the customer location.',
    ]
    if (regionId === 'CA-BC' || regionId === 'CA-SK' || regionId === 'CA-MB') {
      tips.push(
        fr
          ? 'La TPS est estimée ici; toute taxe de vente provinciale applicable sera confirmée au cadrage.'
          : 'GST is estimated here; any applicable provincial sales tax is confirmed during scoping.',
      )
    }
    return tips
  }

  if (regionId.startsWith('US-') || regionId === 'other') {
    return [
      fr
        ? 'Estimation en $ CA. Les taxes de vente locales sont cadrées à la confirmation—pas inventées dans cet outil.'
        : 'CAD quote. Local sales tax is scoped on confirmation—not invented in this tool.',
    ]
  }

  return []
}
